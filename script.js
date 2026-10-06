const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const progress = $("#progress");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
});

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
$$(".nav-links a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") document.body.classList.add("light");
themeToggle.textContent = document.body.classList.contains("light") ? "☀" : "☾";
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  localStorage.setItem("portfolio-theme", light ? "light" : "dark");
  themeToggle.textContent = light ? "☀" : "☾";
});

const sections = $$("main section[id]");
const navItems = $$(".nav-links a");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-30% 0px -60% 0px" });
sections.forEach(section => observer.observe(section));

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
$$(".reveal").forEach(el => revealObserver.observe(el));

$("#year").textContent = new Date().getFullYear();

const toast = $("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

$$("[data-project]").forEach(link => {
  link.addEventListener("click", () => {
    const message = $("#message");
    if (message) message.value = `I'm interested in discussing ${link.dataset.project}.`;
    showToast(`Selected: ${link.dataset.project}`);
  });
});

$("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();
  const status = $("#formStatus");

  if (!name || !email || !message) {
    status.textContent = "Please complete all fields.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = "Please enter a valid email address.";
    return;
  }
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:abhinavchaurasiya832@gmail.com?subject=${subject}&body=${body}`;
  status.textContent = "Opening your email app…";
  showToast("Opening email composer…");
});