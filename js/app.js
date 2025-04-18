function loadPartial(id, file) {
  fetch(`partials/${file}`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    });
}

function loadStylesheet(stylesheet) {
  const previous = document.querySelector('link[data-dinamico="true"]');
  if (previous) previous.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `css/${stylesheet}`;
  link.setAttribute('data-dinamico', 'true');
  document.head.appendChild(link);
}

function navigateTo() {
  const hash = window.location.hash.replace("#", "");

  switch (hash) {
    case "about-us":
      loadStylesheet("about_us.css")
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
