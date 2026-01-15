import { getSession, kirimKeHonorer } from "./core/api.js";

await getSession();

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const input = {};

  for (const [k, v] of data.entries()) {
    input[k] = v;
  }

  const hasil = await kirimKeHonorer(input);

  document.getElementById("output").textContent = JSON.stringify(hasil, null, 2);
});
