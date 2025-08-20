document.addEventListener("DOMContentLoaded", () => {
  // ===== Боковое меню (форма обратной связи) =====
  const menuBtn = document.getElementById("menuBtn"); // mail в header (моб.)
  const sideMenu = document.getElementById("sideMenu");
  const sideBackdrop = document.getElementById("sideBackdrop");
  const menuIcon = menuBtn?.querySelector("span");

  // ===== Оверлей игры Х и 0 =====
  const shopOverlay = document.getElementById("shopOverlay");
  const shopBtn = document.getElementById("shopBtn");     // gamepad в header (моб.)
  const shopBtnPc = document.getElementById("shopBtnPc"); // mail (ПК справа)
  const shopIcon = shopBtn?.querySelector("span") || shopBtnPc?.querySelector("span");

  function closeMenus() {
    sideMenu?.classList.remove("open");
    sideBackdrop?.classList.remove("active");
    if (menuIcon) menuIcon.textContent = "mail";

    shopOverlay?.classList.remove("active");
    if (shopIcon) shopIcon.textContent = "gamepad";
  }

  // Открытие формы обратной связи (моб.)
  menuBtn?.addEventListener("click", () => {
    const isOpen = sideMenu?.classList.toggle("open");
    sideBackdrop?.classList.toggle("active", isOpen);
    shopOverlay?.classList.remove("active");
    if (menuIcon) menuIcon.textContent = isOpen ? "close" : "mail";
    if (shopIcon) shopIcon.textContent = "gamepad";
  });

  // Открытие формы обратной связи (ПК иконка mail)
  shopBtnPc?.addEventListener("click", () => {
    const isOpen = sideMenu?.classList.toggle("open");
    sideBackdrop?.classList.toggle("active", isOpen);
    shopOverlay?.classList.remove("active");
    if (menuIcon) menuIcon.textContent = "mail";
    if (shopIcon) shopIcon.textContent = isOpen ? "close" : "mail";
  });

  // Закрытие кликом по фону
  sideBackdrop?.addEventListener("click", closeMenus);

  // ===== Открытие/закрытие игры Х и 0 =====
  function toggleShopOverlay() {
    const isActive = shopOverlay?.classList.contains("active");
    closeMenus();
    if (!isActive) {
      shopOverlay?.classList.add("active");
      if (shopIcon) shopIcon.textContent = "close";
    } else {
      shopOverlay?.classList.remove("active");
      if (shopIcon) shopIcon.textContent = "gamepad";
    }
  }

  shopBtn?.addEventListener("click", toggleShopOverlay);

  // ===== Typing-эффект =====
(function initTyping() {
  const typingEl = document.querySelector(".typing-text");
  if (!typingEl) return;

  const texts = ["Frontend-разработчик", "Веб-дизайнер", "Фрилансер"];
  let wordIndex = 0, charIndex = 0, isDeleting = false;
  const typeSpeed = 120, deleteSpeed = 60, pauseAfterWord = 1200;

  function tick() {
    const current = texts[wordIndex];
    if (!isDeleting) {
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, pauseAfterWord);
        return;
      }
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % texts.length;
      }
    }
    setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
  }
  tick();
})();

  // ===== Плавный скролл =====
  const anchorLinks = document.querySelectorAll("nav a[href^='#'], .footer a[href^='#'], .scroll-btn");
  anchorLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href")?.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const allNavLinks = document.querySelectorAll("nav a[href^='#'], .footer a[href^='#']");

  function updateActiveLinks() {
    const scrollY = window.scrollY + 160;
    let currentId = "";
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentId = section.getAttribute("id");
      }
    });
    allNavLinks.forEach(link => {
      const href = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("active", href === currentId);
    });
  }

  window.addEventListener("scroll", updateActiveLinks);
  window.addEventListener("load", updateActiveLinks);

  // ==== Аккордеон ====
  const accordions = document.querySelectorAll(".accordion-header");
  accordions.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;

      document.querySelectorAll(".accordion-item").forEach(i => {
        if (i !== item) {
          i.classList.remove("active");
          i.querySelector(".accordion-content").style.maxHeight = null;
        }
      });

      item.classList.toggle("active");
      if (item.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });

// ===== Игра X и O =====
const cells = document.querySelectorAll("[data-cell]");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let running = true;
let currentPlayer = "x";
const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function startGame() {
  cells.forEach(cell => {
    cell.classList.remove("x", "o", "win");
    cell.textContent = "";
    cell.addEventListener("click", playerMove); // убрал { once: true }
  });
  if (statusText) statusText.textContent = "Твой ход: X";
  running = true;
  currentPlayer = "x";
}

function playerMove(e) {
  if (!running) return;
  const cell = e.target;

  // Проверка: если ячейка уже занята — выходим
  if (cell.classList.contains("x") || cell.classList.contains("o")) return;

  cell.classList.add("x");
  cell.textContent = "X";

  if (checkWin("x")) {
    endGame("Ты выиграл!");
    highlightWin("x");
    return;
  }
  if (isDraw()) {
    endGame("Ничья");
    return;
  }

  if (statusText) statusText.textContent = "Хожу я...";
  setTimeout(robotMove, 600);
}

function robotMove() {
  const emptyCells = [...cells].filter(c => !c.classList.contains("x") && !c.classList.contains("o"));
  if (emptyCells.length === 0 || !running) return;

  let move = findBestMove("o");
  if (!move) move = findBestMove("x");
  if (!move && !cells[4].classList.contains("x") && !cells[4].classList.contains("o")) {
    move = cells[4];
  }
  if (!move) {
    const corners = [cells[0], cells[2], cells[6], cells[8]].filter(c => !c.classList.contains("x") && !c.classList.contains("o"));
    if (corners.length > 0) move = corners[Math.floor(Math.random() * corners.length)];
  }
  if (!move) {
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  move.classList.add("o");
  move.textContent = "O";

  if (checkWin("o")) {
    endGame("Я победил");
    highlightWin("o");
    return;
  }
  if (isDraw()) {
    endGame("Ничья");
    return;
  }

  if (statusText) statusText.textContent = "Твой ход: X";
}

function findBestMove(player) {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    const values = [cells[a], cells[b], cells[c]];

    const playerCount = values.filter(cell => cell.classList.contains(player)).length;
    const empty = values.find(cell => !cell.classList.contains("x") && !cell.classList.contains("o"));

    if (playerCount === 2 && empty) {
      return empty;
    }
  }
  return null;
}

function checkWin(player) {
  return winConditions.some(condition =>
    condition.every(index => cells[index].classList.contains(player))
  );
}

function highlightWin(player) {
  winConditions.forEach(condition => {
    if (condition.every(index => cells[index].classList.contains(player))) {
      condition.forEach(index => cells[index].classList.add("win"));
    }
  });
}

function isDraw() {
  return [...cells].every(cell => cell.classList.contains("x") || cell.classList.contains("o"));
}

function endGame(message) {
  if (statusText) statusText.textContent = message;
  running = false;
}

restartBtn?.addEventListener("click", startGame);

if (cells.length > 0) startGame();
  });
