// PASTIKAN URL INI SAMA DENGAN WEB APP URL KAMU
const API_URL = 'https://script.google.com/macros/s/AKfycbyaOC8_JkJs2qcRbr5NorqdHc-KOrP8tsjP8-ZC5_bCIX01_xKGGr3f-lBmcCBE5BHprA/exec';

/**
 * Fungsi untuk mendapatkan Session ID dari API
 */
async function getSession() {
  try {
    const response = await fetch(`${API_URL}/getSession`);
    if (!response.ok) throw new Error("Gagal koneksi ke server (Session)");
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Gagal ambil session:", error);
    throw error;
  }
}

/**
 * Fungsi untuk mengirim data ke API Honorer
 */
async function kirimKeHonorer(payload) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || 'Gagal memproses data di server');
    }

    return data;
  } catch (error) {
    console.error("Gagal kirim data:", error);
    throw error;
  }
}

/**
 * Fungsi untuk merender hasil ke HTML (Sinkronisasi UI)
 */
function renderResult(data) {
  // Element Output
  const form = document.getElementById('form');
  const resultContainer = document.getElementById('result-container');
  const errorBox = document.getElementById('error-box');
  const submitBtn = document.getElementById('btn-submit');

  // Reset Error
  errorBox.style.display = 'none';

  // Isi Data
  document.getElementById('res-mode').textContent = data.Mode;
  document.getElementById('res-napas').textContent = Number(data.Napas).toLocaleString('id-ID') + " Hari";
  document.getElementById('res-survival').textContent = data.Survival + " Bulan";
  document.getElementById('res-emas').textContent = data['Boleh Emas'] === true ? "BOLEH" : "TIDAK";
  
  // Zona Awal (Opsional)
  if(data['Zona Awal']) {
    document.getElementById('res-zona-awal').textContent = data['Zona Awal'];
  }
  
  // Pesan AI
  document.getElementById('res-pesan').textContent = data.Pesan;

  // Tanggungan (Ambil dari input form karena API hanya return total calculation/other stuff)
  // Catatan: Jika API mengembalikan nilai Tanggungan yang sudah dihitung, gunakan data["Tanggungan..."]
  // Tapi untuk aman sinkronisasi, kita ambil dari form input
  const formData = new FormData(form);
  const tanggunganVal = formData.get("Tanggungan (orang yang bergantikan pada kamu)");
  document.getElementById('res-tanggungan').textContent = tanggunganVal + " Jiwa";

  // Warna Badge Zona
  const zoneBadge = document.getElementById('res-zone-badge');
  const zonaText = String(data.Zona).toUpperCase();
  zoneBadge.textContent = zonaText;

  // Reset class warna
  zoneBadge.className = 'status-badge'; 

  if (zonaText.includes('KRITIS')) zoneBadge.classList.add('zone-critical');
  else if (zonaText.includes('BAHAYA')) zoneBadge.classList.add('zone-danger');
  else if (zonaText.includes('RAWAN')) zoneBadge.classList.add('zone-vulnerable');
  else if (zonaText.includes('AMAN')) zoneBadge.classList.add('zone-safe');

  // Tampilkan Hasil, Sembunyikan Form
  form.style.display = 'none';
  resultContainer.style.display = 'block';
  
  // Scroll ke hasil
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Main Event Listener
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('form');
  const submitBtn = document.getElementById('btn-submit');

  if (!form) return; // Jika form tidak ada

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // UI Loading
    submitBtn.disabled = true;
    submitBtn.textContent = "SEDANG MEMPROSES...";
    
    // Reset tampilan jika ada error sebelumnya
    const errorBox = document.getElementById('error-box');
    if(errorBox) errorBox.style.display = 'none';

    try {
      // 1. Ambil Session
      const session = await getSession();

      // 2. Siapkan Data Form
      const formData = new FormData(e.target);
      const input = { session }; // Masukkan session ID

      // 3. Loop & Bersihkan Data (Sinkronisasi Struktur)
      for (const [key, value] of formData.entries()) {
        // Khusus Input Risiko: Jangan diubah ke Number, biarkan String
        if (key === "Risiko Aktif (Pilih salah satu)") {
          input[key] = value;
        } else {
          // Input lain (Uang, Angka): Ubah ke Number
          input[key] = Number(value);
        }
      }

      // 4. Kirim ke API
      const result = await kirimKeHonorer(input);

      // 5. Render Hasil
      renderResult(result);

    } catch (err) {
      // Tampilkan Error
      const errorBox = document.getElementById('error-box');
      if (errorBox) {
        errorBox.style.display = 'block';
        errorBox.textContent = `Terjadi kesalahan: ${err.message}`;
      }
      
      // Kembalikan tombol
      submitBtn.disabled = false;
      submitBtn.textContent = "ANALISA DATA";
      console.error(err);
    }
  });
});
