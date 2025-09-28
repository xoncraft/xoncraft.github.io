document.addEventListener("DOMContentLoaded", () => {
  // === Меню ===
  const menuBtnMobile = document.getElementById("menuBtnMobile");
  const menuBtnPc = document.getElementById("menuBtnPc");
  const sideMenu = document.getElementById("sideMenu");
  const sideBackdrop = document.getElementById("sideBackdrop");

  // === Оверлей магазина ===
  const shopOverlay = document.getElementById("shopOverlay");
  const shopBtnMobile = document.getElementById("shopBtn");
  const shopBtnDesktop = document.getElementById("shopBtnPc");

  const becomeSpecialistBtn = document.getElementById("becomeSpecialistBtn");

  // ==== Иконки ====
  function getMenuIcon(btn) { return btn?.querySelector("span"); }
  function getShopIcon(btn) { return btn?.querySelector("span"); }

  // ==== Утилиты ====
  function closeMenus() {
    sideMenu?.classList.remove("open");
    sideBackdrop?.classList.remove("active");

    if (getMenuIcon(menuBtnMobile)) getMenuIcon(menuBtnMobile).textContent = "mail";
    if (getMenuIcon(menuBtnPc)) getMenuIcon(menuBtnPc).textContent = "mail";

    shopOverlay?.classList.remove("active");
    if (getShopIcon(shopBtnMobile)) getShopIcon(shopBtnMobile).textContent = "share";
    if (getShopIcon(shopBtnDesktop)) getShopIcon(shopBtnDesktop).textContent = "share";
  }

  function toggleMenu(btn) {
    const isOpen = sideMenu?.classList.toggle("open");
    sideBackdrop?.classList.toggle("active", isOpen);

    if (getMenuIcon(menuBtnMobile)) getMenuIcon(menuBtnMobile).textContent = isOpen ? "close" : "mail";
    if (getMenuIcon(menuBtnPc)) getMenuIcon(menuBtnPc).textContent = isOpen ? "close" : "mail";

    shopOverlay?.classList.remove("active");
    if (getShopIcon(shopBtnMobile)) getShopIcon(shopBtnMobile).textContent = "share";
    if (getShopIcon(shopBtnDesktop)) getShopIcon(shopBtnDesktop).textContent = "share";
  }

  function toggleShopOverlay() {
    const isActive = shopOverlay?.classList.contains("active");
    closeMenus();
    if (!isActive) {
      shopOverlay?.classList.add("active");
      if (getShopIcon(shopBtnMobile)) getShopIcon(shopBtnMobile).textContent = "close";
      if (getShopIcon(shopBtnDesktop)) getShopIcon(shopBtnDesktop).textContent = "close";
    }
  }

  // ==== События ====
  menuBtnMobile?.addEventListener("click", () => toggleMenu(menuBtnMobile));
  menuBtnPc?.addEventListener("click", () => toggleMenu(menuBtnPc));
  sideBackdrop?.addEventListener("click", closeMenus);

  shopBtnMobile?.addEventListener("click", toggleShopOverlay);
  shopBtnDesktop?.addEventListener("click", toggleShopOverlay);
  becomeSpecialistBtn?.addEventListener("click", () => toggleMenu(menuBtnMobile));

  // ==== Плавная прокрутка ====
  const anchorLinks = document.querySelectorAll("nav a[href^='#'], .footer a[href^='#'], .scroll-btn");
  anchorLinks.forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href")?.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ==== Подсветка секции ====
  const sections = document.querySelectorAll("section[id]");
  const allNavLinks = document.querySelectorAll("nav a[href^='#'], .footer a[href^='#']");
  let scrollTimeout;

  function updateActiveLinks() {
    const scrollY = window.scrollY + 160;
    let currentId = "";
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) currentId = section.id;
    });
    allNavLinks.forEach(link => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("active", href === currentId);
    });
  }

  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLinks, 100);
  });
  window.addEventListener("load", updateActiveLinks);

  // ==== Skills GSAP ====
const skillBars = document.querySelectorAll(".progress");

if (skillBars.length > 0 && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  skillBars.forEach(bar => {
    const value = bar.dataset.value || 0;
    gsap.to(bar, {
      width: value + "%",
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: bar,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
}
  
  // ==== GSAP animations ====
  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined" && gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Анимация текста Hero
    const heroLetters = document.querySelectorAll(".hero_text_title li span");
    const heroTaglines = document.querySelectorAll(".hero_text_tagline span");

    if (heroLetters.length > 0 || heroTaglines.length > 0) {
      const tl = gsap.timeline();
      if (heroLetters.length > 0) {
        gsap.set(heroLetters, { y: 60, opacity: 0 });
        tl.to(heroLetters, {
          duration: 1.2,
          y: 0,
          opacity: 1,
          ease: "power4.out",
          stagger: 0.08
        });
      }
      if (heroTaglines.length > 0) {
        gsap.set(heroTaglines, { y: 40, opacity: 0 });
        tl.to(heroTaglines, {
          duration: 1.0,
          y: 0,
          opacity: 1,
          ease: "power4.out",
          stagger: 0.12
        }, "-=0.6");
      }
    }

    // Универсальная анимация появления секций
    document.querySelectorAll("section, .download-item, .shop-product-card, .contact-link, .become-specialist-btn").forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });

  } else {
    console.warn("GSAP не найден. Подключи https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
  }

  // ==== Escape закрывает меню/оверлей ====
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenus();
  });
});