const subcategories = {
  Decoración: ["Interior", "Exterior"],
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

  link.onerror = function () {
    console.error(`Error loading stylesheet: ${stylesheet}`);
  };

  document.head.appendChild(link);
}

function renderProducts(products, parent) {
  // load products
  const productList = document.getElementById("product-list");
  productList.innerHTML = products
    .map((product) => {
      let productParent =
        product.parent === "bisuteria" ? "Bisutería" : product.parent;

      let productString = productParent;
      productString += product.category === "" ? "" : `, ${product.category}`;
      productString +=
        product.subcategory === "" ? "" : `, ${product.subcategory}`;

      if (parent === "all") {
        return `
            <li class="product-card" data-parent="${product.parent}" data-id="${product.id}">
              <img src="${product.images[0]}" alt="${product.name}" />
              <h3>${product.name}</h3>
              <p>${productString}</p>
            </li>
            `;
      } else if (product.parent === parent) {
        return `
            <li class="product-card" data-parent="${product.parent}" data-id="${product.id}">
              <img src="${product.images[0]}" alt="${product.name}" />
              <h3>${product.name}</h3>
              <p>${productString}</p>
            </li>
            `;
      }
    })
    .join("");

  addProductClickEvents(products);
}

function renderSubcategories(category, parent) {
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
    addSubcategoryEvents(parent);
  }
}

function showProductDetail(product) {
  let parent = product.parent === "bisuteria" ? "Bisutería" : product.parent;
  //route
  const routeTag = document.getElementById("route");
  routeTag.innerHTML = `
    <a href="#products/all">Artesanías</a>
    <p>/</p>
    <a href="#products/${product.parent}">${parent}</a>
  `;

  //product info
  const sectionTag = document.getElementById("product-info");
  let categories = parent;
  categories += product.category === "" ? "" : `, ${product.category}`;
  categories += product.subcategory === "" ? "" : `, ${product.subcategory}`;
  sectionTag.innerHTML = `
    <h1>${product.name}</h1>
    <h2>${categories}</h2>
    <p>${product.description}<p>
    `;

  // images
  const images = Array.isArray(product.images)
    ? product.images
    : [product.image];
  let current = 0;

  const imgTag = document.getElementById("slider-image");

  function updateImage() {
    imgTag.src = images[current];
  }

  updateImage();

  document.getElementById("next").onclick = () => {
    current = (current + 1) % images.length;
    updateImage();
  };

  document.getElementById("prev").onclick = () => {
    current = (current - 1 + images.length) % images.length;
    updateImage();
  };
}

function loadProductDetailById(productId) {
  fetch("partials/product-detail.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;

      fetch("products.json")
        .then((res) => res.json())
        .then((products) => {
          const product = products.find((product) => product.id == productId);
          if (product) showProductDetail(product);
        });
    });
}

function addCategoryEvents(products, parent) {
  document.querySelectorAll("#filter-nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const category = link.dataset.category;
      renderSubcategories(category, parent);

      const filterProducts =
        category === "Todos"
          ? products
          : products.filter((product) => product.category === category);

      renderProducts(filterProducts, parent);
    });
  });
}

function addSubcategoryEvents(parent) {
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
          renderProducts(filterProducts, parent);
        });
    });
  });
}

function addProductClickEvents() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const productParent = card.dataset.parent;
      const productId = card.dataset.id;
      window.location.hash = `products/${productParent}/${productId}`;
    });
  });
}

function initProducts(products, parent) {
  renderProducts(products, parent);
  addCategoryEvents(products, parent);
}

function loadProducts(parent) {
  fetch(`partials/${parent}.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;

      fetch("products.json")
        .then((res) => res.json())
        .then((products) => {
          initProducts(products, parent);
        });
    });
}

async function navigateTo() {
  const hash = window.location.hash.replace("#", "");
  // reset scroll
  window.scrollTo(0, 0);

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "";

  await new Promise(resolve => setTimeout(resolve, 300));

  const view = hash.split("/");

  switch (view[0]) {
    case "about-us":
      loadStylesheet("about_us.css");
      loadPartial("main-content", "about-us.html");
      break;
    case "questions":
      loadStylesheet("questions.css");
      loadPartial("main-content", "questions.html");
      break;
    case "creators":
      loadStylesheet("creators.css");
      loadPartial("main-content", "creators.html");
      break;
    case "impact":
      loadStylesheet("impact.css");
      loadPartial("main-content", "impact.html");
      break;
    case "donate":
      loadStylesheet("donate.css");
      loadPartial("main-content", "donate.html");
      break;
    case "education":
      loadStylesheet("education.css");
      loadPartial("main-content", "education.html");
      break;
    case "":
    case "home":
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
