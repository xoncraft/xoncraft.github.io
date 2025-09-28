let productsData = [];
let filteredData = [];
let currentCategory = "all";
let resizeTimeout;

function getProductsPerPage() {
  if (window.innerWidth < 768) return 8;
  if (window.innerWidth < 1200) return 15;
  return 20;
}

// Загрузка данных
function loadProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "files.json?v=" + Date.now(), true); // добавили версию
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        productsData = JSON.parse(xhr.responseText);
        filteredData = [...productsData];
        renderProducts();
      } catch (err) {
        console.error("Ошибка парсинга JSON:", err);
      }
    }
  };
  xhr.send();
}

// Fullscreen overlay
const fsOverlay = document.createElement("div");
fsOverlay.className = "product-fullscreen";
fsOverlay.innerHTML = `<button class="close-btn">X</button>`;
document.body.appendChild(fsOverlay);

function openFullscreen(img, video) {
  fsOverlay.innerHTML = `<button class="close-btn">X</button>`;
  if (video && video.style.display !== "none") {
    fsOverlay.insertAdjacentHTML("beforeend", `<video src="${video.src}" autoplay controls></video>`);
  } else {
    fsOverlay.insertAdjacentHTML("beforeend", `<img src="${img.src}" alt="Fullscreen Image">`);
  }
  fsOverlay.classList.add("active");
  fsOverlay.querySelector(".close-btn").addEventListener("click", closeFullscreen);
}

function closeFullscreen() {
  fsOverlay.classList.remove("active");
  fsOverlay.innerHTML = `<button class="close-btn">X</button>`;
}

// Фильтр категорий
function setupFilter() {
  document.querySelectorAll(".filter-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      document.querySelectorAll(".filter-buttons button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      filteredData = currentCategory === "all"
        ? [...productsData]
        : productsData.filter(p => p.category === currentCategory);

      renderProducts();
    });
  });
}

// Рендер продуктов с учетом фильтрации
function renderProducts() {
  const container = document.getElementById("products-container");
  container.classList.add("products-grid");
  container.innerHTML = "";

  filteredData.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-media">
        <img src="${product.image}" alt="${product.title}">
        ${product.video ? `<video src="${product.video}" muted loop style="display:none;"></video>` : ""}
        <div class="media-controls">
          <button class="show-image">Фото</button>
          ${product.video ? `<button class="show-video">Видео</button>` : ""}
          <button class="fullscreen-btn"><span class="material-icons-round">fullscreen</span></button>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.title}</h3>
        <p>${product.desc}</p>
        <div class="price">${product.price}</div>
        <a href="${product.link}" target="_blank">Купить</a>
      </div>
    `;

    const img = card.querySelector("img");
    const video = card.querySelector("video");
    const fullscreenBtn = card.querySelector(".fullscreen-btn");

    if (video) {
      card.querySelector(".show-image").addEventListener("click", () => {
        video.pause();
        video.style.display = "none";
        img.style.display = "block";
      });
      card.querySelector(".show-video").addEventListener("click", () => {
        img.style.display = "none";
        video.style.display = "block";
        video.play();
      });
    }

    fullscreenBtn.addEventListener("click", () => {
      openFullscreen(img, video);
    });

    container.appendChild(card);
  });
}

// Debounce ресайза
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    renderProducts();
  }, 200);
});

// Инициализация
setupFilter();
loadProducts();
