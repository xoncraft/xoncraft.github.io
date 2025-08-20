let specialists = [];
let currentSlide = 0;
let cardsPerSlide = window.innerWidth < 768 ? 1 : 3;

function loadSpecialists() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "special.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      specialists = JSON.parse(xhr.responseText);
      renderSlider();
    }
  };
  xhr.send();
}

function renderSlider() {
  const slider = document.getElementById("specialistsSlider");
  slider.innerHTML = "";

  specialists.forEach(s => {
    const card = document.createElement("div");
    card.classList.add("specialist-card");
    card.innerHTML = `
      <img src="${s.photo}" alt="${s.name}">
      <h3>${s.name}</h3>
      <div class="specialist-info">${s.city}</div>
      <p class="specialist-desc">"${s.description}"</p>
      <div class="contact-icons">
        <a href="${s.telegram}" target="_blank" title="Связаться в Telegram">
          <span class="material-icons-round">send</span>
        </a>
      </div>
    `;
    slider.appendChild(card);
  });

  updateSlider();
}

function updateSlider() {
  const slider = document.getElementById("specialistsSlider");
  slider.style.transform = `translateX(-${currentSlide * (100 / cardsPerSlide)}%)`;
}

document.querySelector(".next-btn").addEventListener("click", () => {
  if (currentSlide < specialists.length - cardsPerSlide) {
    currentSlide++;
    updateSlider();
  }
});

document.querySelector(".prev-btn").addEventListener("click", () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlider();
  }
});

loadSpecialists();
