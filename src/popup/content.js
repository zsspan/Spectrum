console.log("Content script is running");

function highlightWords(words) {
  // need to put function inside because execute script only accepts one function arg
  function getArticleElement() {
    let article = document.querySelector("article");
    if (article) {
      console.log("method 1: Found <article> element");
      return article;
    }

    const commonClasses = [
      "article-body",
      "content",
      "post-content",
      "entry-content",
      "article-content",
    ];

    for (let className of commonClasses) {
      let div = document.querySelector(`div.${className}`);
      if (div) {
        console.log(`method 2: Found div with class "${className}"`);
        return div;
      }
    }

    let allDivs = Array.from(document.querySelectorAll("div"));
    let largestDiv = allDivs.reduce(
      (largest, div) =>
        div.textContent.length > (largest?.textContent.length || 0)
          ? div
          : largest,
      null
    );

    if (largestDiv) {
      console.log("method 3: Found largest <div> by text length");
      return largestDiv;
    }

    console.log("no suitable article content found.");
    return null;
  }

  // actual stuff starts
  // console.log("Starting to highlight words");
  // console.log('Word list:', words);

  let articleElement = getArticleElement();
  if (!articleElement) {
    return;
  }

  const walker = document.createTreeWalker(
    articleElement,
    NodeFilter.SHOW_TEXT,
    null
  );

  let nodes = [];
  while ((node = walker.nextNode())) {
    nodes.push(node);
  }

  nodes.forEach((node, index) => {
    let currentText = node.nodeValue;
    let parent = node.parentNode;

    if (!parent || currentText === "") return;

    let modified = false;
    let fragment = document.createDocumentFragment();
    let lastIndex = 0;

    words.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      let match;

      if (regex.test(currentText)) {
        console.log(`Found "${word}" in: "${currentText}"`);
        regex.lastIndex = 0;

        let newFragment = document.createDocumentFragment();
        lastIndex = 0;

        while ((match = regex.exec(currentText))) {
          // console.log(`Match found: "${match[0]}" at index ${match.index}`);

          newFragment.appendChild(
            document.createTextNode(currentText.slice(lastIndex, match.index))
          );

          // create span element for matched word
          let span = document.createElement("span");
          span.textContent = match[0];
          span.style.color = "blue";
          span.style.fontWeight = "bold";
          span.className = "highlighted";
          newFragment.appendChild(span);

          lastIndex = match.index + match[0].length;
        }

        newFragment.appendChild(
          document.createTextNode(currentText.slice(lastIndex))
        );

        fragment = newFragment;
        modified = true;
      }
    });

    // still some issues here, need to fix later
    if (modified) {
      // console.log(`Replacing text: "${currentText}"`);
      parent.replaceChild(fragment, node);
    } 
    // else {
    //   console.log(`No replacements made for: "${currentText}"`);
    // }
  });
}
