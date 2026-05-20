/*
========================================
MINI ECOMMERCE - BOILERPLATE
========================================

TECNOLOGÍAS:
- JavaScript
- Fetch API
- LocalStorage
- SessionStorage

FASES:
1. Productos
2. Filtros
3. Carrito
4. EXTRA Persistencia
5. EXTRA Login
6. EXTRA Sesión
7. EXTRA Favoritos

========================================
*/


// ========================================
// SELECTORES DEL DOM
// ========================================

// Contenedor productos
const productsContainer =
  document.getElementById("productsContainer");

// Contenedor carrito
const cartContainer =
  document.getElementById("cartContainer");

// Total carrito
const cartTotal =
  document.getElementById("cartTotal");

// Buscador
const searchInput =
  document.getElementById("searchInput");

// Filtro categorías
const categoryFilter =
  document.getElementById("categoryFilter");

// Ordenación
const sortSelect =
  document.getElementById("sortSelect");

// Modal login
const loginModal =
  document.getElementById("loginModal");

// Botón abrir login
const accountBtn =
  document.querySelector(".account-btn");

// Botón cerrar login
const closeLogin =
  document.getElementById("closeLogin");

// Formulario login
const loginForm =
  document.getElementById("loginForm");


// ========================================
// VARIABLES GLOBALES
// ========================================

// Productos API
let products = [];

// Productos filtrados
let filteredProducts = [];

// Carrito
let cart = [];

// Favoritos
let favorites = [];


// ========================================
// FASE 1 - FETCH PRODUCTOS
// ========================================

/*
OBJETIVO:
Obtener productos desde la API.

ENDPOINT:
https://fakestoreapi.com/products

CONCEPTOS:
- fetch()
- promesas
- .then()
- .catch()

TAREAS:
- Hacer petición fetch
- Convertir respuesta a JSON
- Guardar productos
- Pintar productos
- Pintar categorías
*/


/*
========================================
¿QUÉ DEVUELVE LA API?
========================================

La API devuelve un ARRAY de productos.

Ejemplo:

[
  {
    id: 1,
    title: "Fjallraven Backpack",
    price: 109.95,
    description: "Your perfect pack...",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/..."
  }
]

========================================
¿CÓMO ACCEDER A LOS DATOS?
========================================

product.title
product.price
product.category
product.image

========================================
EJEMPLO RECORRIENDO PRODUCTOS
========================================

products.forEach(product => {

  console.log(product.title);

});

*/
const url = "https://fakestoreapi.com/products";

function getProducts() {
  fetch(url).
    then((response) => response.json()).
    then((data) => {
      products = data;
      renderCategories(products);

      console.log(data);
    });
}


// ========================================
// FASE 1 - RENDER PRODUCTOS
// ========================================

/*
OBJETIVO:
Pintar productos dinámicamente.

MOSTRAR:
- Imagen
- Título
- Precio
- Categoría
- Botón carrito
- Botón favorito

PISTA:
Usar:
- innerHTML
- createElement
- appendChild
*/


/*
========================================
PISTA RENDERIZADO
========================================

Ejemplo creando una card:

const card = document.createElement("article");

card.innerHTML = `
  <h2>${product.title}</h2>
`;

productsContainer.appendChild(card);

========================================
*/


function renderProducts(productsArray) {
  productsArray.forEach(producto => {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");

    const productImageContainer = document.createElement("div");
    productImageContainer.classList.add("product-image");

    const productImage = document.createElement("img");
    productImage.src = producto.image;
    productImage.alt = `Producto ${producto.title}`;

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    const productCategory = document.createElement("product-category");
    productCategory.classList.add("product-category");
    productCategory.textContent = producto.category;

    const productTitle = document.createElement("h3");
    productTitle.classList.add("product-title");
    productTitle.textContent = producto.title;

    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = producto.price;

    const cardActions = document.createElement("div");
    cardActions.classList.add("card-actions");

    const addBtn = document.createElement("button");
    addBtn.classList.add("add-btn");
    addBtn.textContent = "Añadir";
    addBtn.addEventListener('click', () => console.log("click"));

    const favBtn = document.createElement("button");
    favBtn.textContent = '🤍';
    favBtn.classList.add("fav-btn")
    favBtn.addEventListener('click', () => console.log("click"));


    productImageContainer.append(productImage);
    productCard.append(productImageContainer);

    cardActions.append(addBtn,favBtn);
    productInfo.append(productCategory,productTitle,productPrice,cardActions);
    productCard.append(productInfo);
    productsContainer.append(productCard);
  });
}


// ========================================
// FASE 2 - CATEGORÍAS
// ========================================

/*
OBJETIVO:
Generar categorías dinámicamente.

TAREAS:
- Obtener categorías únicas
- Crear options
- Añadir al select

PISTA:
new Set()
*/

function renderCategories(productsArray) {
  // categorías únicas
  const todasLasCategorias = productsArray.map(producto => producto.category);
  const categoriasUnicas = [...new Set(todasLasCategorias)];
  // opciones y Añadir al select
  console.log(categoriasUnicas);
  categoriasUnicas.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    categoryFilter.appendChild(option);
  });

}


// ========================================
// FASE 2 - FILTROS
// ========================================

/*
OBJETIVO:
Filtrar productos dinámicamente.

REQUISITOS:
- Buscar por nombre
- Filtrar por categoría
- Ordenar:
  - precio ascendente
  - precio descendente
  - A-Z
  - Z-A

PISTA:
- filter()
- sort()
- localeCompare()
*/

function filterProducts() {

  const textoBusqueda = searchInput.value.toLowerCase();
  const categoriaSeleccionada = categoryFilter.value;
  const ordenSeleccionado = sortSelect.value;

  // Buscar por nombre y filtrar por categoría
  filteredProducts = products.filter(producto => {
    const coincideNombre = producto.title.toLowerCase().includes(textoBusqueda);
    const coincideCategoria = (categoriaSeleccionada === "todos") || (producto.category === categoriaSeleccionada);
    return coincideNombre && coincideCategoria;
  });

  // Ordenar
  if (ordenSeleccionado === "precio-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }
  else if (ordenSeleccionado === "precio-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  else if (ordenSeleccionado === "az") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  }
  else if (ordenSeleccionado === "za") {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  }

  // Volvemos a pintar los productos filtrados en el contenedor
  renderProducts(filteredProducts);

}


// ========================================
// EVENTOS FILTROS
// ========================================

searchInput.addEventListener(
  "input",
  filterProducts
);

categoryFilter.addEventListener(
  "change",
  filterProducts
);

sortSelect.addEventListener(
  "change",
  filterProducts
);


// ========================================
// FASE 3 - CARRITO
// ========================================

/*
OBJETIVO:
Añadir productos al carrito.

TAREAS:
- Buscar producto por ID
- Añadir al array carrito
- Incrementar cantidad si ya existe
- Guardar carrito
- Renderizar carrito
*/

function addToCart(id) {

  // TODO

}


/*
OBJETIVO:
Eliminar producto del carrito.
*/

function removeFromCart(id) {

  // TODO

}


/*
OBJETIVO:
Pintar carrito dinámicamente.

MOSTRAR:
- Nombre
- Cantidad
- Precio
- Total carrito
*/

function renderCart() {

  // TODO

}


// ========================================
// FASE 4 - LOCAL STORAGE
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Guardar carrito en localStorage.

PISTA:
JSON.stringify()
*/

function saveCart() {

  // TODO

}


/*
OBJETIVO:
Recuperar carrito guardado.

PISTA:
JSON.parse()
*/

function loadCart() {

  // TODO

}


// ========================================
// FASE 7 - FAVORITOS
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Guardar productos favoritos.

TAREAS:
- Añadir favoritos
- Eliminar favoritos
- Guardar en localStorage
- Recuperar favoritos
*/

function toggleFavorite(id) {

  // TODO

}


function loadFavorites() {

  // TODO

}


// ========================================
// FASE 5 - LOGIN
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Simular login con FakeStoreAPI.

ENDPOINT:
https://fakestoreapi.com/auth/login

USUARIO TEST:
mor_2314
83r5^_

CONCEPTOS:
- fetch POST
- JSON.stringify()
- sessionStorage

TAREAS:
- Capturar formulario
- Enviar datos
- Guardar token
- Cerrar modal
*/

loginForm.addEventListener(
  "submit",
  (e) => {

    e.preventDefault();

    // TODO

  }
);


// ========================================
// FASE 6 - SESIÓN
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Mantener sesión iniciada.

TAREAS:
- Detectar token
- Mostrar login si no existe
*/

function checkSession() {

  // TODO

}


/*
OBJETIVO:
Cerrar sesión.

TAREAS:
- Eliminar token
- Cerrar modal
*/

function logout() {

  // TODO

}


// ========================================
// MODAL LOGIN
// ========================================

/*
========================================
EXTRA
========================================
*/


/*
OBJETIVO:
Abrir modal login.
*/

// accountBtn.addEventListener(
//   "click",
//   () => {

//     // TODO

//   }
// );


/*
OBJETIVO:
Cerrar modal login.
*/

closeLogin.addEventListener(
  "click",
  () => {

    // TODO

  }
);


/*
OBJETIVO:
Cerrar modal clicando fuera.
*/

loginModal.addEventListener(
  "click",
  (e) => {

    // TODO

  }
);


// ========================================
// INIT APP
// ========================================

/*
OBJETIVO:
Inicializar la aplicación.

TAREAS:
- Obtener productos
- Cargar carrito
- Cargar favoritos
- Comprobar sesión
*/

function init() {
  // TODO

  //fixme: cambiar a renderProducts
  getProducts();
  setTimeout(() => renderProducts(products) , 10)
  


}


// Iniciar aplicación
init();