// core/api.js
const HONORER_API = "https://script.google.com/macros/s/AKfycbyaOC8_JkJs2qcRbr5NorqdHc-KOrP8tsjP8-ZC5_bCIX01_xKGGr3f-lBmcCBE5BHprA/exec"; // Masukkan URL baru tadi

export async function getSession() {
  try {
    // GANTI INI: Pakai ?path=getSession
    const res = await fetch(`${HONORER_API}?path=getSession`);
    
    if (!res.ok) {
      // Coba lihat text errornya apa jika ada masalah
      const errorText = await res.text();
      console.error("GAS Error Response:", errorText); 
      throw new Error(`Gagal fetch session: ${res.status}`);
    }
    
    const data = await res.json();
    localStorage.setItem("honorer_session", data.id);
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
       const errorText = await res.text();
       console.error("GAS Error Response:", errorText);
       throw new Error(`Gagal kirim data: ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error kirimKeHonorer:', error);
    throw error;
  }
}
