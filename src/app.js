import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const SUPABASE_URL = "https://twzswdkhheozavlrgjpp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vq8xxysljF488woGsEyYkQ_B5KGXAXY";
const ADMIN_EMAIL = "moon3d.oficial@gmail.com";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const authScreen = document.getElementById("authScreen");
const desktop = document.getElementById("desktopApp");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const authMessage = document.getElementById("authMessage");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

function showMessage(message) { authMessage.textContent = message; }
function showDesktop(session) {
  if (!session?.user?.email || session.user.email.toLowerCase() !== ADMIN_EMAIL) {
    supabase.auth.signOut();
    authScreen.classList.remove("hidden");
    desktop.classList.add("hidden");
    showMessage("Esta conta não tem autorização para acessar o NEXUS PC.");
    return;
  }
  authScreen.classList.add("hidden");
  desktop.classList.remove("hidden");
  showMessage("");
}
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginButton.disabled = true;
  loginButton.textContent = "Entrando...";
  showMessage("");
  const email = loginEmail.value.trim().toLowerCase();
  if (email !== ADMIN_EMAIL) {
    showMessage("E-mail não autorizado.");
    loginButton.disabled = false;
    loginButton.textContent = "Entrar";
    return;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: loginPassword.value });
  if (error) showMessage("Não foi possível entrar. Confira o e-mail e a senha.");
  else showDesktop(data.session);
  loginButton.disabled = false;
  loginButton.textContent = "Entrar";
});
document.getElementById("forgotPassword").addEventListener("click", async () => {
  const email = loginEmail.value.trim().toLowerCase();
  if (email !== ADMIN_EMAIL) { showMessage("Informe o e-mail administrador."); return; }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://moon3doficial-netizen.github.io/nexus-pc/"
  });
  showMessage(error ? "Não foi possível enviar o e-mail de recuperação." : "Se a conta existir, você receberá um e-mail para redefinir a senha.");
});
document.getElementById("logoutButton").addEventListener("click", async () => {
  await supabase.auth.signOut();
  desktop.classList.add("hidden");
  authScreen.classList.remove("hidden");
  loginPassword.value = "";
});
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) showDesktop(session);
});
const { data: { session } } = await supabase.auth.getSession();
if (session) showDesktop(session);

const layer=document.getElementById("windowLayer"),menu=document.getElementById("startMenu"),start=document.getElementById("startButton"),clock=document.getElementById("taskbarClock"),date=document.getElementById("dateTime");let z=11;
const views={
explorer:{title:"Explorador de arquivos",icon:"▰",html:`<h2>Meus arquivos</h2><p>Seus arquivos ficarão organizados aqui. A conexão com o armazenamento em nuvem será configurada em uma próxima etapa.</p><div class="file-row"><span class="file-symbol">📁</span><div><strong>Projetos</strong><small>Pasta • Nuvem pendente</small></div><span class="pill pending">Não sincronizado</span></div><div class="file-row"><span class="file-symbol">📁</span><div><strong>Modelos 3D</strong><small>Pasta • Nuvem pendente</small></div><span class="pill pending">Não sincronizado</span></div><div class="file-row"><span class="file-symbol">📁</span><div><strong>Downloads</strong><small>Pasta • Nuvem pendente</small></div><span class="pill">Vazio</span></div>`},
apps:{title:"Central de aplicativos",icon:"▦",html:`<h2>Aplicativos</h2><p>Catálogo inicial planejado. Programas nativos serão executados pelo PC Runner quando ele estiver disponível.</p><div class="app-row"><span class="file-symbol">🖨️</span><div><strong>Bambu Studio</strong><small>Fatiador 3D • Windows</small></div><span class="pill pending">Planejado</span></div><div class="app-row"><span class="file-symbol">🧩</span><div><strong>OrcaSlicer</strong><small>Fatiador 3D • Windows</small></div><span class="pill">Futuro</span></div><div class="app-row"><span class="file-symbol">📐</span><div><strong>Ferramentas CAD</strong><small>Categoria de aplicativos</small></div><span class="pill">Futuro</span></div>`},
settings:{title:"Configurações",icon:"⚙",html:`<h2>Configurações do ambiente</h2><p>Estado atual das conexões e componentes do NEXUS PC.</p><div class="settings-line">Interface <span>Ativa no navegador</span></div><div class="settings-line">Projeto Supabase <span>Autenticação conectada</span></div><div class="settings-line">PC Runner <span id="runnerStatus">Aguardando teste</span></div><button class="primary-btn" id="runnerCheck" type="button">Verificar PC Runner</button><pre id="runnerInfo" style="white-space:pre-wrap;font:inherit;font-size:13px;margin-top:12px;color:inherit"></pre><div class="settings-line">Inicialização automática <span>Não configurada</span></div><div class="settings-line">Sincronização <span>Não configurada</span></div>`}
};
function openWindow(key){const item=views[key];if(!item)return;menu.classList.add("hidden");let win=layer.querySelector('[data-window="'+key+'"]');if(win){win.classList.remove("hidden");win.style.zIndex=++z;return}
win=document.createElement("section");win.className="app-window";win.dataset.window=key;win.style.zIndex=++z;win.innerHTML=`<header class="window-titlebar"><span>${item.icon}</span><span class="window-title">${item.title}</span><div class="window-controls"><button data-action="minimize" aria-label="Minimizar">—</button><button data-action="maximize" aria-label="Maximizar">□</button><button class="close" data-action="close" aria-label="Fechar">×</button></div></header><div class="window-body">${item.html}</div>`;layer.appendChild(win);
if(key==="settings"){
  const check=win.querySelector("#runnerCheck"),status=win.querySelector("#runnerStatus"),info=win.querySelector("#runnerInfo");
  check.addEventListener("click",async()=>{
    check.disabled=true;check.textContent="Verificando...";
    status.textContent="Conectando...";
    info.textContent="";
    try{
      const health=await fetch("http://127.0.0.1:47831/health",{method:"GET",mode:"cors",cache:"no-store"});
      if(!health.ok)throw new Error("Runner respondeu com erro HTTP "+health.status);
      const h=await health.json();
      const sysResponse=await fetch("http://127.0.0.1:47831/system",{method:"GET",mode:"cors",cache:"no-store"});
      if(!sysResponse.ok)throw new Error("Não foi possível consultar o computador.");
      const s=await sysResponse.json();
      status.textContent="Conectado";
      info.textContent="Runner "+h.version+" • "+h.status+"\\nComputador: "+s.computerName+"\\nWindows: "+s.operatingSystem+" ("+s.architecture+")\\nProcessador: "+s.processor+"\\nNúcleos lógicos: "+s.logicalProcessors+"\\nRAM total: "+s.totalMemoryGb+" GB • Disponível: "+s.availableMemoryGb+" GB";
    }catch(err){
      status.textContent="Desconectado";
      info.textContent="Não foi possível conectar ao Runner. Confirme se ele está aberto e tente novamente. Detalhe: "+err.message;
    }finally{check.disabled=false;check.textContent="Verificar PC Runner"}
  });
}
win.addEventListener("pointerdown",()=>win.style.zIndex=++z);win.querySelector(".window-controls").addEventListener("click",e=>{const a=e.target.dataset.action;if(a==="close")win.remove();if(a==="minimize")win.classList.add("hidden");if(a==="maximize")win.classList.toggle("maximized")});drag(win)}
function drag(win){const bar=win.querySelector(".window-titlebar");let down=false,sx=0,sy=0,ox=0,oy=0;bar.addEventListener("pointerdown",e=>{if(e.target.closest(".window-controls")||win.classList.contains("maximized"))return;down=true;sx=e.clientX;sy=e.clientY;const r=win.getBoundingClientRect();ox=r.left;oy=r.top;bar.setPointerCapture(e.pointerId)});bar.addEventListener("pointermove",e=>{if(!down)return;const p=layer.getBoundingClientRect(),x=Math.max(0,Math.min(p.width-win.offsetWidth,ox+e.clientX-sx-p.left)),y=Math.max(0,Math.min(p.height-45,oy+e.clientY-sy-p.top));win.style.left=x+"px";win.style.top=y+"px";win.style.transform="none"});bar.addEventListener("pointerup",()=>down=false);bar.addEventListener("pointercancel",()=>down=false)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b)openWindow(b.dataset.open);if(!e.target.closest("#startMenu")&&!e.target.closest("#startButton")&&!e.target.closest("[data-open]"))menu.classList.add("hidden")});start.addEventListener("click",()=>menu.classList.toggle("hidden"));
function tick(){const n=new Date();clock.textContent=n.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});date.textContent=n.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"})}tick();setInterval(tick,30000);
