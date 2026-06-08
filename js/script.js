// Safe Garden Home Daycare scripts

document.documentElement.classList.add("motion-ready");

const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const siteHeader = document.getElementById("siteHeader");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

window.addEventListener("scroll", () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
});

// Stable Ariake-style reveal: each block fades/floats in once.
// This avoids jitter on desktop and keeps the page comfortable to scroll.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function acceptCookie() {
  const cookieBox = document.getElementById("cookieBox");

  localStorage.setItem("safeGardenCookieNotice", "yes");

  if (cookieBox) {
    cookieBox.style.display = "none";
  }
}

const cookieBox = document.getElementById("cookieBox");

if (cookieBox && localStorage.getItem("safeGardenCookieNotice") === "yes") {
  cookieBox.style.display = "none";
}

// Image lightbox: click photos to enlarge.
const lightboxImages = document.querySelectorAll(
  ".gallery-grid img, .program-grid img, .portrait-card img, .hero-blob img"
);

if (lightboxImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button class="image-lightbox-close" type="button" aria-label="Close image">×</button>
    <img class="image-lightbox-img" alt="" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".image-lightbox-img");
  const closeBtn = lightbox.querySelector(".image-lightbox-close");

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    window.setTimeout(() => {
      lightboxImg.removeAttribute("src");
    }, 180);
  };

  lightboxImages.forEach((img) => {
    img.classList.add("is-lightbox-ready");
    img.setAttribute("tabindex", "0");

    const openLightbox = () => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "Safe Garden Home Daycare photo";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    };

    img.addEventListener("click", openLightbox);
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox();
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}


// Safe Garden full-width hero slider: lightweight, no external library.
(() => {
  const slider = document.querySelector("[data-hero-slider]");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dots = Array.from(slider.querySelectorAll(".hero-slider-dots button"));
  const prev = slider.querySelector(".hero-slider-prev");
  const next = slider.querySelector(".hero-slider-next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (slides.length <= 1) return;

  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let timer = null;
  let startX = null;

  const setActive = (nextIndex) => {
    if (nextIndex === current) return;

    const previous = current;
    current = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === current);
      slide.classList.toggle("is-exiting", index === previous);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === current);
      dot.setAttribute("aria-pressed", String(index === current));
    });

    window.setTimeout(() => {
      slides.forEach((slide) => slide.classList.remove("is-exiting"));
    }, 760);
  };

  const goNext = () => setActive(current + 1);
  const goPrev = () => setActive(current - 1);

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    if (reduceMotion) return;
    stop();
    timer = window.setInterval(goNext, 4500);
  };

  next?.addEventListener("click", () => {
    goNext();
    start();
  });

  prev?.addEventListener("click", () => {
    goPrev();
    start();
  });

  dots.forEach((dot, index) => {
    dot.setAttribute("aria-pressed", String(index === current));
    dot.addEventListener("click", () => {
      setActive(index);
      start();
    });
  });

  slider.addEventListener("pointerenter", stop);
  slider.addEventListener("pointerleave", start);

  slider.addEventListener("touchstart", (event) => {
    startX = event.touches[0]?.clientX ?? null;
  }, { passive: true });

  slider.addEventListener("touchend", (event) => {
    if (startX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;

    if (Math.abs(delta) > 45) {
      delta < 0 ? goNext() : goPrev();
      start();
    }

    startX = null;
  }, { passive: true });

  start();
})();


// Safe Garden Ariake-style safe hero slider.
// Adds previous/current/next classes for desktop peek layout.
// Mobile remains one-photo-at-a-time via CSS.
(() => {
  const slider = document.querySelector("[data-hero-slider]");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dots = Array.from(slider.querySelectorAll(".hero-slider-dots button"));
  const prev = slider.querySelector(".hero-slider-prev");
  const next = slider.querySelector(".hero-slider-next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (slides.length <= 1) return;

  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let timer = null;
  let startX = null;

  const updateSlides = () => {
    const prevIndex = (current - 1 + slides.length) % slides.length;
    const nextIndex = (current + 1) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === current);
      slide.classList.toggle("is-prev", index === prevIndex);
      slide.classList.toggle("is-next", index === nextIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === current);
      dot.setAttribute("aria-pressed", String(index === current));
    });
  };

  const setActive = (nextIndex) => {
    current = (nextIndex + slides.length) % slides.length;
    updateSlides();
  };

  const goNext = () => setActive(current + 1);
  const goPrev = () => setActive(current - 1);

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    if (reduceMotion) return;
    stop();
    timer = window.setInterval(goNext, 5600);
  };

  next?.addEventListener("click", () => {
    goNext();
    start();
  });

  prev?.addEventListener("click", () => {
    goPrev();
    start();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActive(index);
      start();
    });
  });

  slider.addEventListener("pointerenter", stop);
  slider.addEventListener("pointerleave", start);

  slider.addEventListener("touchstart", (event) => {
    startX = event.touches[0]?.clientX ?? null;
  }, { passive: true });

  slider.addEventListener("touchend", (event) => {
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;

    if (Math.abs(delta) > 42) {
      delta < 0 ? goNext() : goPrev();
      start();
    }

    startX = null;
  }, { passive: true });

  updateSlides();
  start();
})();



// First-load safety reflow for image/font-dependent layouts.
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
});
