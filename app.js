
/* ===== Configuração: preencha para ligar ao Supabase. Vazio = modo demonstração. ===== */
const CFG={url:'https://bujdolthjtrosaevunvb.supabase.co',key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1amRvbHRoanRyb3NhZXZ1bnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMzE4NDYsImV4cCI6MjEwODkwNzg0Nn0.38eA0v5SqsclLr813bHFU83CxNwNTcWjs0kaiQOzIIU'};
const SITE={email:'',whatsapp:'',facebook:''}; // preencha os seus contactos reais
const sb=(CFG.url&&window.supabase)?window.supabase.createClient(CFG.url,CFG.key):null;

const PROV=['Maputo Cidade','Maputo Província','Gaza','Inhambane','Sofala','Manica','Tete','Zambézia','Nampula','Cabo Delgado','Niassa'];
const CATS=['Banca e Finanças','Educação','Saúde','ONG e Desenvolvimento','Administração Pública','Tecnologia','Serviços'];
const LEVELS=['Sem experiência','Júnior','Pleno','Sénior'];
const dIn=n=>new Date(Date.now()+n*864e5).toISOString().slice(0,10);

let jobs=[
 {id:1,title:'Assistente de Cliente para Balcões',org:'Millennium bim',prov:'Maputo Cidade',cat:'Banca e Finanças',level:'Júnior',deadline:dIn(9),source:'Site oficial da empresa',score:92,status:'published',flags:[],created:dIn(-3),descr:'Atendimento e aconselhamento a clientes nos balcões, abertura de contas e apoio na utilização dos canais digitais. Valoriza-se boa comunicação e domínio de Excel.'},
 {id:2,title:'Formador de Cursos Técnicos 2027',org:'Elton Professional Training Centre',prov:'Maputo Província',cat:'Educação',level:'Pleno',deadline:dIn(14),source:'Comunicado oficial',score:84,status:'published',flags:[],created:dIn(-3)},
 {id:3,title:'Técnico de Ingresso — Concurso Público',org:'Autoridade Tributária de Moçambique',prov:'Maputo Cidade',cat:'Administração Pública',level:'Sem experiência',deadline:dIn(21),source:'Boletim da República / site AT',score:96,status:'published',flags:[],created:dIn(-3)},
 {id:4,title:'Estágio Profissional em Saúde Comunitária',org:'ONG Parceiros pela Saúde',prov:'Nampula',cat:'Saúde',level:'Sem experiência',deadline:dIn(6),source:'Portal de recrutamento',score:81,status:'published',flags:[],created:dIn(-1)},
 {id:5,title:'Oficial de Monitoria e Avaliação',org:'ONG Desenvolvimento Rural',prov:'Zambézia',cat:'ONG e Desenvolvimento',level:'Sénior',deadline:dIn(-2),source:'Site oficial da ONG',score:88,status:'published',flags:[],created:dIn(-12)},
 {id:6,title:'Vendedor — contacte por WhatsApp',org:'(não indicada)',prov:'Sofala',cat:'Serviços',level:'Sem experiência',deadline:dIn(30),source:'Grupo de WhatsApp',score:38,status:'blocked',flags:['Sem empresa identificada','Contacto pessoal','Origem não verificável'],created:dIn(0)},
 {id:7,title:'Ganhe 50.000 MT por mês em casa',org:'Oportunidade Global',prov:'Maputo Cidade',cat:'Serviços',level:'Sem experiência',deadline:dIn(40),source:'Redes sociais',score:12,status:'blocked',flags:['Pede pagamento de inscrição','Promessa de ganhos irreais'],created:dIn(0)},
 {id:8,title:'Analista de Sistemas',org:'Empresa de TI (a confirmar)',prov:'Maputo Cidade',cat:'Tecnologia',level:'Pleno',deadline:dIn(11),source:'Portal de recrutamento',score:67,status:'review',flags:['Prazo não confirmado no site da empresa'],created:dIn(0)}
];
let sources=[
 {name:'Site oficial — Autoridade Tributária',type:'Instituição pública',trust:'Lista branca',last:'há 2 h'},
 {name:'Millennium bim — Carreiras',type:'Empresa',trust:'Lista branca',last:'há 3 h'},
 {name:'Portais de ONGs (RSS)',type:'ONG',trust:'Lista branca',last:'há 1 h'},
 {name:'Portal de recrutamento genérico',type:'Portal',trust:'Revisão manual',last:'há 4 h'}
];
let cfgAuto={auto:true,min:80,social:true,blogger:true,expire:true};
if(sb){jobs=[];sources=[]}
const safeUrl=u=>/^https:\/\//i.test(u||'')?u:'';
const clean=j=>{['url','apply_url','image'].forEach(k=>j[k]=safeUrl(j[k])||null);j.flags=j.flags||[];return j};

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function lev(a,b){if(Math.abs(a.length-b.length)>1)return 2;const d=[];for(let i=0;i<=a.length;i++)d[i]=[i];for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function fuzzy(q,t){const T=norm(t),W=T.split(/[^a-z0-9]+/);return norm(q).split(/\s+/).filter(Boolean).every(k=>T.includes(k)||(k.length>=5&&W.some(w=>lev(k,w)<=1)))}
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const expired=j=>j.deadline<dIn(0);
const fmt=d=>new Date(d+'T12:00').toLocaleDateString('pt-PT',{day:'2-digit',month:'short',year:'numeric'});
const daysLeft=j=>Math.ceil((new Date(j.deadline+'T12:00')-Date.now())/864e5);


const THEME={'Banca e Finanças':['#0E3B43','#1B7C7F','🏦'],'Educação':['#4B2E83','#8059C4','📚'],'Saúde':['#0B6E45','#25A56E','🩺'],'ONG e Desenvolvimento':['#9A4B12','#E08A2E','🤝'],'Administração Pública':['#1B4380','#3F7AD0','🏛️'],'Tecnologia':['#232A66','#4A55C9','💻'],'Serviços':['#6E2F25','#C45B49','🛠️']};
function cover(j){
  const t=THEME[j.cat]||THEME['Serviços'];
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t[0]}"/><stop offset="1" stop-color="${t[1]}"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><circle cx="700" cy="60" r="190" fill="#fff" opacity=".07"/><circle cx="90" cy="420" r="150" fill="#F2A900" opacity=".18"/><text x="60" y="230" font-size="130">${t[2]}</text><text x="60" y="330" font-family="sans-serif" font-weight="700" font-size="34" fill="#fff">${esc(j.org.slice(0,34))}</text><text x="60" y="375" font-family="sans-serif" font-size="26" fill="#fff" opacity=".85">${esc(j.prov)}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function img(j){return `<img class="cv" loading="lazy" alt="${esc(j.title)} — ${esc(j.org)}" src="${esc(j.image||cover(j))}" ${j.image?`onerror="this.onerror=null;this.src=cover(jobs.find(x=>x.id==${j.id}))"`:''}>`}

async function load(){
  if(!sb)return;
  const [a,b]=await Promise.all([sb.from('bbs_jobs').select('*').order('created',{ascending:false}),sb.from('bbs_sources').select('*')]);
  if(!a.error&&a.data)jobs=a.data;
  if(!b.error&&b.data)sources=b.data.map(x=>({name:x.name,type:x.type,trust:x.trust,url:x.url,last:x.last_run?new Date(x.last_run).toLocaleString('pt-PT'):'ainda não lida'}));
  jobs.forEach(clean);
}

/* ===== Portal público ===== */
const SECTORS=['Privado','Público','ONG e Organizações'];
const F={q:'',prov:'',cat:'',level:'',young:false,sector:'',sort:'soon',page:1,sig:''};
function pub(){
  const list=jobs.filter(j=>j.status==='published'&&!expired(j));
  $('#app').innerHTML=`
  <section class="hero rounded-2xl p-5 sm:p-8 mb-6">
    <h1 class="text-3xl sm:text-5xl font-extrabold leading-tight max-w-2xl">Vagas verificadas em Moçambique, todos os dias.</h1>
    <p class="mt-3 text-teal-50 max-w-xl">Só publicamos oportunidades com origem confirmada. ${list.length} vagas abertas agora.</p>
    <div class="mt-5 grid gap-2 sm:grid-cols-4">
      <input id="q" placeholder="Profissão ou empresa" aria-label="Pesquisar" class="sm:col-span-2">
      <select id="prov" aria-label="Província"><option value="">Todas as províncias</option>${PROV.map(p=>`<option>${p}</option>`).join('')}</select>
      <select id="cat" aria-label="Categoria"><option value="">Todas as categorias</option>${CATS.map(p=>`<option>${p}</option>`).join('')}</select>
    </div>
    <div class="mt-3 flex flex-wrap gap-2" id="chips">
      ${SECTORS.map(x=>`<button class="chip" data-s="${x}" aria-pressed="false">${x}</button>`).join('')}
      <button class="chip" id="young" aria-pressed="false">Sem experiência</button>
      ${LEVELS.slice(1).map(l=>`<button class="chip" data-l="${l}" aria-pressed="false">${l}</button>`).join('')}
      <select id="sort" aria-label="Ordenar" style="width:auto;margin-left:auto"><option value="soon">Termina em breve</option><option value="new">Mais recentes</option><option value="young">Sem experiência primeiro</option></select>
    </div>
  </section>
  <section id="list" class="grid gap-4 sm:grid-cols-2" aria-live="polite"></section>
  <section class="mt-10 bg-white border rounded-xl p-5" style="border-color:var(--line)">
    <h2 class="text-xl font-extrabold">Receba vagas no WhatsApp</h2>
    <p class="text-sm text-slate-700 mt-1">Escolha a província e a área. Enviamos só as vagas que correspondem.</p>
    <form id="al" class="mt-3 grid gap-2 sm:grid-cols-3">
      <input name="wa" type="tel" inputmode="tel" placeholder="Número: 84 123 4567" required aria-label="Número de WhatsApp">
      <select name="prov" aria-label="Província"><option value="">Todas as províncias</option>${PROV.map(p=>`<option>${p}</option>`).join('')}</select>
      <select name="cat" aria-label="Categoria"><option value="">Todas as categorias</option>${CATS.map(p=>`<option>${p}</option>`).join('')}</select>
      <label class="text-sm sm:col-span-3 flex gap-2 items-start"><input name="consent" type="checkbox" required style="width:auto;margin-top:.2rem">Aceito receber alertas de vagas por WhatsApp. Posso pedir a remoção a qualquer momento (veja a <a class="underline" href="./?p=privacidade">privacidade</a>).</label>
      <button class="btn sm:col-span-3">Quero receber alertas</button><p id="alm" class="text-sm sm:col-span-3" aria-live="polite"></p>
    </form>
  </section>`;
  $('#al').onsubmit=subscribe;
  $('#sort').onchange=e=>{F.sort=e.target.value;draw()};
  $('#q').oninput=e=>{F.q=e.target.value;draw()};
  $('#prov').onchange=e=>{F.prov=e.target.value;draw()};
  $('#cat').onchange=e=>{F.cat=e.target.value;draw()};
  $('#young').onclick=e=>{F.young=!F.young;e.target.setAttribute('aria-pressed',F.young);draw()};
  document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{F.level=F.level===b.dataset.l?'':b.dataset.l;
    document.querySelectorAll('[data-l]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.l===F.level));draw()});
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{F.sector=F.sector===b.dataset.s?'':b.dataset.s;
    document.querySelectorAll('[data-s]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.s===F.sector));draw()});
  draw();
}
function draw(){
  const sig=JSON.stringify([F.q,F.prov,F.cat,F.level,F.sector,F.young,F.sort]);if(sig!==F.sig){F.page=1;F.sig=sig}
  const r=jobs.filter(j=>j.status==='published'&&!expired(j)&&(!F.q||fuzzy(F.q,j.title+' '+j.org+' '+j.cat))&&(!F.prov||j.prov===F.prov)&&(!F.cat||j.cat===F.cat)&&(!F.level||j.level===F.level)&&(!F.sector||j.sector===F.sector)&&(!F.young||j.level==='Sem experiência'));
  const S={soon:(a,b)=>a.deadline.localeCompare(b.deadline),new:(a,b)=>String(b.created).localeCompare(String(a.created))||b.id-a.id,young:(a,b)=>(b.level==='Sem experiência')-(a.level==='Sem experiência')||a.deadline.localeCompare(b.deadline)};
  r.sort(S[F.sort]);const shown=r.slice(0,F.page*10);
  $('#list').innerHTML=r.length?shown.map(card).join('')+(r.length>shown.length?`<button id="more" class="btn2 sm:col-span-2">Carregar mais (${r.length-shown.length})</button>`:''):`<p class="p-6 bg-white rounded-xl border sm:col-span-2" style="border-color:var(--line)">Nenhuma vaga com estes filtros. Remova um filtro ou volte mais tarde: a lista actualiza-se sozinha.</p>`;
  const m=$('#more');if(m)m.onclick=()=>{F.page++;draw()};
}
async function subscribe(e){e.preventDefault();const f=e.target;let p=f.wa.value.replace(/[\s\-()]/g,'');
  if(/^8\d{8}$/.test(p))p='+258'+p;else if(/^258\d{9}$/.test(p))p='+'+p;
  if(!/^\+\d{10,15}$/.test(p)){$('#alm').textContent='Número inválido. Exemplo: 84 123 4567.';return}
  if(sb){const {error}=await sb.from('bbs_subscribers').insert({whatsapp:p,prov:f.prov.value||null,cat:f.cat.value||null,consent:true});
    if(error){$('#alm').textContent=error.code==='23505'?'Este número já está registado.':'Não foi possível guardar. Tente mais tarde.';return}}
  f.reset();$('#alm').textContent='Registo feito. Vai receber as novas vagas que correspondem à sua escolha.'}
async function report(j){const R=['Pede pagamento ou taxa','Vaga falsa ou golpe','Prazo já terminou','Contacto ou link errado','Outro motivo'];
  const n=prompt('Motivo da denúncia:\n'+R.map((x,i)=>(i+1)+' — '+x).join('\n')+'\nEscreva o número (1 a 5):');if(!n)return;
  const reason=R[+n-1];if(!reason)return alert('Número inválido.');
  const note=(prompt('Quer acrescentar detalhes? (opcional)')||'').slice(0,500);
  if(sb){const {error}=await sb.from('bbs_reports').insert({job_id:j.id,reason,note});if(error)return alert('Não foi possível enviar. Tente mais tarde.')}
  alert('Obrigado. A nossa equipa vai rever esta vaga.')}
const PAGES={
 sobre:['Sobre o BBS Trends','O BBS Trends reúne vagas de emprego, concursos públicos e estágios em Moçambique. Só publicamos vagas com origem verificável (site oficial ou entidade conhecida), prazo válido e contacto de candidatura. Vagas que pedem pagamento ficam bloqueadas. Não somos intermediários: a candidatura é sempre feita directamente à entidade que recruta.'],
 privacidade:['Privacidade','Só recolhemos o número de WhatsApp, a província e a categoria que indicar para receber alertas, e apenas com o seu consentimento. Não vendemos estes dados. Usamos um serviço de mensagens apenas para enviar os alertas. Pode pedir a remoção a qualquer momento pelo contacto desta página. As denúncias de vagas são guardadas sem identificar quem as envia.'],
 denunciar:['Como denunciar uma vaga falsa','Em cada vaga existe o botão "Denunciar esta vaga". Sinais de golpe: pedem pagamento, depósito ou taxa de inscrição; prometem ganhos fáceis; contactam só por um WhatsApp pessoal, sem empresa identificada; pedem senhas, códigos ou dados bancários. Em caso de dúvida, confirme a vaga no site oficial da entidade antes de enviar documentos.'],
 contacto:['Contacto','']};
function page(n){const p=PAGES[n];if(!p)return pub();document.title=p[0]+' | BBS Trends';
  const c=n==='contacto'?((SITE.email?`<p class="mt-3"><b>Email:</b> <a class="underline" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></p>`:'')+(SITE.whatsapp?`<p class="mt-2"><b>WhatsApp:</b> <a class="underline" href="https://wa.me/${esc(SITE.whatsapp.replace(/\D/g,''))}" target="_blank" rel="noopener">${esc(SITE.whatsapp)}</a></p>`:'')||'<p class="mt-3">Contactos em configuração.</p>'):'';
  $('#app').innerHTML=`<a href="./" class="text-sm underline">← Todas as vagas</a><article class="mt-3 bg-white border rounded-2xl p-5 sm:p-8" style="border-color:var(--line)"><h1 class="text-2xl sm:text-3xl font-extrabold">${p[0]}</h1><p class="mt-3 max-w-2xl leading-relaxed">${p[1]}</p>${c}</article>`;scrollTo(0,0)}
function card(j){
  const d=daysLeft(j);
  const wa='https://wa.me/?text='+encodeURIComponent(`${j.title} — ${j.org} (${j.prov}). Prazo: ${fmt(j.deadline)}. ${location.origin+location.pathname}?vaga=${j.id}`);
  return `<article class="card bg-white border rounded-xl overflow-hidden" style="border-color:var(--line)"><a href="?vaga=${j.id}" aria-label="${esc(j.title)}">${img(j)}</a>
    <div class="p-4"><div class="flex flex-wrap gap-2 mb-2">
      <span class="badge b-ok">Fonte verificada</span>${j.sector?`<span class="badge" style="background:#E6ECEB">${esc(j.sector)}</span>`:''}
      ${j.level==='Sem experiência'?'<span class="badge b-new">Para jovens</span>':''}
      ${d<=7?`<span class="badge b-rev">Termina em ${d} dia${d===1?'':'s'}</span>`:''}
    </div>
    <h2 class="text-lg font-extrabold"><a href="?vaga=${j.id}">${esc(j.title)}</a></h2>
    <p class="text-sm text-slate-700">${esc(j.org)} · ${esc(j.prov)}</p>
    <p class="text-sm mt-1">${esc(j.cat)} · ${esc(j.level)} · Prazo ${fmt(j.deadline)}</p>
    <p class="text-xs text-slate-500 mt-1">Fonte: ${esc(j.source)}</p>
    <div class="mt-3 flex gap-2"><a class="btn" href="?vaga=${j.id}">Ver detalhes</a>
    <a class="btn2" href="${wa}" target="_blank" rel="noopener">Partilhar</a></div></div></article>`;
}


function seo(j,url){
  const desc=(j.descr||`${j.title} — ${j.org}, ${j.prov}. Prazo: ${fmt(j.deadline)}.`).slice(0,155);
  const set=(sel,mk)=>{let e=document.querySelector(sel);if(!e){e=mk();document.head.append(e)}return e};
  set('meta[name=description]',()=>Object.assign(document.createElement('meta'),{name:'description'})).content=desc;
  set('link[rel=canonical]',()=>Object.assign(document.createElement('link'),{rel:'canonical'})).href=url;
  const T={'Tempo inteiro':'FULL_TIME','Tempo parcial':'PART_TIME','Estágio':'INTERN','Contrato':'CONTRACTOR'};
  set('#ld',()=>Object.assign(document.createElement('script'),{id:'ld',type:'application/ld+json'})).textContent=JSON.stringify({
    '@context':'https://schema.org','@type':'JobPosting',title:j.title,description:j.descr||desc,datePosted:j.created||dIn(0),validThrough:j.deadline,
    employmentType:T[j.contract]||'FULL_TIME',hiringOrganization:{'@type':'Organization',name:j.org},
    jobLocation:{'@type':'Place',address:{'@type':'PostalAddress',addressRegion:j.prov,addressCountry:'MZ'}},directApply:!!j.apply_url,url});
}
const lst=(t,v)=>v?`<h3 class="font-extrabold mt-4">${t}</h3><ul class="list-disc pl-5 mt-1 max-w-2xl">${String(v).split(/\n|;/).filter(x=>x.trim()).map(x=>`<li>${esc(x.trim())}</li>`).join('')}</ul>`:'';
function detail(id){
  const j=jobs.find(x=>x.id==id);
  if(!j||j.status!=='published'||expired(j)){
    $('#app').innerHTML=`<a href="./" class="text-sm underline">← Todas as vagas</a><p class="mt-4 p-6 bg-white rounded-xl border" style="border-color:var(--line)">Esta vaga já não está disponível: o prazo terminou ou foi removida. Veja as vagas abertas na página inicial.</p>`;return}
  document.title=j.title+' — '+j.org+' | BBS Trends';
  const d=daysLeft(j),url=location.origin+location.pathname+'?vaga='+j.id;
  const txt=encodeURIComponent(`${j.title} — ${j.org} (${j.prov}). Prazo: ${fmt(j.deadline)}. ${url}`);
  const sim=jobs.filter(x=>x.id!==j.id&&x.status==='published'&&!expired(x)&&(x.cat===j.cat||x.prov===j.prov)).slice(0,2);
  $('#app').innerHTML=`<a href="./" class="text-sm underline">← Todas as vagas</a>
  <article class="mt-3 bg-white border rounded-2xl overflow-hidden" style="border-color:var(--line)">
   ${img(j)}
   <div class="p-5 sm:p-8">
    <div class="flex flex-wrap gap-2 mb-3"><span class="badge b-ok">Fonte verificada</span>${j.level==='Sem experiência'?'<span class="badge b-new">Para jovens</span>':''}${d<=7?`<span class="badge b-rev">Termina em ${d} dia${d===1?'':'s'}</span>`:''}</div>
    <h1 class="text-2xl sm:text-4xl font-extrabold leading-tight">${esc(j.title)}</h1>
    <p class="mt-1 text-slate-700">${esc(j.org)} · ${esc(j.prov)}</p><p class="text-sm text-slate-600 mt-1">Verificada a ${fmt(j.verified_at||j.created||dIn(0))}</p>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-sm">
      <div class="info"><b>Categoria</b><br>${esc(j.cat)}</div><div class="info"><b>Nível</b><br>${esc(j.level)}</div>
      <div class="info"><b>Prazo</b><br>${fmt(j.deadline)}</div><div class="info"><b>Fonte</b><br>${esc(j.source)}</div></div>
    <h2 class="text-xl font-extrabold mt-6">Sobre a vaga</h2>
    <p class="mt-2 max-w-2xl leading-relaxed">${esc(j.descr||`A ${j.org} procura profissional para a função de ${j.title}, na província de ${j.prov}. Consulte o anúncio oficial para ver requisitos, documentos e forma de candidatura.`)}</p>
    ${lst('Responsabilidades',j.responsibilities)}${lst('Requisitos',j.requirements)}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-sm">${[['Tipo de contrato',j.contract],['Nº de vagas',j.vacancies],['Salário',j.salary],['Sector',j.sector]].filter(x=>x[1]).map(x=>`<div class="info"><b>${x[0]}</b><br>${esc(x[1])}</div>`).join('')}</div>
    <h2 class="text-xl font-extrabold mt-6">Como se candidatar</h2>
    ${j.apply_method?`<p class="mt-2 max-w-2xl">${esc(j.apply_method)}</p>`:''}
    <div class="grid gap-2 mt-3 text-sm max-w-2xl">
     ${j.contact_email?`<div class="info"><b>Email:</b> <a class="underline" href="mailto:${esc(j.contact_email)}?subject=${encodeURIComponent('Candidatura: '+j.title)}">${esc(j.contact_email)}</a></div>`:''}
     ${j.contact_phone?`<div class="info"><b>Telefone / WhatsApp:</b> <a class="underline" href="tel:${esc(j.contact_phone.replace(/\s/g,''))}">${esc(j.contact_phone)}</a></div>`:''}
     ${j.contact_address?`<div class="info"><b>Entrega presencial:</b> ${esc(j.contact_address)}</div>`:''}
     ${j.url?`<div class="info"><b>Anúncio original:</b> <a class="underline break-all" href="${esc(j.url)}" target="_blank" rel="noopener">${esc(j.url)}</a></div>`:''}
     ${!(j.contact_email||j.contact_phone||j.contact_address||j.apply_url||j.url)?`<div class="info" style="background:#FFF0C2">Contacto de candidatura não confirmado. Consulte a fonte: ${esc(j.source)}.</div>`:''}
    </div>
    <p class="mt-3 text-sm text-slate-600 max-w-2xl">Candidate-se apenas pelos canais acima. Nunca pague taxas de inscrição nem partilhe senhas ou códigos.</p>
    <div class="mt-4 flex flex-wrap gap-2">
     ${j.apply_url?`<a class="btn" href="${esc(j.apply_url)}" target="_blank" rel="noopener">Candidatar-se online</a>`:''}
     <a class="btn2" href="https://wa.me/?text=${txt}" target="_blank" rel="noopener">WhatsApp</a>
     <a class="btn2" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener">Facebook</a>
     <button class="btn2" id="cp">Copiar link</button><button class="btn2" id="rp">Denunciar esta vaga</button></div>
   </div></article>
  ${sim.length?`<h2 class="text-xl font-extrabold mt-8 mb-3">Vagas semelhantes</h2><div class="grid gap-4 sm:grid-cols-2">${sim.map(card).join('')}</div>`:''}`;
  seo(j,url);
  $('#rp').onclick=()=>report(j);
  $('#cp').onclick=async e=>{try{await navigator.clipboard.writeText(url);e.target.textContent='Link copiado'}catch(_){e.target.textContent='Copie na barra de endereço'}};
  scrollTo(0,0);
}

/* ===== Painel administrativo ===== */
let tab='vagas',reports=[];
function pDen(){return reports.length?`<div class="grid gap-2">${reports.map(r=>{const j=jobs.find(x=>x.id===r.job_id);return `<div class="bg-white border rounded-xl p-3" style="border-color:var(--line)"><b>${esc(r.reason)}</b> — ${esc(j?j.title:'vaga #'+r.job_id)}<div class="text-sm text-slate-600">${esc(r.note||'')}</div>${j&&j.status==='published'?`<button class="btn2 mt-2" data-a="blk" data-i="${j.id}">Bloquear vaga</button>`:''}</div>`}).join('')}</div>`:'<p>Sem denúncias.</p>'}
function scoreJob(j){
  const f=[];let sc=0;
  if(j.url||j.apply_url)sc+=30;else f.push('Sem link oficial');
  if(j.contact_email||j.contact_phone||j.contact_address)sc+=20;else f.push('Sem contacto de candidatura');
  if(j.deadline>=dIn(0))sc+=15;else f.push('Prazo expirado');
  if((j.org||'').length>2)sc+=15;
  if((j.descr||'').length>60)sc+=20;else f.push('Descrição curta');
  if(/@(gmail|hotmail|yahoo|outlook)\./i.test(j.contact_email||'')){sc-=10;f.push('Email pessoal em vez de email da empresa')}
  if(/(taxa de|pagamento|dep[oó]sito|ganhe .* em casa|inscri[cç][aã]o paga|transfer[eê]ncia)/i.test((j.title||'')+' '+(j.descr||'')+' '+(j.apply_method||''))){sc=Math.min(sc,20);f.push('Possível golpe: menciona pagamento')}
  sc=Math.max(0,Math.min(100,sc));
  return {score:sc,flags:f,status:sc<50?'blocked':(sc>=cfgAuto.min&&cfgAuto.auto?'published':'review')};
}
const FIELDS=[['title','Título da vaga',1],['org','Empresa / entidade',1],['source','Nome da fonte (ex.: site oficial)',1],['url','Link do anúncio original (https://…)'],['apply_url','Link para candidatura online'],['contact_email','Email de candidatura'],['contact_phone','Telefone / WhatsApp'],['contact_address','Endereço para entrega presencial'],['apply_method','Como candidatar-se (instruções)'],['vacancies','Número de vagas'],['contract','Tipo de contrato'],['salary','Salário (se indicado)']];
function pNova(){return `<form id="nv" class="grid gap-3 max-w-2xl bg-white border rounded-xl p-4" style="border-color:var(--line)">
 ${FIELDS.map(f=>`<label class="text-sm">${f[1]}${f[2]?' *':''}<input name="${f[0]}" ${f[2]?'required':''}></label>`).join('')}
 <div class="grid sm:grid-cols-2 gap-3">
  <label class="text-sm">Sector *<select name="sector">${SECTORS.map(x=>`<option>${x}</option>`).join('')}</select></label>
  <label class="text-sm">Província *<select name="prov">${PROV.map(x=>`<option>${x}</option>`).join('')}</select></label>
  <label class="text-sm">Categoria *<select name="cat">${CATS.map(x=>`<option>${x}</option>`).join('')}</select></label>
  <label class="text-sm">Nível *<select name="level">${LEVELS.map(x=>`<option>${x}</option>`).join('')}</select></label></div>
 <label class="text-sm">Prazo de candidatura *<input name="deadline" type="date" required></label>
 <label class="text-sm">Descrição (com as suas palavras)<textarea name="descr" rows="4" class="w-full border rounded-lg p-2" style="border-color:var(--line)"></textarea></label>
 <label class="text-sm">Responsabilidades (uma por linha)<textarea name="responsibilities" rows="3" class="w-full border rounded-lg p-2" style="border-color:var(--line)"></textarea></label>
 <label class="text-sm">Requisitos (um por linha)<textarea name="requirements" rows="3" class="w-full border rounded-lg p-2" style="border-color:var(--line)"></textarea></label>
 <button class="btn">Verificar e guardar vaga</button><p id="nvm" class="text-sm"></p></form>`}
async function admin(){
  if(sb){
    const {data:{session}}=await sb.auth.getSession();
    if(!session){return $('#app').innerHTML=`<form id="lg" class="max-w-sm mx-auto bg-white border rounded-xl p-5 grid gap-3" style="border-color:var(--line)">
      <h1 class="text-2xl font-extrabold">Entrar no painel</h1>
      <input id="em" type="email" placeholder="Email" required><input id="pw" type="password" placeholder="Palavra-passe" required>
      <button class="btn">Entrar</button><p id="er" class="text-sm" style="color:var(--red)"></p></form>`,
      $('#lg').onsubmit=async e=>{e.preventDefault();const {error}=await sb.auth.signInWithPassword({email:$('#em').value,password:$('#pw').value});
        error?$('#er').textContent='Email ou palavra-passe incorrectos.':admin()}}
  }
  if(sb&&tab==='denúncias'){const {data}=await sb.from('bbs_reports').select('*').order('created_at',{ascending:false}).limit(100);reports=data||[]}
  const c=s=>jobs.filter(j=>j.status===s).length;
  $('#app').innerHTML=`
  <h1 class="text-2xl font-extrabold">Painel administrativo ${sb?'':'<span class="badge b-rev">modo demonstração</span>'}</h1>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
    ${[['Publicadas',c('published'),'var(--leaf)'],['Em revisão',c('review'),'#9a6b00'],['Bloqueadas',c('blocked'),'var(--red)'],['Expiradas',jobs.filter(j=>j.status==='published'&&expired(j)).length,'var(--ink)']]
    .map(s=>`<div class="bg-white border rounded-xl p-4" style="border-color:var(--line)"><div class="disp text-3xl font-extrabold" style="color:${s[2]}">${s[1]}</div><div class="text-sm">${s[0]}</div></div>`).join('')}
  </div>
  <div class="mt-5 flex gap-2 flex-wrap">${['vagas','nova vaga','denúncias','fontes','automação'].map(t=>`<button class="chip" data-t="${t}" aria-pressed="${t===tab}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div>
  <div id="pane" class="mt-4"></div>`;
  document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;admin()});
  $('#pane').innerHTML=tab==='vagas'?pVagas():tab==='nova vaga'?pNova():tab==='denúncias'?pDen():tab==='fontes'?pFontes():pAuto();
  bind();
}
const stB=j=>j.status==='published'?(expired(j)?'<span class="badge b-bad">Expirada</span>':'<span class="badge b-ok">Publicada</span>'):j.status==='review'?'<span class="badge b-rev">Em revisão</span>':'<span class="badge b-bad">Bloqueada</span>';
function pVagas(){return `<button class="btn2 mb-3" id="gp">Gerar cartazes pendentes</button><div class="grid gap-3">`+jobs.map(j=>`
 <div class="bg-white border rounded-xl p-4" style="border-color:var(--line)">
  <div class="flex flex-wrap items-center gap-2">${stB(j)}<span class="badge" style="background:#E6ECEB">Confiança ${j.score}/100</span></div>
  <h3 class="font-extrabold mt-1">${esc(j.title)}</h3>
  <p class="text-sm text-slate-700">${esc(j.org)} · ${esc(j.prov)} · prazo ${fmt(j.deadline)}</p>
  ${j.flags.length?`<ul class="text-sm mt-2" style="color:var(--red)">${j.flags.map(f=>`<li>⚠ ${esc(f)}</li>`).join('')}</ul>`:''}
  <div class="flex flex-wrap gap-2 mt-3">
   ${j.status!=='published'&&j.score>=50?`<button class="btn" data-a="pub" data-i="${j.id}">Aprovar e publicar</button>`:''}
   ${j.status!=='blocked'?`<button class="btn2" data-a="blk" data-i="${j.id}">Bloquear</button>`:''}
   <button class="btn2" data-a="poster" data-i="${j.id}">Gerar cartaz</button><button class="btn2" data-a="img" data-i="${j.id}">Definir imagem</button>
  </div></div>`).join('')+`</div><div id="pv" class="mt-4"></div>`}
function pFontes(){return `<div class="grid gap-2">`+sources.map(s=>`<div class="bg-white border rounded-xl p-3 flex justify-between gap-3" style="border-color:var(--line)"><div><b>${esc(s.name)}</b><div class="text-sm text-slate-600">${s.type} · ${s.trust}</div></div><div class="text-sm text-slate-600 whitespace-nowrap">Última leitura ${s.last}</div></div>`).join('')+`</div>
 <form id="fs" class="mt-4 grid gap-2 sm:grid-cols-3"><input id="sn" placeholder="Nome da fonte" required><input id="su" type="url" placeholder="https://…" required><button class="btn">Adicionar fonte</button></form>`}
function pAuto(){const t=(k,l)=>`<label class="flex items-center justify-between bg-white border rounded-xl p-3" style="border-color:var(--line)">${l}<input type="checkbox" data-k="${k}" ${cfgAuto[k]?'checked':''} style="width:auto"></label>`;
 return `<div class="grid gap-2 max-w-xl">${t('auto','Publicação automática (só fontes verificadas)')}${t('blogger','Publicar também no Blogger')}${t('social','Gerar cartazes automaticamente')}${t('expire','Marcar vagas expiradas')}
 <label class="bg-white border rounded-xl p-3" style="border-color:var(--line)">Pontuação mínima para publicar sozinho: <b id="mv">${cfgAuto.min}</b><input id="mn" type="range" min="50" max="100" value="${cfgAuto.min}" style="padding:0"></label>
 <p class="text-sm text-slate-600">Vagas abaixo de 50, com pedido de pagamento ou sem origem verificável ficam sempre bloqueadas.</p></div>`}
function bind(){
  document.querySelectorAll('[data-a]').forEach(b=>b.onclick=async()=>{
    const j=jobs.find(x=>x.id==b.dataset.i);const a=b.dataset.a;
    if(a==='poster')return poster(j);
    if(a==='img'){const u=prompt('URL da imagem (https://…). Deixe vazio para usar a capa automática:',j.image||'');if(u===null)return;j.image=u.trim()||null;if(sb)await sb.from('bbs_jobs').update({image:j.image}).eq('id',j.id);return admin()}
    j.status=a==='pub'?'published':'blocked';
    if(sb)await sb.from('bbs_jobs').update({status:j.status}).eq('id',j.id);
    admin()});
  document.querySelectorAll('[data-k]').forEach(i=>i.onchange=()=>cfgAuto[i.dataset.k]=i.checked);
  const mn=$('#mn');if(mn)mn.oninput=()=>{cfgAuto.min=+mn.value;$('#mv').textContent=mn.value};
  const gp=$('#gp');if(gp)gp.onclick=uploadPosters;
  const nv=$('#nv');if(nv)nv.onsubmit=async e=>{e.preventDefault();
    const j=Object.fromEntries(new FormData(nv).entries());Object.keys(j).forEach(k=>{if(j[k]==='')j[k]=null});
    if(j.vacancies)j.vacancies=String(j.vacancies);
    for(const k of ['url','apply_url']){if(j[k]&&!safeUrl(j[k])){$('#nvm').textContent='Os links têm de começar por https://';return}}
    Object.assign(j,scoreJob(j));
    let ok=true;
    if(sb){const {data,error}=await sb.from('bbs_jobs').insert(j).select().single();if(error){ok=false;$('#nvm').textContent='Erro ao guardar: '+error.message}else j.id=data.id}
    else j.id=Date.now();
    if(ok){jobs.unshift(j);tab='vagas';admin();alert('Vaga guardada. Estado: '+({published:'publicada',review:'em revisão',blocked:'bloqueada'})[j.status]+' (confiança '+j.score+'/100).'+(j.flags.length?'\nAlertas: '+j.flags.join('; '):''))}};
  const fs=$('#fs');if(fs)fs.onsubmit=async e=>{e.preventDefault();const u=$('#su').value;if(!safeUrl(u)){alert('O link da fonte tem de começar por https://');return}const n={name:$('#sn').value,type:'Portal',trust:'Revisão manual',url:u,last:'ainda não lida'};if(sb){const {error}=await sb.from('bbs_sources').insert({name:n.name,url:u,type:n.type,trust:n.trust});if(error)return alert('Erro: '+error.message)}sources.push(n);admin()};
}
function poster(j,silent){
  const c=document.createElement('canvas');c.width=1080;c.height=1080;const x=c.getContext('2d');
  x.fillStyle='#0E3B43';x.fillRect(0,0,1080,1080);x.fillStyle='#F2A900';x.fillRect(0,0,1080,28);
  x.fillStyle='#fff';x.font='800 40px sans-serif';x.fillText('BBS TRENDS',70,120);
  x.fillStyle='#F2A900';x.font='600 34px sans-serif';x.fillText(j.level==='Sem experiência'?'VAGA PARA JOVENS · SEM EXPERIÊNCIA':'VAGA ABERTA',70,210);
  x.fillStyle='#fff';x.font='800 78px sans-serif';
  let y=330,line='';for(const w of j.title.split(' ')){const t=line+w+' ';if(x.measureText(t).width>900){x.fillText(line,70,y);y+=92;line=w+' '}else line=t}x.fillText(line,70,y);
  x.font='500 42px sans-serif';x.fillStyle='#CFE3E0';x.fillText(j.org,70,y+90);x.fillText(j.prov,70,y+150);
  x.fillStyle='#F2A900';x.fillRect(70,880,940,110);x.fillStyle='#10242A';x.font='800 44px sans-serif';
  x.fillText('Prazo: '+fmt(j.deadline),100,950);x.font='500 30px sans-serif';x.fillStyle='#CFE3E0';x.fillText('bbstrends.blogspot.com',70,1050);
  if(silent)return c;
  c.style.cssText='max-width:360px;border-radius:12px';
  const a=document.createElement('a');a.className='btn inline-block mt-3';a.textContent='Descarregar PNG';a.href=c.toDataURL('image/png');a.download='bbs-vaga-'+j.id+'.png';
  const p=$('#pv');p.innerHTML='';p.append(c,document.createElement('br'),a);p.scrollIntoView({behavior:'smooth'});
}

async function uploadPosters(){
  if(!sb)return alert('Ligue primeiro o Supabase.');
  const todo=jobs.filter(j=>j.status==='published'&&!expired(j)&&!j.poster_url);
  if(!todo.length)return alert('Todas as vagas publicadas já têm cartaz.');
  let n=0;
  for(const j of todo){const c=poster(j,true);const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.92));const path=`job-${j.id}.jpg`;
    const {error}=await sb.storage.from('posters').upload(path,blob,{upsert:true,contentType:'image/jpeg'});
    if(error){alert('Erro no envio: '+error.message);break}
    const url=sb.storage.from('posters').getPublicUrl(path).data.publicUrl;
    await sb.from('bbs_jobs').update({poster_url:url}).eq('id',j.id);j.poster_url=url;n++}
  alert(n+' cartaz(es) criados. As redes sociais publicam-nos no próximo ciclo.');admin()}
function applyTheme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem('bbs-theme',t)}catch(_){}}
(function(){let t;try{t=localStorage.getItem('bbs-theme')}catch(_){}applyTheme(t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
  $('#tt').onclick=()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')})();
async function route(){try{await Promise.race([load(),new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),6000))])}catch(e){console.warn('Falha ao carregar dados:',e)}
  document.title='BBS Trends — Vagas de emprego em Moçambique';const Q=new URLSearchParams(location.search),v=Q.get('vaga'),p=Q.get('p');location.hash==='#admin'?admin():v?detail(v):p?page(p):pub()}
addEventListener('hashchange',route);route();
