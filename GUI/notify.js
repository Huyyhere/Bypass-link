// notify.js — standalone, no deps
(function(global){
  'use strict';

  if(global.notify) return; // không khởi tạo lại nếu đã có

  const DEFAULT = {
    position: 'left', // left | right
    top: 18,
    gap: 10,
    maxWidth: 360,
    duration: 10000,
    image: '' // mặc định none, set via init or setImage
  };

  let cfg = Object.assign({}, DEFAULT);

  function ensureDOM(){
    if(document.getElementById('notify-style')) return;
    const s = document.createElement('style');
    s.id = 'notify-style';
    s.textContent = `
      :root { --notif-top: ${cfg.top}px; --notif-gap: ${cfg.gap}px; --notif-maxw: ${cfg.maxWidth}px; }
      .notify-container { position:fixed; top:var(--notif-top); ${cfg.position}:18px; display:flex; flex-direction:column; gap:var(--notif-gap); z-index:2147483647; pointer-events:none; max-width:var(--notif-maxw); }
      .notify-toast { pointer-events:auto; display:flex; align-items:center; gap:12px; background: rgba(12,14,18,0.92); color:#e6fffa; padding:10px 14px 10px 56px; border-radius:10px; box-shadow:0 10px 30px rgba(2,6,23,0.5); border:1px solid rgba(255,255,255,0.03); transform-origin:left top; opacity:0; transform:translateX(-16px) scale(.995); transition:opacity 260ms ease, transform 260ms cubic-bezier(.2,.9,.2,1); font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; font-weight:600; font-size:13px; position:relative; overflow:hidden; }
      .notify-toast.show { opacity:1; transform:translateX(0) scale(1); }
      .notify-toast.hide { opacity:0; transform:translateX(-16px) scale(.995); }
      .notify-toast .notify-img { position:absolute; left:12px; top:50%; transform:translateY(-50%); width:36px; height:36px; background-size:36px 36px; background-repeat:no-repeat; background-position:center; border-radius:8px; box-shadow:0 6px 14px rgba(0,0,0,0.35); }
      .notify-toast .notify-text { flex:1; word-break:break-word; color:#e6fffa; }
      .notify-toast .notify-close { margin-left:8px; cursor:pointer; padding:6px; border-radius:6px; opacity:.85; }
      .notify-toast .notify-close:hover { transform:scale(1.04); opacity:1; }
      .notify-loading-spinner { width:16px; height:16px; border-radius:50%; box-sizing:border-box; border:2px solid rgba(255,255,255,0.12); border-top-color: rgba(255,255,255,0.85); animation:notify-spin 900ms linear infinite; margin-right:6px; }
      @keyframes notify-spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(s);

    const cont = document.createElement('div');
    cont.className = 'notify-container';
    cont.id = 'notify-container';
    document.body.appendChild(cont);
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }

  function createToast(message, {type='info', duration=cfg.duration, image=} = {}){
    ensureDOM();
    const container = document.getElementById('notify-container');
    const el = document.createElement('div');
    el.className = 'notify-toast';
    const imgDiv = document.createElement('div');
    imgDiv.className = 'notify-img';
    const useImage = image || cfg.image || '';
    if(useImage) imgDiv.style.backgroundImage = `url("${useImage}")`;
    else imgDiv.style.display = 'none';

    const text = document.createElement('div');
    text.className = 'notify-text';
    text.innerHTML = escapeHtml(message || '');

    const close = document.createElement('div');
    close.className = 'notify-close';
    close.innerHTML = '✕';
    close.title = 'Close';
    close.addEventListener('click', () => removeToast(el));

    // optional loading spinner for 'loading' type
    if(type === 'loading'){
      const spin = document.createElement('div');
      spin.className = 'notify-loading-spinner';
      el.appendChild(spin);
    }

    el.appendChild(imgDiv);
    el.appendChild(text);
    el.appendChild(close);

    if(cfg.position === 'left') container.prepend(el);
    else container.appendChild(el);

    // animate in
    requestAnimationFrame(()=> el.classList.add('show'));

    // auto hide
    const hideTimer = setTimeout(()=> removeToast(el), duration);

    function removeToast(node){
      if(!node) return;
      clearTimeout(hideTimer);
      node.classList.remove('show');
      node.classList.add('hide');
      setTimeout(()=> { try{ node.remove(); } catch(e){} }, 260);
    }

    return {
      el,
      remove: () => removeToast(el),
      updateText: (t) => { text.innerHTML = escapeHtml(t); }
    };
  }

  const api = {
    init(options = {}){
      cfg = Object.assign({}, cfg, options);
      // merge defaults but keep provided
      cfg = Object.assign({}, DEFAULT, cfg);
      ensureDOM();
      return cfg;
    },
    setImage(url){
      cfg.image = url;
      return cfg.image;
    },
    success(msg, opts = {}){ return createToast(msg, Object.assign({}, opts, {type:'success'})); },
    error(msg, opts = {}){ return createToast(msg, Object.assign({}, opts, {type:'error'})); },
    loading(msg, opts = {}){ return createToast(msg, Object.assign({}, opts, {type:'loading'})); },
    info(msg, opts = {}){ return createToast(msg, Object.assign({}, opts, {type:'info'})); }
  };

  global.notify = api;

})(window);
