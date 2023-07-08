document.addEventListener("DOMContentLoaded", function () {
  // Inicializar Video.js para cada elemento de video
  for (let i = 0; i < files.length; i++) {
    videojs("video-" + i, {}, function () {
      // Obtener la instancia de Video.js para cada video
      var player = this;

      // Opcional: Agregar eventos o personalizar el reproductor de video
      player.on("play", function () {
        console.log("Video is playing");
      });

      player.on("ended", function () {
        console.log("Video playback ended");
      });
    });
  }
});
