// core/api.js
const HONORER_API = "https://script.google.com/macros/s/AKfycbxGo_RvtvFKZ-9Pwu9_k2x7lNUWcfA486U4G140rn6CiTKwEM51cuF3C9rJ70MVb6VMbA/exec";
// Ganti dengan URL Apps Script kamu yang sebenarnya

export async function getSession() {
  try {
    const res = await fetch(`${HONORER_API}/getSession`);
    if (!res.ok) {
      throw new Error(`Gagal fetch session: ${res.status}`);
    }
    const data = await res.json();
    localStorage.setItem("honorer_session", data.id);  // Fix: Gunakan data.id, sesuai output {id: uuid}
    return data.id;
  } catch (error) {
    console.error('Error getSession:', error);
    throw error;
  }
}

export async function kirimKeHonorer(input) {
  const session = localStorage.getItem("honorer_session");
  if (!session) {
    throw new Error("Session tidak ditemukan. Panggil getSession dulu.");
  }

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
      throw new Error(`Gagal kirim data: ${res.status}`);
    }

    const result = await res.json();  // Hapus mode: "no-cors" agar bisa baca response (asumsi CORS dihandle via proxy jika perlu)
    return result;  // Return hasil untuk ditampilkan di UI
  } catch (error) {
    console.error('Error kirimKeHonorer:', error);
    throw error;
  }
}
