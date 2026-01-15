const HONORER_API = "https://script.google.com/macros/s/XXXXXXXX/exec"; // pakai punyamu

async function getSession() {
  const res = await fetch(`${HONORER_API}/getSession`);
  const data = await res.json();
  localStorage.setItem("honorer_session", data.session);
  return data.session;
}

async function kirimKeHonorer(input) {
  const session = localStorage.getItem("honorer_session");
  if (!session) throw new Error("Session belum ada");

  const payload = { session, ...input };

  const res = await fetch(HONORER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

// Inisialisasi
await getSession();

// Form handler
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const input = {};

  for (const [k, v] of data.entries()) {
    input[k] = v;
  }

  const hasil = await kirimKeHonorer(input);

  document.getElementById("output").textContent =
    JSON.stringify(hasil, null, 2);
});
