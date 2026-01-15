const HONORER_API = "https://script.google.com/macros/s/AKXXXXXXX/exec"; // ganti dengan punyamu

let session = null;

async function getSession() {
  const res = await fetch(HONORER_API + "/getSession");
  const data = await res.json();
  session = data.session;
}

async function kirimKeHonorer(input) {
  if (!session) await getSession();

  const payload = { session, ...input };

  const res = await fetch(HONORER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const input = {};
  for (const [k, v] of data.entries()) input[k] = v;

  const hasil = await kirimKeHonorer(input);
  document.getElementById("output").textContent =
    JSON.stringify(hasil, null, 2);
});
