import { getSession, kirimKeHonorer } from "/core/api.js";

await getSession();

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const input = {};

  for (const [k, v] of data.entries()) {
    input[k] = v;
  }

  const outputEl = document.getElementById("output");
  outputEl.textContent = "⏳ Data dikirim. Sistem sedang memproses...";

  try {
    await kirimKeHonorer(input);

    // karena no-cors → tidak ada response
    outputEl.textContent = `
✅ Data berhasil dikirim.
HONORER DIGITAL sedang menghitung di belakang layar.

Silakan tunggu sebentar.
`;
  } catch (err) {
    outputEl.textContent = "❌ Gagal mengirim data.";
    console.error(err);
  }
});
