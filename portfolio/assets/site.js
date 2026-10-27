(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
var root=document.documentElement;
var hasGsap=!!window.gsap&&!!window.ScrollTrigger;
if(hasGsap) gsap.registerPlugin(ScrollTrigger);
/* pages always open at the top (or at #hash): never restore the last page's offset */
if("scrollRestoration" in history) history.scrollRestoration="manual";

/* ---------- smooth scroll ---------- */
var lenis=null;
if(hasGsap&&!reduce&&window.Lenis){
  lenis=new Lenis({lerp:.09});
  lenis.on("scroll",ScrollTrigger.update);
  gsap.ticker.add(function(t){lenis.raf(t*1000)});
  gsap.ticker.lagSmoothing(0);
}
$$("[data-go]").forEach(function(a){a.addEventListener("click",function(e){
  var t=$(a.getAttribute("data-go")); if(!t) return; e.preventDefault();
  if(lenis) lenis.scrollTo(t,{offset:a.getAttribute("data-go")==="#top"?0:-10,duration:1.6}); else t.scrollIntoView({behavior:reduce?"auto":"smooth"});
});});

/* ---------- world colour ---------- */
var WORLDS={paper:[236,228,210],lime:[198,242,74],ember:[232,112,72],brass:[232,184,76],sky:[127,180,232],violet:[167,139,250],mint:[79,209,176],cherry:[245,86,98],orchid:[208,125,232]};
var world={r:236,g:228,b:210};
function paint(){var v="rgb("+(world.r|0)+" "+(world.g|0)+" "+(world.b|0)+")";root.style.setProperty("--world",v)}
function setWorld(k){var c=WORLDS[k]; if(!c||!hasGsap) return; gsap.to(world,{r:c[0],g:c[1],b:c[2],duration:.9,ease:"power2.out",overwrite:true,onUpdate:paint})}
paint();
(function(){var s=$("[data-start]"),c=s&&WORLDS[s.getAttribute("data-start")];if(c){world.r=c[0];world.g=c[1];world.b=c[2];paint()}})();
/* created after the journey pin so section positions include its pin spacing */
function initWorlds(){
  $$("[data-world]").forEach(function(s){
    ScrollTrigger.create({trigger:s,start:"top 55%",end:"bottom 55%",onToggle:function(self){if(self.isActive) setWorld(s.getAttribute("data-world"))}});
  });
}

/* ---------- ambient dot field ---------- */
(function(){
  var cv=$("#field"),ctx=cv.getContext("2d"),W=0,H=0,dpr=1,mx=-999,my=-999,sy=0,GAP=36;
  function size(){dpr=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  size(); addEventListener("resize",size);
  addEventListener("pointermove",function(e){mx=e.clientX;my=e.clientY},{passive:true});
  function frame(t){
    ctx.clearRect(0,0,W,H);
    var off=(-(window.scrollY||0)*.18)%GAP; if(off<0) off+=GAP;
    var rr=world.r|0,gg=world.g|0,bb=world.b|0;
    for(var y=-GAP+off;y<H+GAP;y+=GAP){
      for(var x=GAP/2;x<W+GAP;x+=GAP){
        var dx=x-mx,dy=y-my,d=Math.sqrt(dx*dx+dy*dy),inf=d<200?1-d/200:0;
        var wv=Math.sin(t*.0007+x*.011+y*.013);
        var px=x+(inf?dx/d*inf*16:0),py=y+wv*2+(inf?dy/d*inf*16:0);
        ctx.fillStyle="rgba("+rr+","+gg+","+bb+","+(.1+.05*wv+inf*.65).toFixed(3)+")";
        ctx.beginPath();ctx.arc(px,py,1+inf*2.2,0,6.283);ctx.fill();
      }
    }
  }
  if(reduce){frame(0)} else {(function loop(t){frame(t);requestAnimationFrame(loop)})(0)}
})();

/* ---------- cursor ring ---------- */
if(fine&&hasGsap){
  var cur=$("#cur"),cx=gsap.quickTo(cur,"x",{duration:.35,ease:"power3"}),cy=gsap.quickTo(cur,"y",{duration:.35,ease:"power3"});
  addEventListener("pointermove",function(e){cur.classList.add("on");cx(e.clientX);cy(e.clientY)},{passive:true});
  document.addEventListener("pointerover",function(e){cur.classList.toggle("big",!!e.target.closest("a,button,.nc,.cc,.jc,.pola"))});
}

/* ---------- progress bar ---------- */
if(hasGsap) ScrollTrigger.create({start:0,end:"max",onUpdate:function(s){$("#bar").style.transform="scaleX("+s.progress+")"}});

/* ---------- hero ---------- */
$$("[data-split]").forEach(function(l){
  var txt=l.textContent; l.textContent="";
  txt.split("").forEach(function(c){var s=document.createElement("span");s.className="ch";s.textContent=c;l.appendChild(s)});
});
var roles=["compatibility layers.","pixel-art worlds.","tools for my family's business.","robot parts.","things that run on a Mac."];
if(hasGsap&&!reduce&&$(".hero")){
  gsap.from(".hero-name .ch",{yPercent:118,rotate:7,stagger:.04,duration:1.25,ease:"expo.out",delay:.1});
  gsap.from(".hero-eyebrow > *, .build, .hero-copy > *",{y:24,opacity:0,stagger:.09,duration:1,ease:"power3.out",delay:.75});
  gsap.from(".float .fi",{scale:.5,opacity:0,rotate:function(i){return i%2?10:-10},stagger:.09,duration:1.2,ease:"back.out(1.5)",delay:.85});
  var role=$(".role"),ri=0;
  setInterval(function(){
    gsap.to(role,{yPercent:-110,opacity:0,duration:.35,ease:"power2.in",onComplete:function(){
      ri=(ri+1)%roles.length; role.textContent=roles[ri];
      gsap.fromTo(role,{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:.5,ease:"power3.out"});
    }});
  },2700);
  var fl=$$(".float").map(function(el){var fi=$(".fi",el);return {d:+el.getAttribute("data-d"),x:gsap.quickTo(fi,"x",{duration:1,ease:"power3"}),y:gsap.quickTo(fi,"y",{duration:1,ease:"power3"}),el:el}});
  addEventListener("pointermove",function(e){var nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;fl.forEach(function(f){f.x(nx*f.d*-70);f.y(ny*f.d*-70)})},{passive:true});
  fl.forEach(function(f){gsap.to(f.el,{yPercent:f.d*-45,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}})});
}

/* ---------- marquees ---------- */
if(hasGsap){
  $$(".marq-in").forEach(function(inner){
    inner.innerHTML+=inner.innerHTML;
    if(reduce) return;
    var rev=inner.hasAttribute("data-rev");
    var tw=rev?gsap.fromTo(inner,{xPercent:-50},{xPercent:0,repeat:-1,ease:"none",duration:38}):gsap.to(inner,{xPercent:-50,repeat:-1,ease:"none",duration:38});
    gsap.ticker.add(function(){var v=lenis?Math.min(Math.abs(lenis.velocity),30):0;tw.timeScale(1+v*.4)});
  });
}

/* ---------- about ---------- */
var st=$("#statement");
if(st){
  var words=st.textContent.trim().split(/\s+/); st.textContent="";
  words.forEach(function(w){var s=document.createElement("span");s.className="w";s.textContent=w;st.appendChild(s)});
  if(hasGsap&&!reduce) gsap.fromTo($$(".w",st),{opacity:.2},{opacity:1,stagger:.12,ease:"none",scrollTrigger:{trigger:st,start:"top 82%",end:"bottom 52%",scrub:true}});
}
if(hasGsap&&!reduce) $$("[data-count]").forEach(function(el){
  var end=+el.getAttribute("data-count"),pre=el.getAttribute("data-pre")||"",o={v:0};
  ScrollTrigger.create({trigger:el,start:"top 92%",once:true,onEnter:function(){
    gsap.to(o,{v:end,duration:1.8,ease:"power2.out",onUpdate:function(){el.textContent=pre+Math.round(o.v).toLocaleString("en-US")}});
  }});
});

/* ---------- journey (pinned horizontal) ---------- */
if(hasGsap&&$(".j-track")){
  var mm=gsap.matchMedia();
  mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)",function(){
    var track=$(".j-track"),sec=$(".journey"),rail=$(".j-rail i");
    var dist=function(){return Math.max(0,track.scrollWidth-innerWidth)};
    var tween=gsap.to(track,{x:function(){return -dist()},ease:"none",scrollTrigger:{trigger:sec,start:"top top",end:function(){return "+="+dist()},pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,onUpdate:function(s){rail.style.transform="scaleX("+s.progress+")"}}});
    $$(".jc").forEach(function(c){gsap.from(c,{y:50,opacity:.25,duration:.8,ease:"power3.out",scrollTrigger:{trigger:c,containerAnimation:tween,start:"left 92%",toggleActions:"play none none none"}})});
  });
  mm.add("(max-width: 860px), (prefers-reduced-motion: reduce)",function(){
    var rail=$(".j-rail i");
    ScrollTrigger.create({trigger:".j-track",start:"top 80%",end:"bottom 60%",onUpdate:function(s){rail.style.transform="scaleX("+s.progress+")"}});
  });
}

if(hasGsap) initWorlds();

/* ---------- orbit ---------- */
(function(){
  var r1=$("#r1"),r2=$("#r2"),info=$("#orbitInfo"); if(!r1) return;
  var sats=["the-hero","cinder-sovereign","bellows","brotato","penguin","nanny","general-gorge","bunny-post","galloway","dame-buttercup","goldfish","freed-donkey"];
  sats.forEach(function(s,i){var d=document.createElement("div");d.className="sat";d.style.setProperty("--i",i);var im=document.createElement("img");im.src="assets/cast/"+s+".webp";im.alt="";im.loading="lazy";d.appendChild(im);r2.appendChild(d)});
  var ang=0,hold=false;
  $$(".nc",r1).forEach(function(n){
    var set=function(){var p=n.getAttribute("data-info").split("|");info.innerHTML="<b></b><span></span>";info.firstChild.textContent=p[0];info.lastChild.textContent=p[1];hold=true};
    var clear=function(){hold=false};
    n.addEventListener("mouseenter",set);n.addEventListener("focus",set);n.addEventListener("mouseleave",clear);n.addEventListener("blur",clear);
  });
  function tick(dt){
    if(!hold) ang+=dt*.0045;
    var a=ang+(window.scrollY||0)*.05;
    r1.style.setProperty("--a",a+"deg");r2.style.setProperty("--a",(-a*1.25)+"deg");
  }
  if(reduce){tick(0)} else if(hasGsap){gsap.ticker.add(function(t,dt){tick(dt)})} else {var last=0;(function loop(t){tick(t-last);last=t;requestAnimationFrame(loop)})(0)}
})();

/* ---------- verjuice stack tilt ---------- */
(function(){
  var stack=$("#stack"); if(!stack||!hasGsap||reduce) return;
  var inn=$(".stack-in",stack),rx=gsap.quickTo(inn,"rotationX",{duration:.8,ease:"power3"}),ry=gsap.quickTo(inn,"rotationY",{duration:.8,ease:"power3"});
  stack.addEventListener("pointermove",function(e){var b=stack.getBoundingClientRect();ry(((e.clientX-b.left)/b.width-.5)*16);rx(-((e.clientY-b.top)/b.height-.5)*12)});
  stack.addEventListener("pointerleave",function(){rx(0);ry(0)});
  gsap.from($$(".shot",stack),{y:90,opacity:.2,stagger:.14,duration:1.1,ease:"power3.out",scrollTrigger:{trigger:stack,start:"top 85%"}});
})();

/* ---------- Chickens VS Llamas cast ---------- */
(function(){
  var C={
    "The Heroes":[["the-hero","The Hero","Has to save everyone. Has a sword."],["elder-henrietta","Elder Henrietta","Runs the roost. Knows everything."],["purl-tanglewelt","Purl Tanglewelt","Master weaver of Loomwick."],["sapper-truffle","Sapper Truffle","Digs under anything. Everything."],["dame-buttercup","Dame Buttercup","Pike captain. Will not leave the line."],["dabbler-quackworth","Dabbler Quackworth","Duck merchant. You owe him."]],
    "The Llamarchy":[["cinder-sovereign","The Cinder Sovereign","Llamarch of Spitfire. The big bad."],["baron-ironback","Baron Ironback","Iron plates, mine lamp, bad mood."],["admiral-dribbleton","Admiral Dribbleton","Drools on his own cutlass."],["general-gorge","General Gorge","Massive. Hungry. Drooling."],["chancellor-hoard","Chancellor Hoard","Counts every coin. Flings the rest."],["archpriest-smolder","Archpriest Smolder","Ash, embers and a swinging censer."]],
    "Allies":[["bellows","Bellows","The one good llama. Runs the Forge."],["governess-thistlewool","Governess Thistlewool","Sit up straight. No, the other straight."],["galloway","Galloway","Fast. Smug. Do not touch the mane."],["gouda","Gouda","Mouse spy. Master of disguise."],["nibble","Nibble","Ate your hat. Still eating it."],["freed-donkey","The Freed Donkey","Hmph. ...Here. Water. Don't mention it."]],
    "Oddballs":[["brotato","Brotato","Says the word \"oink\". Never skips leg day."],["gary","Gary","A crocodile. Totally not a spy."],["sundae","Sundae","Broke the chair. Wants ice cream."],["dinner","Dinner","..."],["mumbles","Mumbles","Talks in his sleep. Never wakes up."],["gary-later","Gary, later","Quit spying. Makes candy now."],["goldfish","The Goldfish","Lives in a puddle. Wants seeds."],["lil-hooks","Lil' Hooks","Brotato's boxing coach. Tiny. Loud."],["penguin","The Penguin","Raincoat on. It is not raining."],["nanny","Nanny","Knits. Complains. Knits more."],["roach-band","Roach Band","Ten tiny bands hidden on the roads."],["bunny-post","The Bunny Post","Got a letter for you."]]
  };
  var tabs=$("#tabs"),grid=$("#cast"),keys=Object.keys(C),cur=0; if(!tabs) return;
  function render(k,anim){
    grid.innerHTML="";
    C[k].forEach(function(c){
      var d=document.createElement("div");d.className="cc";
      var im=document.createElement("img");im.src="assets/cast/"+c[0]+".webp";im.alt=c[1]+", pixel-art character";im.loading="lazy";
      var t=document.createElement("div");var b=document.createElement("b");b.textContent=c[1];var s=document.createElement("span");s.textContent=c[2];t.appendChild(b);t.appendChild(s);
      d.appendChild(im);d.appendChild(t);grid.appendChild(d);
    });
    if(anim&&hasGsap&&!reduce) gsap.from(grid.children,{y:36,opacity:0,scale:.94,stagger:.05,duration:.6,ease:"back.out(1.4)"});
  }
  keys.forEach(function(k,i){
    var b=document.createElement("button");b.className="tab";b.type="button";b.setAttribute("role","tab");b.setAttribute("aria-selected",i===0?"true":"false");b.textContent=k+" ("+C[k].length+")";
    b.addEventListener("click",function(){$$(".tab",tabs).forEach(function(x){x.setAttribute("aria-selected","false")});b.setAttribute("aria-selected","true");render(k,true)});
    tabs.appendChild(b);
  });
  render(keys[0],false);
  var map=$(".mapbox img");
  if(hasGsap&&!reduce&&map){
    gsap.fromTo(map,{scale:1.25,xPercent:-4},{scale:1.02,xPercent:0,ease:"none",scrollTrigger:{trigger:".mapbox",start:"top bottom",end:"bottom top",scrub:true}});
  }
})();

/* ---------- PDF illustration ---------- */
(function(){
  var st=$("#pdfstage"); if(!st||!hasGsap||reduce) return;
  var doc=$(".doc",st),hl=$(".dl.hl",st),pin=$(".pin",st),stamp=$(".stamp",st),sig=$(".sig path",st);
  gsap.set(hl,{"--hl":0});gsap.set(pin,{"--pin":0});gsap.set(stamp,{"--stamp":2.4,"--so":0});gsap.set(sig,{"--sg":240});
  var tl=gsap.timeline({scrollTrigger:{trigger:st,start:"top 70%"},repeat:-1,repeatDelay:2.8});
  tl.fromTo(doc,{y:40,opacity:.2},{y:0,opacity:1,duration:.8,ease:"power3.out"},0)
    .to(sig,{"--sg":0,duration:1.1,ease:"power1.inOut"},.4)
    .to(hl,{"--hl":1,duration:.7,ease:"power2.inOut"},1.4)
    .to(pin,{"--pin":1,duration:.55,ease:"back.out(2.4)"},2.1)
    .to(stamp,{"--stamp":1,"--so":1,duration:.4,ease:"power4.in"},3)
    .to(doc,{rotation:-1.2,duration:.12,yoyo:true,repeat:1},3.35)
    .to([hl,pin,stamp],{opacity:0,duration:.5},6.2)
    .set(hl,{"--hl":0,opacity:1}).set(pin,{"--pin":0,opacity:1}).set(stamp,{"--stamp":2.4,"--so":0,opacity:1}).set(sig,{"--sg":240});
})();

/* ---------- abroad route ---------- */
if(hasGsap&&!reduce){
  /* legs draw in order (the masks reveal each leg, so the dashed one stays dashed) and a dot rides along */
  $$(".route").forEach(function(svg){
    var rv=$$(".rv",svg),dot=$(".rdot",svg),n=rv.length,o={p:0}; if(!n) return;
    var L=rv.map(function(p){var l=p.getTotalLength();gsap.set(p,{strokeDasharray:l,strokeDashoffset:l});return l});
    var tl=gsap.timeline({scrollTrigger:{trigger:svg,start:"top 82%",end:"bottom 40%",scrub:.8}});
    rv.forEach(function(p,i){tl.to(p,{strokeDashoffset:0,ease:"none",duration:1},i)});
    if(dot) tl.to(o,{p:n,ease:"none",duration:n,onUpdate:function(){
      var k=Math.min(n-1,Math.floor(o.p)),pt=rv[k].getPointAtLength(L[k]*Math.min(1,o.p-k));
      dot.setAttribute("cx",pt.x);dot.setAttribute("cy",pt.y);dot.setAttribute("opacity",o.p>.01&&o.p<n-.01?1:0);
    }},0);
  });
  $$(".pola").forEach(function(p,i){gsap.from(p,{y:80,rotate:0,opacity:.2,duration:.9,delay:i*.1,ease:"power3.out",scrollTrigger:{trigger:".polas",start:"top 90%"}})});
}

/* ---------- generic reveals ---------- */
if(hasGsap&&!reduce){
  $$(".chap-head, .chap-copy, .leg, .sk, .mail, .say span, .kicker, .h2, .nextp").forEach(function(el){
    gsap.from(el,{y:44,opacity:.15,duration:.9,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 90%",once:true}});
  });
}

/* ---------- copy buttons ---------- */
$$("[data-copy]").forEach(function(b){b.addEventListener("click",function(){
  var v=b.getAttribute("data-copy"),done=function(){var o=b.textContent;b.textContent="Copied";setTimeout(function(){b.textContent=o},1500)};
  try{navigator.clipboard.writeText(v).then(done,function(){sel(b)})}catch(e){sel(b)}
});});
function sel(b){var a=b.parentNode.querySelector(".addr");if(!a) return;var r=document.createRange();r.selectNodeContents(a);var s=getSelection();s.removeAllRanges();s.addRange(r)}

/* ---------- polish: menu, range, photos, compare, magnet ---------- */
(function(){
  var b=$(".burger"),m=$("#menu"); if(b&&m){
    function set(o){m.classList.toggle("open",o);b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Close menu":"Open menu");document.documentElement.style.overflow=o?"hidden":"";if(lenis){o?lenis.stop():lenis.start()}}
    b.addEventListener("click",function(){set(!m.classList.contains("open"))});
    addEventListener("keydown",function(e){if(e.key==="Escape"&&m.classList.contains("open")){set(false);b.focus()}});
    m.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a"); if(a&&a.getAttribute("href").charAt(0)==="#") set(false)});
  }
  var rg=$("#rg"); if(rg){
    var ps=$$(".rp",rg);
    function on(p){ps.forEach(function(x){x.classList.toggle("on",x===p)});var c=getComputedStyle(p).getPropertyValue("--c");}
    ps.forEach(function(p){
      p.addEventListener("mouseenter",function(){if(matchMedia("(hover:hover) and (min-width:901px)").matches) on(p); if(hasGsap){var k=/--c:var\(--(\w+)\)/.exec(p.getAttribute("style")||"");if(k)setWorld(k[1])}});
      p.addEventListener("focus",function(){on(p)});
      p.addEventListener("click",function(e){if(e.target.closest("a")) return; on(p)});
    });
  }
  if(hasGsap&&!reduce){
    $$(".ph").forEach(function(f){
      var box=$(".ph-in",f),im=$("img,video",f); if(!box||!im) return;
      gsap.fromTo(box,{clipPath:"inset(100% 0% 0% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",duration:1.2,ease:"power4.out",clearProps:"clipPath",scrollTrigger:{trigger:f,start:"top 88%",once:true}});
      gsap.fromTo(im,{scale:1.25},{scale:1,duration:1.6,ease:"power3.out",scrollTrigger:{trigger:f,start:"top 88%",once:true}});
      gsap.fromTo(im,{yPercent:-3},{yPercent:3,ease:"none",scrollTrigger:{trigger:f,start:"top bottom",end:"bottom top",scrub:true}});
    });
    $$(".stp, .tile").forEach(function(el,i){gsap.from(el,{y:30,opacity:0,duration:.8,delay:(i%4)*.06,ease:"power3.out",clearProps:"transform,opacity",scrollTrigger:{trigger:el,start:"top 92%",once:true}})});
    if(matchMedia("(hover:hover)").matches) $$(".btn").forEach(function(el){
      el.addEventListener("mousemove",function(e){var r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.28,duration:.3,ease:"power2.out"})});
      el.addEventListener("mouseleave",function(){gsap.to(el,{x:0,y:0,duration:.6,ease:"elastic.out(1,.5)"})});
    });
  }
  var cmp=$("#cmp"),cr=$("#cmpr"); if(cmp&&cr){cr.addEventListener("input",function(){cmp.style.setProperty("--x",cr.value+"%")})}
  var v=$("#frcv"); if(v&&"IntersectionObserver" in window){
    new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!reduce){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{threshold:.35}).observe(v);
  }
})();

/* ---------- journey strip (landing) ---------- */
(function(){
  var strip=$("#strip"); if(!strip) return;
  if(hasGsap&&!reduce){
    ScrollTrigger.create({trigger:strip,start:"top 82%",end:"bottom 58%",scrub:.6,onUpdate:function(s){strip.style.setProperty("--p",s.progress.toFixed(3))}});
    gsap.from($$(".stop",strip),{y:44,opacity:0,stagger:.12,duration:.9,ease:"power3.out",clearProps:"transform,opacity",scrollTrigger:{trigger:strip,start:"top 85%",once:true}});
  } else strip.style.setProperty("--p",1);
})();

/* ---------- project cards (projects page) ---------- */
(function(){
  var cards=$$(".pcard"); if(!cards.length) return;
  cards.forEach(function(c){
    var w=c.getAttribute("data-world");
    if(w&&hasGsap) c.addEventListener("mouseenter",function(){setWorld(w)});
    if(hasGsap&&!reduce) gsap.from(c,{y:70,opacity:0,duration:1,ease:"power3.out",clearProps:"transform,opacity",scrollTrigger:{trigger:c,start:"top 90%",once:true}});
  });
})();

/* ---------- page transitions ---------- */
(function(){
  var wipe=$("#wipe"),go=null;
  function open(){
    root.classList.remove("pre");
    if(hasGsap&&!reduce&&wipe){
      gsap.set(wipe,{scaleY:1,transformOrigin:"50% 0%"});
      gsap.to(wipe,{scaleY:0,duration:.85,ease:"power4.inOut",delay:.05});
    } else if(wipe){wipe.style.transform="scaleY(0)"}
  }
  open();
  setTimeout(function(){root.classList.remove("pre")},2500);
  addEventListener("pageshow",function(e){if(e.persisted){if(wipe&&hasGsap) gsap.set(wipe,{scaleY:0});go=null;toTop(true)}});
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("a[href]"); if(!a||e.defaultPrevented) return;
    var h=a.getAttribute("href");
    if(!h||h.charAt(0)==="#"||/^(https?:|mailto:|tel:)/i.test(h)||a.target==="_blank"||e.metaKey||e.ctrlKey||e.shiftKey||e.button) return;
    if(go) {e.preventDefault();return}
    if(!hasGsap||reduce||!wipe) return;
    e.preventDefault(); go=h;
    gsap.set(wipe,{transformOrigin:"50% 100%"});
    gsap.to(wipe,{scaleY:1,duration:.6,ease:"power4.inOut",onComplete:function(){location.href=h}});
  });
  /* arriving with #hash (e.g. index.html#contact) */
  addEventListener("load",function(){
    var id=location.hash&&location.hash.slice(1),t=id&&document.getElementById(id);
    if(t) setTimeout(function(){ if(lenis) lenis.scrollTo(t,{immediate:true}); else t.scrollIntoView(); },60);
  });
})();

/* ---------- start at the top ---------- */
/* fonts/images can shift layout after first paint, so reset again once they settle,
   unless the visitor has already started scrolling */
var touched=false;
["wheel","touchstart","keydown","pointerdown"].forEach(function(n){addEventListener(n,function(){touched=true},{passive:true,once:true})});
function toTop(force){
  if(location.hash||(touched&&!force)) return;
  window.scrollTo(0,0);
  if(lenis) lenis.scrollTo(0,{immediate:true,force:true});
  if(hasGsap&&ScrollTrigger.clearScrollMemory) ScrollTrigger.clearScrollMemory("manual");
}
function settle(){toTop(false);if(hasGsap) ScrollTrigger.refresh();toTop(false)}
toTop(true);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(settle);
addEventListener("load",settle);
})();
