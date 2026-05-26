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
  document.querySelector(".cart-btn");

// Botón cerrar login
const closeLogin =
  document.getElementById("closeLogin");

// Formulario login
const loginForm =
  document.getElementById("loginForm");

// eventos 




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

      renderProducts(products);
      renderCategories(products);
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

  productsContainer.innerHTML = ""; //vaciar la pantalla antes de filtrar

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
    //productPrice.textContent = producto.price;
    productPrice.textContent = `${producto.price}€`; // AÑADIR MONEDA A LOS ARTICULOS

    const cardActions = document.createElement("div");
    cardActions.classList.add("card-actions");

    const addBtn = document.createElement("button");
    addBtn.classList.add("add-btn");
    addBtn.textContent = "Añadir";

    addBtn.addEventListener('click', () => addToCart(producto.id));

    const favBtn = document.createElement("button");
    favBtn.textContent = '🤍';
    favBtn.classList.add("fav-btn")
    favBtn.addEventListener('click', () => toggleFavorite(producto.id));


    productImageContainer.append(productImage);
    productCard.append(productImageContainer);

    cardActions.append(addBtn, favBtn);
    productInfo.append(productCategory, productTitle, productPrice, cardActions);
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

  categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';

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

  const textoBusqueda = document.getElementById("searchInput").value.toLowerCase();
  const categoriaSeleccionada = document.getElementById("categoryFilter").value;
  const ordenSeleccionado = document.getElementById("sortSelect").value;


  // Buscar por nombre y filtrar por categoría
  filteredProducts = products.filter(producto => {
    const coincideNombre = producto.title.toLowerCase().includes(textoBusqueda);

    const coincideCategoria = (categoriaSeleccionada === "all") || (producto.category === categoriaSeleccionada);

    return coincideNombre && coincideCategoria;
  });

  // Ordenar 

  if (ordenSeleccionado === "priceAsc") filteredProducts.sort((a, b) => a.price - b.price);
  if (ordenSeleccionado === "priceDesc") filteredProducts.sort((a, b) => b.price - a.price);
  if (ordenSeleccionado === "az") filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  if (ordenSeleccionado === "za") filteredProducts.sort((a, b) => b.title.localeCompare(a.title));

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

let totalPriceCart = 0;

function updateCart() {
  // Calcular costo
  totalPriceCart = cart.reduce((total, item) => total + (item.cantidad * item.producto.price), 0).toFixed(2);
  // 
  cartTotal.textContent = `${totalPriceCart}€`;
}

function addToCart(id) {
  // Buscar producto por ID
  const producto = products.find((p) => p.id === id);

  const productoEnCarrito = cart.find((p) => p.producto.id === id);

  if (!productoEnCarrito) {
    // Añadir al array carrito
    cart.push({ producto: producto, cantidad: 1 });
  } else {
    // Incrementar cantidad si ya existe
    productoEnCarrito.cantidad++;
  }

  //Guardar carrito
  localStorage.setItem("carrito", JSON.stringify(cart));

  // Calcular costo
  const total = cart.reduce((total, item) => total + (item.cantidad * item.producto.price), 0).toFixed(2);

  //Renderizar carrito
  renderCart();
  updateCart();
}


/*
OBJETIVO:
Eliminar producto del carrito.

/*
OBJETIVO:
Eliminar producto del carrito por completo.
*/
function removeFromCart(id) {
  // Filtramos el array 'cart' comparando con el id dentro de 'item.producto'
  cart = cart.filter(item => item.producto.id !== id);

  // Guardamos en LocalStorage para que persista y volvemos a pintar
  localStorage.setItem("carrito", JSON.stringify(cart));
  renderCart();
}

/*
OBJETIVO:
Vaciar todo el carrito de golpe.
*/
function clearCart() {
  cart = [];
  localStorage.setItem("carrito", JSON.stringify(cart));
  renderCart();
}

/*
OBJETIVO:
Incrementar o decrementar la cantidad de un artículo.
*/
function updateQuantity(id, action) {
  const itemEnCarrito = cart.find(item => item.producto.id === id);

  if (!itemEnCarrito) return;

  if (action === "increment") {
    itemEnCarrito.cantidad++;
  } else if (action === "decrement") {
    itemEnCarrito.cantidad--;

    // Si la cantidad baja de 1, eliminamos el artículo por completo
    if (itemEnCarrito.cantidad < 1) {
      removeFromCart(id);
      return; // Salimos de la función para evitar doble renderizado
    }
  }

  // Guardamos el estado y actualizamos la interfaz
  localStorage.setItem("carrito", JSON.stringify(cart));
  renderCart();
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
  cartContainer.innerHTML = '';

  if (cart.length < 1) {
    const notProductsText = document.createElement("p");
    notProductsText.textContent = "Agrega un producto a tu lista de compra";
    cartContainer.append(notProductsText)

    //  cartTotal lo ponemos a 0
    if (cartTotal) cartTotal.textContent = "0.00€";
    return;
  }

  // TODO
  cart.map((item) => {
    const producto = item.producto;
    // calculo del subtotal y suma carrito
    const precioSubtotal = producto.price * item.cantidad;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const cardItemInfo = document.createElement("div");
    cardItemInfo.classList.add("cart-item-info");

    const cartItemTitle = document.createElement("p");
    cartItemTitle.classList.add("cart-item-title");
    cartItemTitle.textContent = producto.title;

    // Contenedor para los controles de cantidad (+ / -)
    const quantityControls = document.createElement("div");
    quantityControls.classList.add("quantity-controls");

    const btnDecrement = document.createElement("button");
    btnDecrement.classList.add("btn-qty");
    btnDecrement.textContent = "-";
    btnDecrement.addEventListener("click", () => updateQuantity(producto.id, "decrement"));

    const quantitySpan = document.createElement("span");
    quantitySpan.classList.add("qty-number");
    quantitySpan.textContent = ` ${item.cantidad} `;

    const btnIncrement = document.createElement("button");
    btnIncrement.classList.add("btn-qty");
    btnIncrement.textContent = "+";
    btnIncrement.addEventListener("click", () => updateQuantity(producto.id, "increment"));

    quantityControls.append(btnDecrement, quantitySpan, btnIncrement);

    const cartItemPrice = document.createElement("p");
    cartItemPrice.classList.add("cart-item-price");

    cartItemPrice.textContent = `${item.cantidad} x ${producto.price}€ (${precioSubtotal.toFixed(2)}€)`;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = 'X';

    // Conectamos función de eliminar
    removeBtn.addEventListener("click", () => removeFromCart(producto.id));

    cardItemInfo.append(cartItemTitle, quantityControls, cartItemPrice);
    cartItem.append(cardItemInfo, removeBtn);
    cartContainer.append(cartItem);
  });

  // Actualizar carrito
  updateCart();

  // Creamos la sección final del carrito para el botón "Vaciar Carrito"
  const cartActionsContainer = document.createElement("div");
  cartActionsContainer.classList.add("cart-menu-actions");



  const clearCartBtn = document.createElement("button");
  clearCartBtn.id = "clear-cart-btn";
  clearCartBtn.textContent = "Vaciar Carrito";
  clearCartBtn.addEventListener("click", clearCart);

  cartActionsContainer.append(clearCartBtn);
  cartContainer.append(cartActionsContainer);
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
  // Convierte el array 'cart' a texto JSON y lo guarda con la clave 'carrito'
  localStorage.setItem("carrito", JSON.stringify(cart));
}

/*
OBJETIVO:
Recuperar carrito guardado.

PISTA:
JSON.parse()
*/

function loadCart() {
  // TODO
  const carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    // Convierte el texto JSON de vuelta a un array de objetos
    cart = JSON.parse(carritoGuardado);
    // Vuelve a pintar el carrito en la pantalla para que se vean los productos cargados
    renderCart();
  }
  cart.forEach(item => console.log(item.producto.title, "- Cantidad:", item.cantidad));

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
  console.log(id);
  const producto = products.find((producto) => producto.id === id);

  if (!favorites.includes(producto)) {
    favorites.push(producto);
  } else {
    favorites = favorites.filter((favorito) => favorito.id != id);
  }

  localStorage.setItem('favoritos', JSON.stringify(favorites));
}


function loadFavorites() {
  if (localStorage.getItem('favoritos')) {
    favorites = localStorage.getItem('favoritos');
  }
}


// ========================================
// FASE 5 - LOGIN
// ========================================

const btnMiCuenta = document.querySelector(".cart-btn");
const loginModalElement = document.getElementById("loginModal");
const btnCloseLogin = document.getElementById("closeLogin");


// Abrir modal al pulsar "Mi cuenta"
if (btnMiCuenta) {
  btnMiCuenta.addEventListener("click", () => {
    if (loginModalElement) {
      loginModalElement.classList.remove("hidden");
    }
  });
}

// Cerrar modal al pulsar la equis (✕)
if (btnCloseLogin) {
  btnCloseLogin.addEventListener("click", () => {
    if (loginModalElement) {
      loginModalElement.classList.add("hidden");
    }
  });
}

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

    // Capturar formulario
    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;

    // 2. enviar datos
    fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Credenciales inválidas");
        }
        return response.json();
      })
      .then((data) => {
        // 3. Guardar token
        if (data.token) {
          sessionStorage.setItem("token", data.token);

          // 4 Cerrar modal
          if (loginModalElement) {
            loginModalElement.classList.add("hidden");
          }
          alert("¡Login correcto!");
        }
      })
      .catch((error) => {
        console.error("Error en el login:", error);
        alert("Usuario o contraseña incorrectos.");
      });

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
  getProducts();
  loadCart();
  renderCart();
}


// Iniciar aplicación
init();