from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

EDGE_DRIVER_PATH = "./msedgedriver.exe"

options = Options()
service = Service(EDGE_DRIVER_PATH)
driver = webdriver.Edge(service=service, options=options)
wait = WebDriverWait(driver, 10)

def jawab_pertanyaan():
    for i in range(5):
        print(f"🔹 Menjawab pertanyaan ke-{i + 1}")
        option = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Agak Mengandung')]")))
        option.click()
        time.sleep(0.5)

        confirm = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Lanjut')]")))
        confirm.click()
        time.sleep(1)

def konfirmasi_hasil():
    print("🔹 Klik tombol Cek Hasil")
    cek_hasil_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Cek Hasil')]")))
    cek_hasil_btn.click()
    time.sleep(1)

    print("🔹 Konfirmasi pop-up Cek Hasil")
    confirm_final = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Lanjut')]")))
    confirm_final.click()

    print("🔹 Klik tombol Coba Lagi")
    retry_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Coba Lagi')]")))
    driver.save_screenshot(f"hasil_selenium_{int(time.time())}.png")
    retry_btn.click()
    time.sleep(1)

try:
    print("🔹 Membuka halaman...")
    driver.get("http://localhost:3000")
    time.sleep(2)

    # Tes pertama: input game manual
    print("🔹 Mengisi nama game")
    input_field = wait.until(EC.presence_of_element_located((By.TAG_NAME, "input")))
    input_field.send_keys("Game Selenium Test 2025")
    time.sleep(1)

    print("🔹 Klik tombol Cek")
    check_button = driver.find_element(By.XPATH, "//button[text()='Cek']")
    check_button.click()
    time.sleep(1)

    jawab_pertanyaan()
    konfirmasi_hasil()

    # Klik Game Terbaru
    # print("🔁 Uji klik Game Terbaru satu per satu")
    # container = wait.until(EC.presence_of_element_located((By.XPATH, "//h2[contains(text(),'Game Terbaru')]/..")))
    # game_elements = container.find_elements(By.TAG_NAME, "button")
    # print(f"🔍 Ditemukan {len(game_elements)} game terbaru")

    # for idx, game in enumerate(game_elements[:4]):
    #     print(f"🔹 Klik game terbaru ke-{idx + 1}: {game.text}")
    #     driver.execute_script("arguments[0].scrollIntoView(true);", game)
    #     game.click()
    #     time.sleep(1)
        
    #     retry_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Coba Lagi')]")))
    #     driver.save_screenshot(f"klik_game_terbaru_{idx+1}.png")
    #     retry_btn.click()
    #     time.sleep(1)

    #     retry_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Coba Lagi')]")))
    #     driver.save_screenshot(f"klik_game_terbaru_{idx+1}.png")
    #     retry_btn.click()
    #     time.sleep(1)

    # Klik Selengkapnya
    print("🔹 Klik tombol Selengkapnya")
    selengkapnya = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Selengkapnya")))
    selengkapnya.click()
    time.sleep(2)

    # Filterisasi: ceklist & unceklist semua filter
    print("Uji fitur filter rating")
    filter_labels = ["Semua Umur", "Usia 3+", "Usia 7+", "Usia 13+", "Usia 18+"]

    for label in filter_labels:
        print(f"🔹 Klik filter: {label}")
        checkbox_label = wait.until(EC.element_to_be_clickable(
            (By.XPATH, f"//label[span[text()='{label}']]")
        ))
        checkbox_label.click()
        time.sleep(1)


        print(f"🔹 Nonaktifkan filter: {label}")
        checkbox_label.click()
        time.sleep(1)


    # Kembali ke Beranda
    print("🔹 Klik tombol Beranda di header")
    beranda = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Beranda']")))
    beranda.click()
    time.sleep(2)

    # Tes ulang input manual
    print("Tes ulang: Masukkan nama game yang sama")
    input_field = wait.until(EC.presence_of_element_located((By.TAG_NAME, "input")))
    input_field.send_keys("Game Selenium Test 2025")
    time.sleep(1)

    print("🔹 Klik tombol Cek")
    check_button = driver.find_element(By.XPATH, "//button[text()='Cek']")
    check_button.click()
    time.sleep(1)

    print("🔹 Klik tombol Coba Lagi")
    retry_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Coba Lagi')]")))
    retry_btn.click()
    time.sleep(1)

    print("✅ Selesai semua tahap!")

except Exception as e:
    print("❌ Terjadi kesalahan:", str(e))

finally:
    driver.quit()
