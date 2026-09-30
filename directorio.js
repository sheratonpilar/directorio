(function(){
var qs=new URLSearchParams(location.search);
var lang=['es','en','pt'].indexOf(qs.get('lang'))>=0?qs.get('lang'):'es';
var data=null,app=document.getElementById('app'),bar=document.getElementById('bar'),hero=document.getElementById('hero');
var UI={
 es:{buscar:'Buscar un servicio…',sin:'No encontramos nada con eso. Pruebe con otra palabra o marque 0 desde su habitación.',act:'Actualizado',wa:'WhatsApp',mail:'Escribir un mail',marque:'Marque',interno:'Interno',mas:'Ver más',cierre:'¡Que tenga una excelente estadía!',error:'No pudimos cargar el directorio. Marque 0 desde su habitación para cualquier consulta.'},
 en:{buscar:'Search a service…',sin:'Nothing matches that. Try another word or dial 0 from your room.',act:'Updated',wa:'WhatsApp',mail:'Send an email',marque:'Dial',interno:'Extension',mas:'See more',cierre:'Enjoy your stay!',error:'The directory could not be loaded. Dial 0 from your room for any request.'},
 pt:{buscar:'Buscar um serviço…',sin:'Nada encontrado. Tente outra palavra ou disque 0 do seu quarto.',act:'Atualizado',wa:'WhatsApp',mail:'Enviar e-mail',marque:'Disque',interno:'Ramal',mas:'Ver mais',cierre:'Tenha uma excelente estadia!',error:'Não foi possível carregar o diretório. Disque 0 do seu quarto.'}};
var IC={
 reloj:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 wa:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.2-.2-.2-.5-.4z"/></svg>',
 tel:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
 mail:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
 link:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'};

function t(o){if(!o)return'';if(typeof o==='string')return o;return o[lang]||o.es||''}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
// Escapa primero y después aplica **negrita**, *itálica* y saltos de línea (seguro anti-XSS).
function fmt(s){s=esc(s);s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');s=s.replace(/(^|[^*])\*([^*]+)\*/g,'$1<em>$2</em>');return s.replace(/\r\n|\r|\n/g,'<br>')}
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}

if(window.__DATA__){data=window.__DATA__;render()}
else fetch('data/directorio.json?v='+Date.now()).then(function(r){if(!r.ok)throw 0;return r.json()})
 .then(function(d){data=d;render()}).catch(function(){app.innerHTML='<p class="empty">'+esc(UI[lang].error)+'</p>'});

function render(){
 var d=data.directorio,ids=d.idiomas&&d.idiomas.length?d.idiomas:['es'];
 document.documentElement.lang=lang;
 hero.innerHTML='<h1 class="hero__name">'+esc(d.nombre)+'</h1>'+(t(d.bajada)?'<p class="hero__desc">'+fmt(t(d.bajada))+'</p>':'');
 var langHTML=ids.length>1?'<div class="lang">'+ids.map(function(l){return'<button type="button" data-lang="'+l+'" aria-pressed="'+(l===lang)+'">'+l.toUpperCase()+'</button>'}).join('')+'</div>':'';
 bar.innerHTML='<div class="bar__ident">'+esc(d.nombre)+'</div>'+
  '<div class="searchrow"><div class="search"><input id="q" type="search" autocomplete="off" aria-label="'+esc(UI[lang].buscar)+'" placeholder="'+esc(UI[lang].buscar)+'"></div>'+langHTML+'</div>'+
  '<nav class="chips" id="chips">'+data.secciones.map(function(s){return'<a href="#'+s.id+'">'+esc(t(s.nombre))+'</a>'}).join('')+'</nav>';
 bar.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){lang=b.dataset.lang;qs.set('lang',lang);history.replaceState(null,'','?'+qs.toString()+location.hash);render()})});
 bar.querySelector('#q').addEventListener('input',function(e){filtrar(e.target.value)});
 paint(data.secciones);spy();watchHero();
}

function simple(i){return !i.descripcion&&!i.horario&&!i.aviso&&!i.whatsapp&&!i.mail&&!i.link&&!i.interno}

function itemHTML(i){
 var h='<article class="item" id="'+esc(i.id)+'"><div class="item__head"><h3 class="item__name">'+esc(t(i.nombre))+'</h3>'+(i.dato?'<span class="dato">'+esc(i.dato)+'</span>':'')+'</div>';
 if(i.aviso)h+='<span class="aviso">'+esc(t(i.aviso))+'</span>';
 if(i.horario)h+='<div class="horario">'+IC.reloj+'<div>'+t(i.horario).split('·').map(function(x){return'<span>'+esc(x.trim())+'</span>'}).join('')+'</div></div>';
 if(i.descripcion)h+='<p class="item__desc">'+fmt(t(i.descripcion))+'</p>';
 var a='';
 if(i.whatsapp)a+='<a class="btn btn--wa" href="https://wa.me/'+esc(i.whatsapp)+'" target="_blank" rel="noopener">'+IC.wa+esc(UI[lang].wa)+'</a>';
 if(i.mail)a+='<a class="btn" href="mailto:'+esc(i.mail)+'">'+IC.mail+esc(i.mail)+'</a>';
 if(i.link)a+='<a class="btn" href="'+esc(i.link)+'" target="_blank" rel="noopener">'+IC.link+esc(t(i.link_texto)||UI[lang].mas)+'</a>';
 if(i.interno)a+='<span class="interno">'+IC.tel+esc(String(i.interno)==='0'?UI[lang].marque+' 0':UI[lang].interno+' '+i.interno)+'</span>';
 if(a)h+='<div class="acciones">'+a+'</div>';
 return h+'</article>';
}

function paint(secs){
 var d=data.directorio,html='<div class="wrap">';
 if(!secs.length){app.innerHTML=html+'<p class="empty">'+esc(UI[lang].sin)+'</p></div>';return}
 secs.forEach(function(s){
  html+='<section class="sec" id="'+esc(s.id)+'"><div class="sec__head">';
  if(s.foto)html+='<img class="sec__foto" src="img/'+esc(s.foto)+'" alt="" loading="lazy" onerror="this.remove()">';
  html+='<h2 class="sec__title">'+esc(t(s.nombre))+'</h2>'+(t(s.nota)?'<p class="sec__note">'+fmt(t(s.nota))+'</p>':'')+'</div>';
  // Agrupa ítems simples consecutivos (solo nombre + dato) en una lista compacta.
  var buf=[];
  function flush(){if(!buf.length)return;html+='<ul class="list'+(buf.length>=12?' list--grid':'')+'">'+buf.map(function(i){return'<li><span>'+esc(t(i.nombre))+'</span>'+(i.dato?'<span class="dots"></span><span class="val">'+esc(i.dato)+'</span>':'')+'</li>'}).join('')+'</ul>';buf=[]}
  s.items.forEach(function(i){if(simple(i))buf.push(i);else{flush();html+=itemHTML(i)}});
  flush();
  html+='</section>';
 });
 var f=new Date(d.actualizado).toLocaleDateString(lang==='en'?'en-GB':lang==='pt'?'pt-BR':'es-AR');
 html+='<footer class="foot"><p class="foot__cierre">'+esc(UI[lang].cierre)+'</p>'+
  (d.direccion?'<p>'+fmt(d.direccion)+'</p>':'')+(t(d.pie)?'<p>'+fmt(t(d.pie))+'</p>':'')+
  '<p>'+esc(UI[lang].act)+': '+f+'</p></footer></div>';
 app.innerHTML=html;
}

function filtrar(q){
 var n=norm(q.trim());if(!n){paint(data.secciones);spy();return}
 var res=data.secciones.map(function(s){
  var secMatch=norm(t(s.nombre)).indexOf(n)>=0;
  var items=secMatch?s.items:s.items.filter(function(i){return norm([t(i.nombre),t(i.descripcion),t(i.horario),i.dato||''].join(' ')).indexOf(n)>=0});
  return items.length?{id:s.id,nombre:s.nombre,nota:s.nota,items:items}:null}).filter(Boolean);
 paint(res);
}

function watchHero(){
 if(!('IntersectionObserver'in window)){bar.classList.add('compact');return}
 if(window.__heroObs)window.__heroObs.disconnect();
 window.__heroObs=new IntersectionObserver(function(es){es.forEach(function(e){bar.classList.toggle('compact',!e.isIntersecting)})},{rootMargin:'-40px 0px 0px 0px'});
 window.__heroObs.observe(hero);
}

function spy(){
 if(!('IntersectionObserver'in window))return;
 var chips=document.querySelectorAll('#chips a');
 if(window.__spyObs)window.__spyObs.disconnect();
 window.__spyObs=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
  chips.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.setAttribute('aria-current',on);if(on)a.scrollIntoView({block:'nearest',inline:'center'})})})},{rootMargin:'-130px 0px -70% 0px'});
 document.querySelectorAll('.sec').forEach(function(s){window.__spyObs.observe(s)});
}
})();
