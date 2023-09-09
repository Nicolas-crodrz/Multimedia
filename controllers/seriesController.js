const fs = require("fs");
const path = require("path");
const seriesModel = require("../models/seriesModel");

// Ruta de la carpeta de series
const seriesPath = "H:/Series";

const seriesController = {
  getIndexPage: (req, res) => {
    // Obtener la lista de series disponibles
    fs.readdir(seriesPath, { withFileTypes: true }, (err, entries) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al leer la carpeta de series");
      } else {
        const seriesFolders = entries.filter((entry) => entry.isDirectory());
        const seriesNames = seriesFolders.map((folder) => folder.name);

        // Cargar las rutas completas de las portadas desde un archivo JSON
        fs.readFile("portadas.json", "utf8", (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error al leer el archivo de portadas");
          } else {
            const portadas = JSON.parse(data).series;

            // Verificar si existen portadas para todas las series
            const seriesCoverPaths = seriesNames.map((seriesName) => {
              const portada = portadas.find((p) => p.nombre === seriesName);
              if (portada) {
                return portada.ruta;
              } else {
                // Ruta de imagen de reemplazo si no se encuentra la portada
                return "/images/default-cover.png";
              }
            });
            res.render("index", {
              seriesNames: seriesNames,
              seriesCoverPaths: seriesCoverPaths,
            });
          }
        });
      }
    });
  },

  getSeriesPage: (req, res) => {
    const seriesName = req.params.name;
    const seriesFolderPath = path.join(seriesPath, seriesName);

    // Obtener todos los archivos de video en la carpeta de la serie y sus subcarpetas
    seriesModel.getVideoFiles(
      seriesFolderPath,
      (err, files, folders, seasons, videos) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error al leer la carpeta de la serie");
        } else {
          // Cargar las rutas completas de las portadas desde un archivo JSON
          fs.readFile("portadas.json", "utf8", (err, data) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error al leer el archivo de portadas");
            } else {
              const portadas = JSON.parse(data).series;
              const seriesCoverPaths = portadas.map((portada) => portada.ruta);

              res.render("series", {
                seriesName,
                files,
                folders,
                seasons,
                videos,
                seriesCoverPaths, // Pasar las rutas de las portadas a la vista
              });
            }
          });
        }
      }
    );
  },

  getSeasonPage: (req, res) => {
    const seriesName = req.params.name;
    const season = req.params.season;
    const seasonFolderPath = path.join(seriesPath, seriesName, season);

    // Leer los archivos de video en la carpeta de la temporada
    fs.readdir(seasonFolderPath, (err, entries) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al leer la carpeta de la temporada");
      } else {
        // Filtrar solo los archivos de video
        const videoFiles = entries.filter((entry) => {
          const fileExtension = path.extname(entry).toLowerCase();
          return [".mkv", ".mp4", ".webm"].includes(fileExtension);
        });

        // Obtener información de los videos (nombre y miniatura) si es necesario
        const videos = videoFiles.map((file) => {
          return {
            name: file,
            thumbnail: "/ruta/a/la/miniatura", // Reemplaza con la ruta a la miniatura del video
          };
        });

        res.render("temporada", { seriesName, season, videos });
      }
    });
  },

  getVideoPage: (req, res) => {
    // Obtén la información necesaria para construir la ruta del video
    const seriesName = req.params.name;
    const season = req.params.season;
    const videoName = req.params.video;

    // Construye la ruta completa del video
    const videoPath = path.join(seriesPath, seriesName, season, videoName);

    // Renderiza la vista "video.ejs" y pasa la variable videoPath
    res.render("video", { videoPath });
  },

  // Agregar más funciones de controlador según sea necesario
};

module.exports = seriesController;
