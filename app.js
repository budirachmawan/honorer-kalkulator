import { getSession, kirimKeHonorer } from "/core/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Dapatkan session saat load (opsional, atau panggil saat submit)
  await getSession();  // Jika perlu init session awal

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
      const result = await kirimKeHonorer(input);
      // Tampilkan hasil jika ada response (asumsi CORS dihandle via proxy atau server)
      outputEl.textContent = `
✅ Data berhasil dikirim dan diproses.
Hasil:
${JSON.stringify(result, null, 2)}
`;
    } catch (err) {
      outputEl.textContent = "❌ Gagal mengirim data.";
      console.error(err);
    }
  });
});
