const EXT_VERSION = "1.2.0";
const RAW_URL = "https://raw.githubusercontent.com/Huyyhere/bypass-link/refs/heads/main/content.js";
const REPO_URL = "https://github.com/Huyyhere/bypass-link/blob/main/content.js";
const DISCORD_URL = "https://discord.gg/EtMvdPhmCP";
const AVATAR_URL = "https://media.discordapp.net/attachments/1422578121122648174/1434758997369552896/Zupii.png?ex=69097ef1&is=69082d71&hm=f5d5367eda093e086e46b34619408497fb72700adca334a829fb3233974ca9cb&=&format=webp&quality=lossless&width=564&height=535";

(async function(){
  const style = document.createElement("style");
  style.textContent = `
    #hh-toggle{position:fixed;top:18px;left:18px;z-index:2147483646;background:#121212;color:#fff;border:1px solid #2b2b2b;padding:8px 12px;border-radius:8px;font-family:Inter,Segoe UI,Arial;cursor:pointer;transition:.2s}
    #hh-toggle:hover{background:#1e1e1e}
    #hh-gui{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.96);width:430px;max-width:92vw;background:rgba(15,15,15,.96);color:#fff;padding:26px;border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,.65);z-index:2147483647;font-family:Inter,Segoe UI,Arial;transition:all .18s ease}
    #hh-gui.show{display:block;transform:translate(-50%,-50%) scale(1)}
    #hh-avatar{width:90px;height:90px;border-radius:50%;object-fit:cover;border:2px solid #2a2a2a;margin:0 auto 12px;display:block;box-shadow:0 0 15px rgba(255,255,255,.15)}
    .hh-title{display:flex;align-items:center;justify-content:center;gap:10px;font-weight:700;font-size:19px;margin-bottom:6px;text-shadow:0 0 6px rgba(255,255,255,.2)}
    .hh-desc{color:#b0b0b0;font-size:13px;margin-bottom:16px;text-align:center}
    .hh-btn{background:#252525;border:0;color:#fff;padding:10px 15px;border-radius:10px;cursor:pointer;margin:8px 6px;font-weight:600;transition:.15s}
    .hh-btn:hover{background:#333}
    #hh-toast{display:none;position:fixed;left:50%;transform:translateX(-50%);bottom:25px;background:rgba(20,20,20,.98);color:#fff;padding:12px 20px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.5);z-index:2147483648;font-family:Inter,Segoe UI,Arial;font-size:14px}
    #hh-meta{font-size:12px;color:#8f8f8f;margin-top:12px;text-align:center}
  `;
  document.head.appendChild(style);

  const toggle = document.createElement("button");
  toggle.id = "hh-toggle";
  toggle.textContent = "Open GUI";
  document.body.appendChild(toggle);

  const gui = document.createElement("div");
  gui.id = "hh-gui";
  gui.innerHTML = `
    <img id="hh-avatar" src="${AVATAR_URL}" alt="avatar">
    <div class="hh-title">Huyyhere Extension</div>
    <div class="hh-desc">⚡ Load Extension Successfully!</div>
    <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap">
      <button class="hh-btn" id="hh-check">Check Update</button>
      <button class="hh-btn" id="hh-open">Open GitHub</button>
      <button class="hh-btn" id="hh-discord">Join Discord</button>
    </div>
    <div id="hh-meta">Version: ${EXT_VERSION}</div>
  `;
  document.body.appendChild(gui);

  const toast = document.createElement("div");
  toast.id = "hh-toast";
  document.body.appendChild(toast);

  toggle.addEventListener("click", ()=>{
    const open = gui.classList.toggle("show");
    toggle.textContent = open ? "Close GUI" : "Open GUI";
  });

  gui.querySelector("#hh-discord").addEventListener("click", ()=>window.open(DISCORD_URL,"_blank"));
  gui.querySelector("#hh-open").addEventListener("click", ()=>window.open(REPO_URL,"_blank"));

  function showToast(msg, ms=3500){
    toast.textContent = msg;
    toast.style.display = "block";
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>{ toast.style.display = "none"; }, ms);
  }

  async function checkUpdate(){
    try{
      const r = await fetch(RAW_URL, {cache:"no-store"});
      if(!r.ok){ showToast("⚠️ Update check failed"); return; }
      const t = await r.text();
      const match = /EXT_VERSION\\s*=\\s*["']([\\d.]+)["']/i.exec(t);
      if(match && match[1] && match[1] !== EXT_VERSION){
        showToast("🚀 New version available: "+match[1]);
      } else showToast("✅ You're up to date!");
    }catch{ showToast("⚠️ Failed to check update"); }
  }

  gui.querySelector("#hh-check").addEventListener("click", ()=>checkUpdate());
  setTimeout(()=>showToast("✅ Extension Loaded!"), 800);
})();
