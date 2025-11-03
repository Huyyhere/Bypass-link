(function(){
  const EXT_VERSION = "1.2.0";
  const DISCORD_URL = "https://discord.gg/EtMvdPhmCP";
  const AVATAR_FALLBACK = "https://media.discordapp.net/attachments/1422578121122648174/1434758997369552896/Zupii.png?format=webp&quality=lossless&width=564&height=535";
  const ICON_URL = (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) ? chrome.runtime.getURL("icon48.png") : "";

  function ready(fn){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(() => {
    if (document.getElementById("__hh_gui_toggle")) return;

    const style = document.createElement("style");
    style.textContent = `
      #__hh_gui_toggle{position:fixed;top:18px;left:18px;z-index:2147483646;background:#101010;color:#fff;border:1px solid #222;padding:8px 12px;border-radius:8px;font-family:Inter,Segoe UI,Arial;cursor:pointer;transition:transform .12s}
      #__hh_gui_toggle:hover{transform:scale(1.03)}
      #__hh_gui_overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:2147483647}
      #__hh_gui_panel{width:420px;max-width:92vw;background:rgba(18,18,18,.98);color:#fff;padding:26px;border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.6);text-align:center;font-family:Inter,Segoe UI,Arial;transform:translateY(0);transition:all .16s}
      #__hh_avatar{width:88px;height:88px;border-radius:50%;object-fit:cover;border:2px solid #2b2b2b;margin:0 auto 12px;display:block;box-shadow:0 8px 30px rgba(0,0,0,.45)}
      .__hh_title{font-size:18px;font-weight:700;margin-bottom:6px}
      .__hh_desc{color:#bdbdbd;font-size:13px;margin-bottom:16px}
      .__hh_actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
      .__hh_btn{background:#242424;border:0;color:#fff;padding:10px 14px;border-radius:10px;cursor:pointer;font-weight:600}
      .__hh_btn:hover{background:#2f2f2f}
      #__hh_meta{font-size:12px;color:#8f8f8f;margin-top:12px}
      #__hh_toast{display:none;position:fixed;left:50%;transform:translateX(-50%);bottom:26px;background:rgba(18,18,18,.98);color:#fff;padding:10px 18px;border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.5);z-index:2147483648;font-family:Inter,Segoe UI,Arial;font-size:14px}
      @media (max-width:480px){ #__hh_gui_panel{padding:18px;width:92vw} #__hh_avatar{width:72px;height:72px} }
    `;
    document.head.appendChild(style);

    const toggle = document.createElement("button");
    toggle.id = "__hh_gui_toggle";
    toggle.textContent = "Open GUI";
    document.body.appendChild(toggle);

    const overlay = document.createElement("div");
    overlay.id = "__hh_gui_overlay";
    overlay.style.display = "none";
    overlay.innerHTML = `
      <div id="__hh_gui_panel" role="dialog" aria-modal="true" aria-label="Huyyhere Extension GUI">
        <img id="__hh_avatar" src="${ICON_URL || AVATAR_FALLBACK}" alt="avatar">
        <div class="__hh_title">Huyyhere Extension</div>
        <div class="__hh_desc">✅ Loaded extension successfully!</div>
        <div class="__hh_actions">
          <button class="__hh_btn" id="__hh_join">Join Discord</button>
        </div>
        <div id="__hh_meta">Version: ${EXT_VERSION}</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const toast = document.createElement("div");
    toast.id = "__hh_toast";
    document.body.appendChild(toast);

    const panel = overlay.querySelector("#__hh_gui_panel");
    const avatar = overlay.querySelector("#__hh_avatar");
    avatar.onerror = function(){ this.src = AVATAR_FALLBACK; };

    function showToast(msg, ms = 3000){
      toast.textContent = msg;
      toast.style.display = "block";
      clearTimeout(showToast._t);
      showToast._t = setTimeout(()=>{ toast.style.display = "none"; }, ms);
    }

    function openGui(){
      overlay.style.display = "flex";
      toggle.textContent = "Close GUI";
      panel.focus();
    }
    function closeGui(){
      overlay.style.display = "none";
      toggle.textContent = "Open GUI";
    }

    toggle.addEventListener("click", ()=> {
      if (overlay.style.display === "none" || overlay.style.display === "") openGui(); else closeGui();
    });

    overlay.addEventListener("click", (e)=>{ if(e.target === overlay) closeGui(); });
    document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeGui(); });

    overlay.querySelector("#__hh_join").addEventListener("click", ()=> {
      try { window.open(DISCORD_URL, "_blank"); showToast("Opening Discord..."); }
      catch { showToast("Cannot open Discord"); }
    });

    setTimeout(()=> showToast("✅ Extension loaded"), 900);
  });
})();
