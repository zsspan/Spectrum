let draggedElement = null;

function handleDragStart(e) {
  draggedElement = e.target;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", e.target.outerHTML);
  e.target.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  const target = e.target.closest(".article-card");
  if (target && target !== draggedElement) {
    const listContainer = document.getElementById("saved-articles-list");
    const cards = Array.from(listContainer.children);
    const draggedIndex = cards.indexOf(draggedElement);
    const targetIndex = cards.indexOf(target);
    if (draggedIndex < targetIndex) {
      listContainer.insertBefore(draggedElement, target.nextSibling);
    } else {
      listContainer.insertBefore(draggedElement, target);
    }
  }
}

function handleDrop(e) {
  e.stopPropagation();
  if (draggedElement !== e.target) {
    draggedElement.outerHTML = e.dataTransfer.getData("text/html");
    draggedElement.classList.remove("dragging");
    reorderArticles();
  }
  draggedElement = null;
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}

function reorderArticles() {
  const listContainer = document.getElementById("saved-articles-list");
  const savedArticles = Array.from(listContainer.children).map((card) => {
    const index = card.getAttribute("data-index");
    return JSON.parse(localStorage.getItem("savedArticles"))[index];
  });
  localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
  updateArticleList(savedArticles);
}
