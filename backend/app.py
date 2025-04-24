from flask import Flask, request, jsonify
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from flask_cors import CORS
from sklearn.neighbors import KNeighborsClassifier
import pandas as pd
import os
import mysql.connector

# Konfigurasi koneksi database MySQL
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'game_rating_db'
}


app = Flask(__name__)
CORS(app)


DATASET_FILE = os.path.join(os.path.dirname(__file__), "dataset.xlsx")

# Mapping angka ke kategori jawaban
ANSWER_MAPPING = {
    0: "Tidak Mengandung",
    1: "Sangat Sedikit Mengandung",
    2: "Agak Mengandung",
    3: "Cukup Mengandung",
    4: "Banyak Mengandung",
    5: "Sangat Banyak Mengandung"
}

REVERSE_MAPPING = {v: k for k, v in ANSWER_MAPPING.items()}

# Fungsi untuk membaca dataset
def load_dataset():
    if os.path.exists(DATASET_FILE):
        try:
            data = pd.read_excel(DATASET_FILE)

            if data.empty:
                data = pd.DataFrame(columns=["Nama Game", "Kekerasan", "Bahasa Kasar", "Tema Seksual", "Darah/Gore", "Elemen Perjudian", "Rating"])
                data.to_excel(DATASET_FILE, index=False)
        except Exception as e:
            print("Error saat membaca dataset:", e)
            data = pd.DataFrame(columns=["Nama Game", "Kekerasan", "Bahasa Kasar", "Tema Seksual", "Darah/Gore", "Elemen Perjudian", "Rating"])
            data.to_excel(DATASET_FILE, index=False)
    else:
        data = pd.DataFrame(columns=["Nama Game", "Kekerasan", "Bahasa Kasar", "Tema Seksual", "Darah/Gore", "Elemen Perjudian", "Rating"])
        data.to_excel(DATASET_FILE, index=False)

    print("Kolom dalam dataset:", data.columns.tolist())

    required_columns = ["Nama Game", "Kekerasan", "Bahasa Kasar", "Tema Seksual", "Darah/Gore", "Elemen Perjudian", "Rating"]
    for col in required_columns:
        if col not in data.columns:
            raise ValueError(f"Kolom '{col}' tidak ditemukan dalam dataset!")

    X = data.iloc[:, 1:-1].values
    y = data.iloc[:, -1].values

    return X, y, data

# Fungsi untuk menambahkan data ke dataset
def add_to_dataset(name, features, rating):
    data = pd.read_excel(DATASET_FILE)

    if name not in data['Nama Game'].values:
        new_row = [name] + features + [rating]
        data.loc[len(data)] = new_row
        data.to_excel(DATASET_FILE, index=False)

# Fungsi untuk menyimpan ke database MySQL
def save_rating_to_db(game_name, rating):
    kategori_map = {
        "SU": "Semua Umur",
        "3+": "Untuk usia 3 tahun ke atas",
        "7+": "Untuk usia 7 tahun ke atas",
        "13+": "Untuk usia 13 tahun ke atas",
        "18+": "Untuk usia 18 tahun ke atas"
    }
    kategori = kategori_map.get(rating, "Tidak diketahui")

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS riwayat (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nama_game VARCHAR(255),
                rating VARCHAR(10),
                kategori VARCHAR(100)
            )
        """)

        cursor.execute("""
            INSERT INTO riwayat (nama_game, rating, kategori)
            VALUES (%s, %s, %s)
        """, (game_name, rating, kategori))

        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print("ERROR saat menyimpan ke database:", err)


# Endpoint untuk mengecek apakah game sudah ada dalam dataset
@app.route('/check_game', methods=['POST'])
def check_game():
    try:
        data = request.json
        game_name = data['game_name']

        _, _, dataset = load_dataset()

        if game_name in dataset["Nama Game"].values:
            rating = dataset.loc[dataset["Nama Game"] == game_name, "Rating"].values[0]
            return jsonify({'exists': True, 'rating': rating})

        return jsonify({'exists': False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint untuk menerima jawaban dan memberikan rating
@app.route('/submit_answers', methods=['POST'])
def submit_answers():
    try:
        data = request.json
        print("=== DATA DITERIMA DARI FRONTEND ===")
        print(data)

        game_name = data.get('game_name', '').strip()
        answers = data.get('answers', [])

        if not game_name or not answers:
            print("ERROR: Data tidak lengkap")
            return jsonify({"error": "Data tidak lengkap"}), 400

        print("Nama Game:", game_name)
        print("Jawaban:", answers)

        # Cek apakah jawaban valid
        features = []
        for answer in answers:
            if answer not in REVERSE_MAPPING:
                print(f"ERROR: Jawaban tidak valid -> {answer}")
                return jsonify({"error": f"Jawaban tidak valid: {answer}"}), 400
            features.append(REVERSE_MAPPING[answer])

        print("Features (dikonversi ke angka):", features)


        X, y, dataset = load_dataset()

        # Jika game sudah ada di dataset, kembalikan rating yang sudah ada
        if game_name in dataset["Nama Game"].values:
            existing_rating = dataset.loc[dataset["Nama Game"] == game_name, "Rating"].values[0]
            print("Game ditemukan dalam dataset. Rating:", existing_rating)
            return jsonify({'rating': existing_rating})

        # Prediksi rating dengan KNN jika dataset cukup besar
        if len(X) > 3:
            knn = KNeighborsClassifier(n_neighbors=5)
            knn.fit(X, y)
            predicted_rating = knn.predict([features])[0]
        else:
            total_score = sum(features)
            if total_score <= 5:
                predicted_rating = "SU"
            elif total_score <= 10:
                predicted_rating = "3+"
            elif total_score <= 15:
                predicted_rating = "7+"
            elif total_score <= 20:
                predicted_rating = "13+"
            else:
                predicted_rating = "18+"

        print("Prediksi Rating:", predicted_rating)

        add_to_dataset(game_name, features, predicted_rating)
        save_rating_to_db(game_name, predicted_rating)
        return jsonify({'rating': predicted_rating})

    except Exception as e:
        print("ERROR di backend:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    try:
        query = request.args.get('query', '').strip().lower()

        if not query:
            return jsonify([])

        _, _, dataset = load_dataset()

        # Mencari game yang mengandung teks yang diketik pengguna
        suggestions = dataset[dataset["Nama Game"].str.lower().str.contains(query, na=False)]["Nama Game"].tolist()

        return jsonify(suggestions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/latest_games', methods=['GET'])
def latest_games():
    _, _, dataset = load_dataset()
    
    latest_games = dataset["Nama Game"].dropna().values[-4:].tolist()
    
    return jsonify(latest_games)

@app.route('/all_games', methods=['GET'])
def all_games():
    try:
        _, _, dataset = load_dataset()
        
        if "Nama Game" in dataset.columns and "Rating" in dataset.columns:
            games = dataset[["Nama Game", "Rating"]].to_dict(orient="records")
            return jsonify(games)

        return jsonify({"error": "Kolom Nama Game atau Rating tidak ditemukan"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route('/evaluate_model', methods=['GET'])
# def evaluate():
#     try:
#         X, y, _ = load_dataset()

#         if len(X) < 2:
#             return jsonify({"error": "Dataset terlalu kecil untuk evaluasi"}), 400

#         knn = KNeighborsClassifier(n_neighbors=5)
#         knn.fit(X, y)
#         y_pred = knn.predict(X)

#         labels = sorted(list(set(y)))
#         cm = confusion_matrix(y, y_pred, labels=labels)
#         accuracy = accuracy_score(y, y_pred)

#         # Hitung metrik per kelas secara manual
#         results = {}
#         total_TP = total_FP = total_FN = total_TN = 0

#         for i, label in enumerate(labels):
#             TP = cm[i][i]
#             FN = sum(cm[i]) - TP
#             FP = sum(cm[:, i]) - TP
#             TN = cm.sum() - (TP + FN + FP)

#             recall = TP / (TP + FN) if (TP + FN) else 0
#             precision = TP / (TP + FP) if (TP + FP) else 0

#             results[label] = {
#                 "TP": int(TP),
#                 "FN": int(FN),
#                 "FP": int(FP),
#                 "TN": int(TN),
#                 "recall": round(float(recall), 4),
#                 "recall_formula": f"{int(TP)} / ({int(TP)} + {int(FN)})",
#                 "precision": round(float(precision), 4),
#                 "precision_formula": f"{int(TP)} / ({int(TP)} + {int(FP)})",
#             }


#             total_TP += TP
#             total_FP += FP
#             total_FN += FN
#             total_TN += TN

#         acc_formula = f"({total_TP} + {total_TN}) / ({total_TP} + {total_TN} + {total_FP} + {total_FN})"
#         acc_value = (total_TP + total_TN) / (total_TP + total_TN + total_FP + total_FN)

#         return jsonify({
#             "accuracy": round(float(acc_value), 4),
#             "accuracy_formula": acc_formula,

#             "per_class_metrics": results
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
