gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  bride: "Disha",
  groom: "Sudip",
  weddingStart: "2027-01-25T10:00:00+05:30",
  weddingEnd: "2027-01-26T23:59:00+05:30",
  reception: "2027-01-31T19:00:00+05:30",
  whatsappNumber: "919999999999",
  whatsappText: "Hi Disha & Sudip! We'd love to RSVP for your wedding. Looking forward to celebrating with you!"
};

const intro = document.querySelector("#introScreen");
const page = document.querySelector("#page");
const openCard = document.querySelector("#openCard");
const music = document.querySelector("#music");
const musicBtn = document.querySelector("#musicBtn");
let opened = false;

document.body.classList.add("locked");

function openingAnimation(){
  if(opened) return;
  opened = true;

  const tl = gsap.timeline({
    onComplete(){
      intro.style.display = "none";
      page.setAttribute("aria-hidden","false");
      document.body.classList.remove("locked");
      initPage();
    }
  });

  tl.to(".intro-card .eyebrow,.intro-copy,.monogram",{y:-15,opacity:0,duration:.35,stagger:.04})
    .to(".card-seal",{scale:1.2,duration:.2})
    .to(".open-card:after",{rotateX:180,duration:.8,ease:"power2.inOut"})
    .to(".open-card",{scale:1.08,duration:.5,ease:"power2.out"},"-=.35")
    .to(intro,{clipPath:"circle(0% at 50% 50%)",duration:1.15,ease:"power3.inOut"});
}

openCard.addEventListener("click",openingAnimation);
openCard.addEventListener("keydown",e=>{
  if(e.key==="Enter" || e.key===" ") openingAnimation();
});

function initPage(){
  const heroTl = gsap.timeline();
  heroTl.from(".nav",{y:-20,opacity:0,duration:.7})
    .from(".hero-eyebrow,.invite-line",{y:25,opacity:0,stagger:.1,duration:.8,ease:"power3.out"},"-=.3")
    .from(".hero h1 span",{y:90,opacity:0,stagger:.16,duration:1.1,ease:"power4.out"},"-=.45")
    .from(".hero h1 i,.hero-divider,.hero-tagline,.hero-copy .pill-button",{y:20,opacity:0,stagger:.08,duration:.7,ease:"power3.out"},"-=.65")
    .from(".hero-art",{scale:.92,opacity:0,duration:1.5,ease:"power3.out"},"-=1")
    .from(".art-note",{y:18,opacity:0,stagger:.12,duration:.7},"-=.8");

  // Gentle parallax on the hero artwork and decorative washes.
  gsap.to(".hero-art img",{yPercent:-5,scale:1.27,ease:"none",scrollTrigger:{
    trigger:".hero",start:"top top",end:"bottom top",scrub:1
  }});
  gsap.to(".hero-floral-left",{x:35,y:55,rotation:8,ease:"none",scrollTrigger:{
    trigger:".hero",start:"top top",end:"bottom top",scrub:1
  }});
  gsap.to(".hero-floral-right",{x:-35,y:-35,rotation:-8,ease:"none",scrollTrigger:{
    trigger:".hero",start:"top top",end:"bottom top",scrub:1
  }});

  // Section reveals.
  gsap.utils.toArray(".section").forEach(section=>{
    const targets = section.querySelectorAll(".eyebrow,.center-heading,.date-card,.story-copy h2,.story-copy>p:not(.eyebrow),.event,.venue-card,.gallery-card,.rsvp-copy,.rsvp-actions");
    gsap.from(targets,{
      scrollTrigger:{trigger:section,start:"top 78%",once:true},
      y:45,opacity:0,stagger:.09,duration:.85,ease:"power3.out"
    });
  });

  // Watercolor-ish "brush reveal" feeling.
  gsap.from(".story-collage,.hero-floral,.rsvp-flower",{
    opacity:0,scale:.82,rotation:-4,duration:1.25,ease:"power3.out",
    scrollTrigger:{trigger:".story",start:"top 75%",once:true}
  });

  gsap.from(".event",{x:-35,scrollTrigger:{trigger:".event-stack",start:"top 75%",once:true},stagger:.15,duration:.8,ease:"power3.out"});
  gsap.from(".gallery-card",{scale:.88,rotation:i=>i%2?-2:2,scrollTrigger:{trigger:".gallery-grid",start:"top 80%",once:true},stagger:.08,duration:.9,ease:"back.out(1.3)"});

  startCountdown();
  setupRSVP();
  setupCalendar();
  setupMusic();
  makePetals();
}

function startCountdown(){
  const target = new Date(CONFIG.weddingStart).getTime();
  const tick = ()=>{
    let diff = Math.max(0,target-Date.now());
    const days = Math.floor(diff/86400000); diff%=86400000;
    const hours = Math.floor(diff/3600000); diff%=3600000;
    const minutes = Math.floor(diff/60000); diff%=60000;
    const seconds = Math.floor(diff/1000);

    const set=(sel,val)=>document.querySelector(sel).textContent=String(val).padStart(2,"0");
    set("[data-days]",days);set("[data-hours]",hours);set("[data-minutes]",minutes);set("[data-seconds]",seconds);
  };
  tick(); setInterval(tick,1000);
}

function setupRSVP(){
  const msg = encodeURIComponent(CONFIG.whatsappText);
  document.querySelector("#whatsappRsvp").href = `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;
}

function setupCalendar(){
  document.querySelector("#calendarBtn").addEventListener("click",()=>{
    const event = [
      "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//DishaSudipWedding//EN",
      "BEGIN:VEVENT",
      `DTSTART:20270125T103000`,
      `DTEND:20270126T233000`,
      "SUMMARY:Disha & Sudip — The Wedding",
      "LOCATION:The Greenwood Resort",
      "DESCRIPTION:Wedding celebrations for Disha & Sudip.",
      "END:VEVENT","END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([event],{type:"text/calendar;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url;a.download="Disha-Sudip-Wedding.ics";a.click();
    URL.revokeObjectURL(url);
  });
}

function setupMusic(){
  musicBtn.addEventListener("click",async()=>{
    try{
      if(music.paused){
        await music.play();
        musicBtn.innerHTML="◼ <span>Pause</span>";
      }else{
        music.pause();
        musicBtn.innerHTML="♫ <span>Music</span>";
      }
    }catch{
      alert("Add your wedding song as assets/music.mp3 first.");
    }
  });
}

// Light floating-petal moment after the invitation opens.
function makePetals(){
  const holder = document.querySelector(".petal-field");
  const chars = ["✦","·","✿","❀"];
  for(let i=0;i<18;i++){
    const p=document.createElement("span");
    p.textContent=chars[i%chars.length];
    p.className="petal";
    p.style.left=(Math.random()*100)+"%";
    p.style.top=(10+Math.random()*70)+"%";
    p.style.fontSize=(7+Math.random()*12)+"px";
    p.style.opacity=(.15+Math.random()*.35);
    holder.appendChild(p);

    gsap.to(p,{
      x:gsap.utils.random(-35,35),
      y:gsap.utils.random(-25,45),
      rotation:gsap.utils.random(-35,35),
      duration:gsap.utils.random(4,7),
      repeat:-1,yoyo:true,ease:"sine.inOut",
      delay:Math.random()*2
    });
  }
}
