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

