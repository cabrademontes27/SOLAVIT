function loadPartial(id, file) {
  fetch(`partials/${file}`)
    .then((res) => res.text)
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadPartial("header", "header.html")
})
