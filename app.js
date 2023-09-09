const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes/routes"); // Importa las rutas desde routes.js

app.use(express.static("public"));

// Configurar el motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Usar las rutas definidas en routes.js
app.use("/", routes);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
