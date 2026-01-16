// core/api.js

// ==========================================
// !!! PERHATIAN !!!
// GANTI URL DI BAWAH INI DENGAN URL DEPLOYMENT BARU KAMU
// Contoh: https://script.google.com/macros/s/AKfycb.../exec
// ==========================================
const HONORER_API = "https://script.google.com/macros/s/AKfycbwpybWm8UqavSEP-8wVKUvcmw8r3iQxm1sFQI7M3SnlSR60q2OAN8fYMdAbYjMMPLgeCA/exec";


export async function getSession() {
  try {
    // Menggunakan parameter ?path=getSession agar server (Code.gs) bisa menerima
    const res = await fetch(`${HONORER_API}?path=getSession`);
    
    if (!res.ok) {
      // Jika gagal, coba baca error text dari server untuk debug
      const errorText = await res.text();
      console.error("GAS Error Response (getSession):", errorText); 
      throw new Error(`Gagal fetch session: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Simpan ID session di browser agar tidak hilang saat reload
    localStorage.setItem("honorer_session", data.id);
    
    return data.id;
  } catch (error) {
    console.error('Error getSession:', error);
    throw error;
  }
}

export async function kirimKeHonorer(input) {
  // Ambil session yang tersimpan di localStorage
  const session = localStorage.getItem("honorer_session");
  
  if (!session) {
    throw new Error("Session tidak ditemukan. Panggil getSession dulu.");
  }

  // Gabungkan session ID dengan data input form
  const payload = {
    session,
    ...input
  };

  try {
    const res = await fetch(HONORER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("GAS Error Response (kirimKeHonorer):", errorText);
      throw new Error(`Gagal kirim data: ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error kirimKeHonorer:', error);
    throw error;
  }
}
