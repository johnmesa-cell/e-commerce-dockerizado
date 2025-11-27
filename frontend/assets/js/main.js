document.querySelectorAll(".category").forEach(cat => {
  cat.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(c => c.classList.remove("selected"));
    cat.classList.add("selected");
    // Esto llamará a la función de filtro en app.js
    // Asegúrate que app.js esté cargado después de main.js
  });
});

