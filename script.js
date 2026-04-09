// ============================================
// FUNCIONALIDAD DE TEMA OSCURO/CLARO
// ============================================

const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const themeIcon = document.querySelector(".theme-icon");

// Recuperar tema guardado del localStorage
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  body.classList.add("dark-theme");
  themeIcon.textContent = "☀️";
}

// Cambiar tema al hacer clic
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-theme");

  if (body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
    themeIcon.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeIcon.textContent = "🌙";
  }
});

// ============================================
// MENÚ HAMBURGUESA RESPONSIVO
// ============================================

const burgerMenu = document.getElementById("burgerMenu");
const navMenu = document.getElementById("navMenu");
const dropdowns = document.querySelectorAll(".dropdown");

// Toggle del menú hamburguesa
burgerMenu.addEventListener("click", () => {
  burgerMenu.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Cerrar menú cuando se hace clic en un enlace
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    burgerMenu.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// ============================================
// MENÚ DESPLEGABLE EN MÓVIL
// ============================================

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".dropdown-toggle");
  const menu = dropdown.querySelector(".dropdown-menu");

  toggle.addEventListener("click", (e) => {
    // Solo en pantallas pequeñas
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdown.classList.toggle("active");
    }
  });
});

// Cerrar menú desplegable al hacer clic en un item
const dropdownLinks = document.querySelectorAll(".dropdown-menu a");
dropdownLinks.forEach((link) => {
  link.addEventListener("click", () => {
    dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    burgerMenu.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// ============================================
// CERRAR MENÚS AL HACER CLIC FUERA
// ============================================

document.addEventListener("click", (e) => {
  // No cerrar si el clic es dentro de la navbar
  const navbar = document.querySelector(".navbar");
  if (!navbar.contains(e.target)) {
    // Cerrar menú hamburguesa en móviles
    if (window.innerWidth <= 768) {
      burgerMenu.classList.remove("active");
      navMenu.classList.remove("active");
    }
    // Cerrar dropdowns
    dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
  }
});

// ============================================
// ANIMACIÓN AL DESPLAZARSE
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observar elementos de saga
const sagaSections = document.querySelectorAll(".saga-content");
sagaSections.forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(20px)";
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(section);
});

// ============================================
// MANEJO DE REDIMENSIONAMIENTO
// ============================================

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Si la pantalla es mayor a 768px, mostrar menú normal
    if (window.innerWidth > 768) {
      burgerMenu.classList.remove("active");
      navMenu.classList.remove("active");
      dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    }
  }, 250);
});

// ============================================
// FUNCIONALIDAD ADICIONAL
// ============================================

// Activar estados de enlace activo basado en scroll
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

function updateActiveNavLink() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.style.color = "";
    if (item.getAttribute("href") === "#" + current) {
      item.style.color = "var(--accent-color)";
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);

// ============================================
// SMOOTH SCROLL PARA NAVEGADORES ANTIGUOS
// ============================================

// Ya incluido en CSS (scroll-behavior: smooth), pero aquí hay fallback
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ============================================
// PRECARGAR TEMA AL INICIAR
// ============================================

// Función para sincronizar tema entre pestañas
window.addEventListener("storage", (e) => {
  if (e.key === "theme") {
    if (e.newValue === "dark") {
      body.classList.add("dark-theme");
      themeIcon.textContent = "☀️";
    } else {
      body.classList.remove("dark-theme");
      themeIcon.textContent = "🌙";
    }
  }
});

// ============================================
// FUNCIONALIDAD DE CARRUSEL
// ============================================

// Estructura para guardar el índice actual de cada carrusel
const carouselStates = new Map();

function initializeCarousels() {
  const carousels = document.querySelectorAll(".carousel-container");
  carousels.forEach((container, index) => {
    carouselStates.set(index, 0);
  });
}

function getCarouselIndex(button) {
  const container = button.closest(".carousel-container");
  const carousels = document.querySelectorAll(".carousel-container");
  for (let i = 0; i < carousels.length; i++) {
    if (carousels[i] === container) {
      return i;
    }
  }
  return 0;
}

function showSlide(container, index) {
  const images = container.querySelectorAll(".carousel-image");
  const dots = container.querySelectorAll(".dot");

  // Validar índice
  if (index >= images.length) {
    index = 0;
  } else if (index < 0) {
    index = images.length - 1;
  }

  // Actualizar índice en el map
  const carouselIndex = getCarouselIndex(container.querySelector(".carousel-btn"));
  carouselStates.set(carouselIndex, index);

  // Ocultar todas las imágenes y desactivar puntos
  images.forEach((img) => img.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  // Mostrar imagen actual y activar punto
  if (images[index]) {
    images[index].classList.add("active");
  }
  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

window.changeSlide = function (button, direction) {
  const container = button.closest(".carousel-container");
  const images = container.querySelectorAll(".carousel-image");
  const carouselIndex = getCarouselIndex(button);
  const currentIndex = carouselStates.get(carouselIndex) || 0;
  const newIndex = currentIndex + direction;

  showSlide(container, newIndex);
};

window.currentSlide = function (dot, index) {
  const container = dot.closest(".carousel-container");
  showSlide(container, index);
};

// Inicializar carruseles cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  initializeCarousels();

  // Mostrar la primera imagen de cada carrusel
  const carousels = document.querySelectorAll(".carousel-container");
  carousels.forEach((carousel) => {
    showSlide(carousel, 0);
  });
});

// Alternativa si el documento ya está cargado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeCarousels();
    const carousels = document.querySelectorAll(".carousel-container");
    carousels.forEach((carousel) => {
      showSlide(carousel, 0);
    });
  });
} else {
  initializeCarousels();
  const carousels = document.querySelectorAll(".carousel-container");
  carousels.forEach((carousel) => {
    showSlide(carousel, 0);
  });
}

console.log("Script cargado correctamente");
