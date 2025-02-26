from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.neighbors import KNeighborsClassifier
import pandas as pd
import os

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
            print("❌ ERROR: Data tidak lengkap")
            return jsonify({"error": "Data tidak lengkap"}), 400

        print("✔ Nama Game:", game_name)
        print("✔ Jawaban:", answers)

        # Cek apakah jawaban valid
        features = []
        for answer in answers:
            if answer not in REVERSE_MAPPING:
                print(f"❌ ERROR: Jawaban tidak valid -> {answer}")
                return jsonify({"error": f"Jawaban tidak valid: {answer}"}), 400
            features.append(REVERSE_MAPPING[answer])

        print("✔ Features (dikonversi ke angka):", features)


        X, y, dataset = load_dataset()

        # Jika game sudah ada di dataset, kembalikan rating yang sudah ada
        if game_name in dataset["Nama Game"].values:
            existing_rating = dataset.loc[dataset["Nama Game"] == game_name, "Rating"].values[0]
            print("✔ Game ditemukan dalam dataset. Rating:", existing_rating)
            return jsonify({'rating': existing_rating})

        # Prediksi rating dengan KNN jika dataset cukup besar
        if len(X) > 3:
            knn = KNeighborsClassifier(n_neighbors=3)
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

        print("✔ Prediksi Rating:", predicted_rating)

        add_to_dataset(game_name, features, predicted_rating)
        return jsonify({'rating': predicted_rating})

    except Exception as e:
        print("❌ ERROR di backend:", str(e))
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
