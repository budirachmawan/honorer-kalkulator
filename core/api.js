// core/api.js
const HONORER_API = "https://script.google.com/macros/s/XXXXXXXX/exec"; 
// ganti XXXXX dengan URL Apps Script kamu

export async function getSession() {
  const res = await fetch(`${HONORER_API}?getSession=1`);
  const data = await res.json();
  localStorage.setItem("honorer_session", data.session);
  return data.session;
}

export async function kirimKeHonorer(input) {
  const session = localStorage.getItem("honorer_session");

  if (!session) {
    throw new Error("Session belum ada. getSession() belum dipanggil.");
  }

  const payload = {
    session,
    ...input
  };

  const res = await fetch(HONORER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return await res.json();
}
