const subcategories = {
  Decoración: ["Interior", "Exterior"],
  Cocina: ["Comales", "Fruteros"],
  Organización: ["Joyeros"],
};

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
  link.setAttribute("data-dinamico", "true");
  document.head.appendChild(link);
}

function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = products
    .map(
      (product) =>
        `
        <li class="product-card">
          <img src="${product.images[0]}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.category}, ${product.subcategory}</p>
        </li>
        `
    )
    .join("");
}

function renderSubcategories(category) {
  const subNav = document.getElementById("subfilter-nav");
  const subList = document.getElementById("subfilter-list");

  subList.innerHTML = "";

  if (subcategories[category]) {
    subcategories[category].forEach((subcategory) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" data-category="${category}" data-subcategory="${subcategory}">${subcategory}</a>`;
      subList.appendChild(li);
    });

    subNav.style.display = "block";
    addSubcategoryEvents();
  }
}

function addCategoryEvents(products) {
  document.querySelectorAll("#filter-nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const category = link.dataset.category;
      renderSubcategories(category);

      const filterProducts =
        category === "Todos"
          ? products
          : products.filter((product) => product.category === category);

      renderProducts(filterProducts);
    });
  });
}

function addSubcategoryEvents() {
  document.querySelectorAll("#subfilter-nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const category = link.dataset.category;
      const subcategory = link.dataset.subcategory;

      fetch("products.json")
        .then((res) => res.json())
        .then((products) => {
          const filterProducts = products.filter(
            (product) =>
              product.category === category &&
              product.subcategory === subcategory
          );
          renderProducts(filterProducts);
        });
    });
  });
}

function initProducts(products) {
  renderProducts(products);
  addCategoryEvents(products);
}

function loadProducts() {
  fetch("partials/products.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;

      fetch("products.json")
        .then((res) => res.json())
        .then((products) => {
          initProducts(products);
        });
    });
}

function navigateTo() {
  const hash = window.location.hash.replace("#", "");

  switch (hash) {
    case "products":
      loadStylesheet("products.css");
      loadProducts();
      break;
    case "about-us":
      loadStylesheet("about_us.css");
      loadPartial("main-content", "about_us.html");
      break;
    case "questions":
      loadStylesheet("questions.css");
      loadPartial("main-content", "questions.html");
      break;
    default:
      loadStylesheet("home.css");
      loadPartial("main-content", "home.html");
  }
}

window.addEventListener("hashchange", navigateTo);

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "header.html");
  loadPartial("footer", "footer.html");
  navigateTo();
});
