// referencias al dom
const lblOnline = document.querySelector("#lblOnline");
const lblOffline = document.querySelector("#lblOffline");
// Formulario de Productos
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const thumbnail = document.querySelector("#thumbnail");
const formProductos = document.querySelector("#formProductos");
// Formulario del Chat
const usuario = document.querySelector("#usuario");
const mensaje = document.querySelector("#mensaje");
const formChat = document.querySelector("#formChat");

const socket = io();

socket.on("connect", (payload) => {
  // para cuando es la primera vez que se conecta

  lblOffline.style.display = "none";
  lblOnline.style.display = "";
});

socket.on("disconnect", () => {
  lblOffline.style.display = "";
  lblOnline.style.display = "none";
});

// funcion para recuperar la plantilla y renderizar en la tabla
async function renderProducto(productos) {
  const hbs = await fetch("/plantilla/productos.hbs");
  const textHbs = await hbs.text();
  const functionTemplate = Handlebars.compile(textHbs);
  const html = functionTemplate({ productos });
  document.querySelector("#bodyTable").innerHTML = html;
}

// pongo a escuchar al cliente lo que envia el server
socket.on("enviar-producto", (payload) => {
  renderProducto(payload);
});

formProductos.addEventListener("submit", (e) => {
  e.preventDefault();
  const producto = {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value,
  };
  // uso el callback del server para recuperar todos los productos
  socket.emit("enviar-producto", producto, (productos) => {
    renderProducto(productos);
  });
  title.value = "";
  price.value = "";
  thumbnail.value = "";
});

const renderChat = (chat) => {
  let html = "";
  chat.forEach((element) => {
    html =
      html +
      `<li class="list-group-item">
          <span class="text-primary">${element.usuario}</span>
          <span class="text-danger">[${moment(element.fecha).format("DD/MM/YYYY HH:MM:SS")}]</span>
          : <span class="text-success fst-italic">${element.mensaje}</span>
       </li>`;
  });
  document.querySelector("#bodyChat").innerHTML = html;
};

// pongo a escuchar al cliente lo que envia el server
socket.on("enviar-mensaje", (payload) => {
  renderChat(payload);
});

formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const payload = {
    usuario: usuario.value,
    mensaje: mensaje.value,
    fecha: moment(),
  };
  socket.emit("enviar-mensaje", payload, (chat) => {
    renderChat(chat);
  });
  mensaje.value = "";
});
