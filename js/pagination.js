let currentPage = 1;
let productsData = [];

function getProductsPerPage() {
  return window.innerWidth < 768 ? 8 : 16;
}

function loadProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "files.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      productsData = JSON.parse(xhr.responseText);
      renderProducts();
      renderPagination();
    }
  };
  xhr.send();
}

function renderProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  const productsPerPage = getProductsPerPage();
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const pageProducts = productsData.slice(start, end);

  pageProducts.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-media">
        <img src="${product.image}" alt="${product.title}">
        <video src="${product.video}" style="display:none;" muted loop></video>
        <div class="media-controls">
          <button class="show-image">Фото</button>
          <button class="show-video">Видео</button>
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

    container.appendChild(card);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const productsPerPage = getProductsPerPage();
  const totalPages = Math.ceil(productsData.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
      renderPagination();
    });
    pagination.appendChild(btn);
  }
}

window.addEventListener("resize", () => {
  renderProducts();
  renderPagination();
});

loadProducts();
