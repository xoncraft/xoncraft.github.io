gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===============================
// МЕНЮ
// ===============================
const leftBtn = document.querySelector(".burger.left");
const rightBtn = document.querySelector(".burger.right");
const leftMenu = document.querySelector(".left-menu");
const rightMenu = document.querySelector(".right-menu");
const menus = document.querySelectorAll(".menu");

function closeMenus() {
  menus.forEach(menu => menu.classList.remove("active"));
}

function toggleMenu(menu) {
  if (menu.classList.contains("active")) {
    closeMenus();
  } else {
    closeMenus();
    menu.classList.add("active");
  }
}

leftBtn?.addEventListener("click", e => {
  e.stopPropagation();
  toggleMenu(leftMenu);
});

rightBtn?.addEventListener("click", e => {
  e.stopPropagation();
  toggleMenu(rightMenu);
});

document.addEventListener("click", e => {
  if (!e.target.closest(".menu") && !e.target.closest(".burger")) {
    closeMenus();
  }
});

// ===============================
// СКРОЛЛ ПО ЯКОРЯМ
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      gsap.to(window, {
        scrollTo: target.offsetTop - 60,
        duration: 1.2,
        ease: "power3.inOut"
      });
      closeMenus();
    }
  });
});

// ===============================
// ОТПРАВКА TELEGRAM
// ===============================
const telegramForm = document.getElementById("telegramForm");
if (telegramForm) {
  telegramForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const token = "YOUR_BOT_TOKEN";
    const chat_id = "YOUR_CHAT_ID";

    const text =
      `Имя: ${this.name.value}\n` +
      `Telegram: ${this.telegram.value}\n` +
      `Сообщение: ${this.message.value}`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text })
      });
      alert("Отправлено");
      this.reset();
      closeMenus();
    } catch {
      alert("Ошибка");
    }
  });
}

// ===============================
// ПРЕЛОАДЕР + ТАЙПИНГ
// ===============================
window.addEventListener("load", () => {
  const tl = gsap.timeline();
  tl.to(".preloader-text span", {
      y: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: "power4.out"
    })
    .to(".preloader-line", {
      scaleX: 1,
      duration: 1.8,
      ease: "power2.inOut"
    }, "-=0.5")
    .to(".preloader", {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut"
    })
    .call(() => {
      const titleElement = document.getElementById("typing-title");
      if (titleElement) startBidirectionalTyping(titleElement);
    });
});

// ===============================
// АНИМАЦИИ СЕКЦИЙ
// ===============================
gsap.from("header", {
  y: -100,
  opacity: 0,
  duration: 1.2,
  ease: "power4.out",
  delay: 2
});

gsap.utils.toArray(".section, .hero, .friends-wrap, .career-container, .hobby-container, .find-me-container").forEach(sec => {
  gsap.from(sec, {
    opacity: 0,
    y: 100,
    duration: 2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: sec,
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    }
  });
});

// ===============================
// HOVER НА ССЫЛКИ
// ===============================
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("mouseenter", () =>
    gsap.to(link, { y: -3, duration: 0.3 })
  );
  link.addEventListener("mouseleave", () =>
    gsap.to(link, { y: 0, duration: 0.3 })
  );
});

// Stagger-анимация букв
function splitText(el) {
  const text = el.textContent;
  el.textContent = '';
  const chars = text.split('');
  chars.forEach(ch => {
    const span = document.createElement('span');
    span.textContent = ch;
    el.appendChild(span);
  });
  return el.querySelectorAll('span');
}

// Тайпинг премиум
const typingVariants = ["Волшебник", "Мне 25 лет", "Из Андижана"];
function startPremiumTyping(element, speed=80, pause=1500) {
  let current = 0;
  function typeNext() {
    bidirectionalType(element, typingVariants[current], speed, pause, () => {
      current = (current + 1) % typingVariants.length;
      typeNext();
    });
  }
  typeNext();
}

// Bidirectional typing
function bidirectionalType(element, text, speed, pause, callback) {
  element.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.marginLeft = '2px';
  cursor.style.animation = 'blink 1s infinite';
  element.appendChild(cursor);
  
  let i = 0;
  function typeLetter() {
    if(i < text.length){
      element.innerHTML = text.slice(0,i+1);
      element.appendChild(cursor);
      i++;
      setTimeout(typeLetter, speed + Math.random()*80);
    } else setTimeout(eraseLetter, pause);
  }
  function eraseLetter() {
    if(i > 0){
      element.innerHTML = text.slice(0,i-1);
      element.appendChild(cursor);
      i--;
      setTimeout(eraseLetter, speed + Math.random()*80);
    } else setTimeout(callback, pause/2);
  }
  typeLetter();
}

// Курсор мигание
const style = document.createElement('style');
style.innerHTML = `
@keyframes blink {0%,50%,100%{opacity:1;}25%,75%{opacity:0;}}
`;
document.head.appendChild(style);

// GSAP Intro анимация
const titleSpans = splitText(document.querySelector('.hero-title'));
gsap.from(titleSpans, {
  y: 80,
  opacity: 0,
  stagger: 0.05,
  duration: 1.5,
  ease: "power4.out"
});
gsap.from(".hero-subtitle", {y:40, opacity:0, duration:1, delay:0.2, ease:"power3.out"});
gsap.from(".hero-description", {y:30, opacity:0, duration:1, delay:0.4, ease:"power3.out"});
gsap.from(".hero-buttons a", {y:30, opacity:0, duration:1, delay:0.6, stagger:0.2, ease:"power3.out"});

// Магнитные кнопки
document.querySelectorAll('.btn-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    gsap.to(btn, {x:x*0.2, y:y*0.2, duration:0.3, ease:"power3.out"});
  });
  btn.addEventListener('mouseleave', () => gsap.to(btn,{x:0,y:0,duration:0.5,ease:"power3.out"}));
});

// Параллакс orb по мыши
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  gsap.to('.orb-1',{x:x,y:y,duration:1,ease:"power3.out"});
  gsap.to('.orb-2',{x:-x*0.6,y:-y*0.6,duration:1,ease:"power3.out"});
  gsap.to('.orb-3',{x:x*0.4,y:-y*0.4,duration:1,ease:"power3.out"});
});

// Запуск премиум тайпинга
startPremiumTyping(document.getElementById('premium-typing'));
// ===============================
// СЛАЙДЕР КАРЬЕРЫ
// ===============================
const track = document.querySelector(".career-track");
const slides = document.querySelectorAll(".career-slide");
const links = document.querySelectorAll(".career-link");

if (track && slides.length) {
  let currentSlide = 0;
  let autoSlide;
  const total = slides.length;

  function updateSlider(index) {
    currentSlide = index;
    gsap.to(track, {
      xPercent: -100 * index,
      duration: 0.45,
      ease: "power2.inOut"
    });
    links.forEach(l => l.classList.remove("active"));
    if (links[index]) links[index].classList.add("active");
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlide = setInterval(() => {
      currentSlide = (currentSlide + 1) % total;
      updateSlider(currentSlide);
    }, 4000);
  }

  function stopAutoSlide() {
    if (autoSlide) clearInterval(autoSlide);
  }

  links.forEach(link => {
    link.addEventListener("click", () => {
      const index = parseInt(link.dataset.index);
      stopAutoSlide();
      updateSlider(index);
      startAutoSlide();
    });
  });

  // Свайп
  let startX = 0;
  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    stopAutoSlide();
  });
  track.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 50) currentSlide = (currentSlide + 1) % total;
    else if (diff < -50) currentSlide = (currentSlide - 1 + total) % total;
    updateSlider(currentSlide);
    startAutoSlide();
  });

  updateSlider(0);
  startAutoSlide();
}

// ===============================
// Проекты
// ===============================
gsap.utils.toArray(".project").forEach(card => {
  gsap.from(card, {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play none none reset"
    }
  });
});

document.querySelectorAll(".project").forEach(card => {

  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * 15;
    const rotateY = (x / rect.width - 0.5) * -15;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  });

});

// ===============================
// ХОББИ-ПРОГРЕСС
// ===============================
const hobbyRadios = document.querySelectorAll('.radio');
const progressBar = document.querySelector('.progress-bar');
const hobbyProgress = { gaming: 90, music: 70, travel: 50, coding: 85 };

hobbyRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    progressBar.style.width = hobbyProgress[radio.value] + '%';
  });
});

window.addEventListener('load', () => {
  const checked = document.querySelector('.radio:checked');
  progressBar.style.width = hobbyProgress[checked.value] + '%';
});

// ===============================
// АНІМАЦИЯ FIND-ME
// ===============================
gsap.utils.toArray(".find-card").forEach(card => {
  gsap.from(card, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: card, start: "top 85%" }
  });
});
