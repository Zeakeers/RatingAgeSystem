document.getElementById("game-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const features = [
      parseInt(formData.get("kekerasan")),
      parseInt(formData.get("bahasa_kasar")),
      parseInt(formData.get("tema_seksual")),
      parseInt(formData.get("darah_gore")),
      parseInt(formData.get("elemen_perjudian")),
    ];
  
    try {
      // Kirim data ke backend
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, features }),
      });
  
      const result = await response.json();
  
      if (result.status === "exists") {
        document.getElementById("result").textContent = 
          `Game "${name}" sudah ada. Rating: ${result.predicted_rating}`;
      } else {
        document.getElementById("result").textContent = 
          `Game "${name}" berhasil diprediksi. Rating: ${result.predicted_rating}`;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memproses data.");
    }
  });
  