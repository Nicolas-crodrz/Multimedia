const fs = require("fs");
const path = require("path");

const seriesPath = "H:/Series"; // Ruta de la carpeta de series

// Función para obtener todos los archivos de video en una carpeta y sus subcarpetas
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

module.exports = {
  getVideoFiles,
};
