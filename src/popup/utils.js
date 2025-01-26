function showNotification(message, isError = false) {
  const notification = document.createElement("div");
  notification.classList.add("notification", isError ? "error" : null);
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
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
    // implement settings functionality here
    showNotification("Settings clicked!");
  });
});
