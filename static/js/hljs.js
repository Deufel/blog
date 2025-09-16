// Watch for any new code blocks being added
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (node.nodeType === 1) {
        // Element node
        // Find code blocks in the added content
        const codeBlocks = node.querySelectorAll
          ? node.querySelectorAll("pre code")
          : [];
        codeBlocks.forEach((block) => {
          if (!block.classList.contains("hljs")) {
            console.log("Highlighting block:", block);
            hljs.highlightElement(block);
          }
        });

        // Also check if the node itself is a code block
        if (
          node.matches &&
          node.matches("pre code") &&
          !node.classList.contains("hljs")
        ) {
          console.log("Highlighting node:", node);
          hljs.highlightElement(node);
        }
      }
    });
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Also run initial highlighting
hljs.highlightAll();
