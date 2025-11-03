const RAW_URL = "https://raw.githubusercontent.com/Huyyhere/bypass-link/refs/heads/main/content.js";

(async function () {
  const style = document.createElement("style");
  style.textContent = `
    #hh-loader {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15,15,15,.95);
      color: #fff;
      padding: 26px 36px;
      border-radius: 16px;
      font-family: Inter, Segoe UI, Arial;
      z-index: 2147483647;
      box-shadow: 0 20px 60px rgba(0,0,0,.6);
      text-align: center;
      width: 340px;
      max-width: 90vw;
      transition: all .3s ease;
    }
    #hh-loader h1 { font-size: 18px; margin-bottom: 8px; font-weight: 700; }
    #hh-loader p { font-size: 13px; color: #bbb; margin-bottom: 10px; }
    #hh-loader span { font-size: 12px; color: #888; }
    #hh-loader.hide { opacity: 0; pointer-events: none; transform: translate(-50%, -50%) scale(0.95); }
  `;
  document.head.appendChild(style);

  const loader = document.createElement("div");
  loader.id = "hh-loader";
  loader.innerHTML = `
    <h1>Huyyhere Extension</h1>
    <p>Loading remote code from GitHub...</p>
    <span>${RAW_URL}</span>
  `;
  document.body.appendChild(loader);

  try {
    const res = await fetch(RAW_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("GitHub fetch failed");
    const code = await res.text();
    loader.querySelector("p").textContent = "✅ Loaded successfully! Running code...";
    await new Promise((r) => setTimeout(r, 600));
    loader.classList.add("hide");
    setTimeout(() => loader.remove(), 800);
    new Function(code)();
    console.log("[EXT] Remote code loaded from:", RAW_URL);
  } catch (err) {
    console.error("[EXT] Failed to load remote code:", err);
    loader.querySelector("p").textContent = "⚠️ Failed to load code from GitHub.";
    loader.querySelector("p").style.color = "#ff7";
    loader.querySelector("span").textContent = "Check your internet or repo status.";
  }
})();
