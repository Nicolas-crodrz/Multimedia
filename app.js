const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("public"));

const seriesPath = "H:/Series"; // Ruta de la carpeta de series

// Configurar el motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Ruta para obtener todas las películas y series
// Ruta para obtener todas las películas y series
app.get("/", (req, res) => {
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

          res.render("index", { seriesNames, seriesCoverPaths });
        }
      });
    }
  });
});

// Ruta para mostrar el contenido de una carpeta
app.get("/series/:name", (req, res) => {
  const seriesName = req.params.name;
  const seriesFolderPath = path.join(seriesPath, seriesName);

  // Función recursiva para obtener todos los archivos de video en una carpeta y sus subcarpetas
  const getVideoFiles = (folderPath, callback) => {
    fs.readdir(folderPath, { withFileTypes: true }, (err, entries) => {
      if (err) {
        callback(err, null);
        return;
      }

      const files = [];
      const folders = [];

      entries.forEach((entry) => {
        if (entry.isFile()) {
          const fileExtension = path.extname(entry.name).toLowerCase();
          if ([".mkv", ".mp4", ".webm"].includes(fileExtension)) {
            files.push(entry.name);
          }
        } else if (entry.isDirectory()) {
          folders.push(entry.name);
        }
      });

      let completed = 0;
      if (folders.length > 0) {
        const seasonFolders = [];
        folders.forEach((folder) => {
          const subFolderPath = path.join(folderPath, folder);
          getVideoFiles(subFolderPath, (err, subFiles, subFolders) => {
            if (err) {
              callback(err, null);
              return;
            }

            files.push(...subFiles);
            folders.push(...subFolders);
            completed++;
            if (completed === folders.length) {
              callback(null, files, folders, seasonFolders);
            }
          });

          seasonFolders.push(folder);
        });
      } else {
        callback(null, files, folders, []);
      }
    });
  };

  // Obtener todos los archivos de video en la carpeta de la serie y sus subcarpetas
  getVideoFiles(seriesFolderPath, (err, files, folders, seasons, videos) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer la carpeta de la serie");
    } else {
      res.render("series", { seriesName, files, folders, seasons, videos });
    }
  });
});

// Ruta para mostrar los videos de una temporada
app.get("/series/:name/:season", (req, res) => {
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
          thumbnail: "ruta/a/la/miniatura", // Reemplaza con la ruta a la miniatura del video
        };
      });

      res.render("temporada", { seriesName, season, videos });
    }
  });
});

function construirRutaDelVideo(seriesName, season, videoName) {
  // Ruta base de las series
  const seriesPath = "H:/Series";

  // Construir la ruta completa del video
  const videoPath = path.join(seriesPath, seriesName, season, videoName);

  return videoPath;
}

// Ruta para mostrar un video específico
app.get("/series/:name/:season/:video", (req, res) => {
  // Obtén la información necesaria para construir la ruta del video
  const seriesName = req.params.name;
  const season = req.params.season;
  const videoName = req.params.video;

  // Construye la ruta completa del video
  const videoPath = construirRutaDelVideo(seriesName, season, videoName);

  // Renderiza la vista "video.ejs" y pasa la variable videoPath
  res.render("video", { videoPath });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
