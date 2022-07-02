// data de productos
const optSqlite = require("../options/sqliteOpt");
const optMysql = require("../options/mysqlOpt");

const { ContainerProductos, ContainerChat } = require("../models/container");

const productosSQL = new ContainerProductos(optSqlite);
const chatSQL = new ContainerChat(optSqlite);

const socketController = (socket) => {
  // aca tambien puedo poner una bienvenida al usuario que se conecta

  // apenas se conecta mando los productos y mensajes que ya tengo
  productosSQL.getAll().then((prods) => {
    socket.emit("enviar-producto", prods);
  });
  chatSQL.getAll().then((chat) => {
    socket.emit("enviar-mensaje", chat);
  });

  // escuchando al cliente
  socket.on("enviar-producto", (payload, retorno) => {
    productosSQL.add(payload).then((prods) => {
      retorno(prods);
      socket.broadcast.emit("enviar-producto", prods);
    });
  });

  // escucho al cliente en otro evento
  socket.on("enviar-mensaje", (payload, retorno) => {
    chatSQL.add(payload).then((chat) => {
      retorno(chat);
      socket.broadcast.emit("enviar-mensaje", chat);
    });
  });
};

module.exports = socketController;
