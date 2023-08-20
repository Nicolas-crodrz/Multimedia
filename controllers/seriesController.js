const fs = require("fs");
const path = require("path");

const seriesPath = "H:/Series"; // Ruta de la carpeta de series

// FN: getVideoFiles
function getVideoFiles(folderPath, callback) {
  fs.readdir(folderPath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      callback(err, null);
      return;
    }

    const videos = entries
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const videoName = entry.name;
        const videoPath = path.join(folderPath, videoName);

        return {
          name: videoName,
          path: videoPath,
        };
      });

    callback(null, videos);
  });
}

// FN: getAllSeries
function getAllSeries(req, res) {
  fs.readdir(seriesPath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer la carpeta de series");
    } else {
      const seriesFolders = entries.filter((entry) => entry.isDirectory());
      const seriesNames = seriesFolders.map((folder) => folder.name);
      const seriesCoverPaths = seriesNames.map((seriesName) =>
        path.join(seriesPath, ".PORTADAS", `${seriesName}.png`)
      );

      res.render("index", { seriesNames, seriesCoverPaths });
    }
  });
}

// FN: getSeriesDetails
function getSeriesDetails(req, res) {
  const seriesName = req.params.name;
  const seriesFolderPath = path.join(seriesPath, seriesName, "Temporadas");
  const seriesCoverPath = path.join(
    seriesPath,
    ".PORTADAS",
    `${seriesName}.png`
  );

  getVideoFiles(seriesFolderPath, (err, videos) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer la carpeta de la serie");
    } else {
      res.render("series", {
        seriesName,
      });
    }
  });
}

// FN: getSeasonVideos
function getSeasonVideos(req, res) {
  const seriesName = req.params.name;
  const season = req.params.season;
  const seasonFolderPath = path.join(seriesPath, seriesName, season);

  getVideoFiles(seasonFolderPath, (err, videos) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al leer la carpeta de la temporada");
    } else {
      res.render("Temporadas", { seriesName, season, videos });
    }
  });
}

// FN: getVideo
function getVideo(req, res) {
  const seriesName = req.params.name;
  const season = req.params.season;
  const videoName = req.params.video;
  const seriesFolderPath = path.join(seriesPath, seriesName, "Temporadas");
  const seasonFolderPath = path.join(seriesFolderPath, season);
  const videoPath = path.join(seasonFolderPath, videoName);

  // Reemplaza cualquier barra diagonal inversa duplicada con una sola barra
  const sanitizedVideoPath = videoPath.replace(/\\/g, "/");

  res.render("video", { videoPath: sanitizedVideoPath });
}

module.exports = {
  getAllSeries,
  getSeriesDetails,
  getSeasonVideos,
  getVideo,
};
