function openSidebar() {
  const primaryNav = document.getElementById("primary-navigation");
  const navToggle = document.getElementById("mobile-nav-toggle");
  const overlay = document.getElementById("sidebar-overlay");
  const visibility = primaryNav.getAttribute("data-visible");

  if (visibility === "false") {
    primaryNav.setAttribute("data-visible", true);
    navToggle.setAttribute("data-expanded", true);
    overlay.setAttribute("data-expanded", true);
  } else {
    primaryNav.setAttribute("data-visible", false);
    navToggle.setAttribute("data-expanded", false);
    overlay.setAttribute("data-expanded", false);
  }
}
