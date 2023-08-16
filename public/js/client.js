const searchInput = document.getElementById("searchInput");
const seriesCards = document.querySelectorAll(".serie-card");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  seriesCards.forEach((card) => {
    const seriesName = card.querySelector("p").textContent.toLowerCase();
    if (seriesName.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
