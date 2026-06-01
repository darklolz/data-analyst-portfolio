const loader = document.getElementById("loader");
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const canvas = document.getElementById("dataCanvas");
const ctx = canvas.getContext("2d");

let points = [];

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 450);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
  updateActiveLink();
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");

    if (entry.target.classList.contains("skill-card")) {
      const percent = entry.target.dataset.percent;
      entry.target.querySelector(".progress span").style.width = `${percent}%`;
    }

    if (entry.target.classList.contains("hero-copy")) {
      animateCounters();
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thanks. Your message is ready to connect to EmailJS, Formspree, or a backend.";
  contactForm.reset();
});

function animateCounters() {
  document.querySelectorAll(".counter").forEach((counter) => {
    if (counter.dataset.done) return;
    counter.dataset.done = "true";

    const target = Number(counter.dataset.target);
    const suffix = target === 95 ? "%" : "+";
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = `${current}${suffix}`;
    }, 22);
  });
}

function updateActiveLink() {
  const sections = document.querySelectorAll("main section[id]");
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;

    const isActive = scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight;
    link.classList.toggle("active", isActive);
  });
}

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  const total = window.innerWidth < 700 ? 34 : 64;
  points = Array.from({ length: total }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * canvas.offsetHeight,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    value: Math.random()
  }));
}

function drawDataBackground() {
  ctx.clearRect(0, 0, window.innerWidth, canvas.offsetHeight);

  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > canvas.offsetHeight) point.vy *= -1;

    ctx.beginPath();
    ctx.arc(point.x, point.y, 2 + point.value * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 211, 238, ${0.2 + point.value * 0.45})`;
    ctx.fill();

    for (let next = index + 1; next < points.length; next += 1) {
      const other = points[next];
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 145) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - distance / 145)})`;
        ctx.stroke();
      }
    }
  });

  drawMiniBars();
  requestAnimationFrame(drawDataBackground);
}

function drawMiniBars() {
  const width = 36;
  const gap = 14;
  const startX = window.innerWidth - 320;
  const baseY = canvas.offsetHeight - 90;

  if (window.innerWidth < 760) return;

  for (let i = 0; i < 7; i += 1) {
    const wave = Math.sin(Date.now() / 700 + i) * 22;
    const height = 55 + i * 9 + wave;
    ctx.fillStyle = "rgba(139, 92, 246, 0.18)";
    ctx.fillRect(startX + i * (width + gap), baseY - height, width, height);
    ctx.fillStyle = "rgba(34, 211, 238, 0.26)";
    ctx.fillRect(startX + i * (width + gap), baseY - height, width, 4);
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawDataBackground();
updateActiveLink();
