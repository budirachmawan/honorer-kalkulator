// core/api.js
const HONORER_API = "https://script.google.com/macros/s/AKfycbxGo_RvtvFKZ-9Pwu9_k2x7lNUWcfA486U4G140rn6CiTKwEM51cuF3C9rJ70MVb6VMbA/exec"; 
// ganti XXXXX dengan URL Apps Script kamu

export async function getSession() {
  const res = await fetch(`${HONORER_API}?getSession=1`);
  const data = await res.json();
  localStorage.setItem("honorer_session", data.session);
  return data.session;
}

export async function kirimKeHonorer(input) {
  const session = localStorage.getItem("honorer_session");

  const payload = {
    session,
    ...input
  };

  await fetch(HONORER_API, {
    method: "POST",
    mode: "no-cors",   // ⬅️ INI KUNCINYA
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}
