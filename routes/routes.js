const express = require("express");
const router = express.Router();
const seriesController = require("../controllers/seriesController");

// Ruta para la página de inicio
router.get("/", seriesController.getIndexPage);

// Ruta para la página de detalles de una serie
router.get("/series/:name", seriesController.getSeriesPage);

// Ruta para la página de detalles de una temporada
router.get("/series/:name/:season", seriesController.getSeasonPage);

// Ruta para la página de reproducción de video
router.get("/series/:name/:season/:video", seriesController.getVideoPage);

// Agregar más rutas según sea necesario

module.exports = router;
