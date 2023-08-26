document.addEventListener("DOMContentLoaded", function () {
  const showPopupButton = document.getElementById("showPopup");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");

  if (showPopupButton) {
    showPopupButton.addEventListener("click", function () {
      popup.style.display = "block";
    });
  }

  if (closePopup) {
    closePopup.addEventListener("click", function () {
      popup.style.display = "none";
    });
  }
});
