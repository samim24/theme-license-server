(async ()=>{
  try{
    const cfg = window.__BF__;
    const res = await fetch(cfg.api+"?theme="+cfg.theme+"&domain="+cfg.domain+"&token="+cfg.token+"&_="+Date.now());
    const data = await res.json();

    if(!data.valid){
      document.documentElement.innerHTML =
        '<body style="margin:0"><div style="position:fixed;inset:0;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px">Theme License Not Activated</div></body>';
      return;
    }

    if(data.type === "free"){
      const f = document.createElement("iframe");
      f.src = cfg.footer+'?_='+Date.now();
      f.style="border:0;width:100%;height:40px;position:fixed;bottom:0;left:0;z-index:999999";
      document.body.appendChild(f);
    }

    window.BF_THEME_ACTIVE = true;
  }catch(e){
    document.body.innerHTML="Theme License Error";
  }
})();