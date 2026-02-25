// =======================================
// FRIENDS DATA
// =======================================

const friendsData = [
  {
    name: "Gendry",
    alias: "Bastard of King Robert Baratheon",
    image: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106403/fearless-seven-gendry.jpg",
    bio: "Robert Baratheon's bastard son who later becomes a skilled blacksmith."
  },
  {
    name: "Thoros",
    alias: "of Myr",
    image: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106403/fearless-seven-thoros.jpg",
    bio: "A red priest of R'hllor from the Free City of Myr."
  },
  {
    name: "Beric Dondarrion",
    alias: "The Lightning Lord",
    image: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106403/fearless-seven-dondarrion.jpg",
    bio: "Lord of Blackhaven and leader of the Brotherhood Without Banners."
  }
];


// =======================================
// ЭЛЕМЕНТЫ
// =======================================

const grid = document.getElementById("friendsGrid");
const modal = document.getElementById("friendModal");
const modalContent = document.getElementById("friendModalContent");

const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalAlias = document.getElementById("modalAlias");
const modalBio = document.getElementById("modalBio");
const modalClose = document.getElementById("friendClose");


// =======================================
// РЕНДЕР КАРТОЧЕК
// =======================================

if (grid) {

  friendsData.forEach((friend, index) => {

    const card = document.createElement("div");
    card.className = "friend-card";

    card.innerHTML = `
      <img src="${friend.image}" alt="${friend.name}" loading="lazy">
      <h3>${friend.name}</h3>
    `;

    card.addEventListener("click", () => openModal(friend));

    grid.appendChild(card);

    // Анимация появления
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power3.out"
    });

  });

}


// =======================================
// МОДАЛКА
// =======================================

function openModal(friend) {

  if (!modal) return;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  modalImg.src = friend.image;
  modalName.textContent = friend.name;
  modalAlias.textContent = friend.alias;
  modalBio.textContent = friend.bio;

  gsap.fromTo(modalContent,
    { scale: 0.9, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power4.out"
    }
  );
}

function closeModal() {

  gsap.to(modalContent, {
    scale: 0.9,
    opacity: 0,
    duration: 0.4,
    ease: "power4.in",
    onComplete: () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

}


// =======================================
// СОБЫТИЯ
// =======================================

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal?.classList.contains("active")) {
    closeModal();
  }
});