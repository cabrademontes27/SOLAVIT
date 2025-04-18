function loadPartial(id, file) {
  fetch(`partials/${file}`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    });
}

function navigateTo() {
  const hash = window.location.hash.replace("#", "");

  switch (hash) {
    case "about-us":
      loadPartial("main-content", "about_us.html");
      break;
    default:
      loadPartial("main-content", "home.html")
  }
}

window.addEventListener("hashchange", navigateTo);

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "header.html");
  loadPartial("footer", "footer.html");
  navigateTo();
});
