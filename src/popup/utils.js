document.addEventListener("DOMContentLoaded", () => {
  function showNotification(message, isError = false) {
    const notification = document.createElement("div");
    notification.classList.add("notification", isError ? "error" : null);
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function showModal() {
    const modal = document.getElementById("settings-modal");
    modal.classList.add("show");

    const closeButton = modal.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      modal.classList.remove("show");
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("show");
      }
    });
  }

  document.getElementById("download-button").addEventListener("click", () => {
    const savedArticles =
      JSON.parse(localStorage.getItem("savedArticles")) || [];
    const blob = new Blob([JSON.stringify(savedArticles, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saved_articles.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Downloaded articles!");
  });

  document.getElementById("settings-button").addEventListener("click", () => {
    showModal();
  });
});
