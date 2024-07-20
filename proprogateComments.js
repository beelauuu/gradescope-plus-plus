function proprogateComments() {
  let total = 0;
  let adjustmentsToAdd = "Adjustments:\n";
  const comments = document.querySelectorAll('.publishedAnnotation--contentWrapper');
  const eventInput = new Event('input', { bubbles: true });

  //Loop through all the comments and match with the digits [+/-d]
  comments.forEach(comment => {
    if(comment.querySelector('.markdownText.u-preserveWhitespace.markdownText-sm') != null) {
      const commentText = comment.querySelector('.markdownText.u-preserveWhitespace.markdownText-sm').textContent;
      const value = commentText.match(/\[[-+]?\d+\]/);
      if(value) {
        adjustmentsToAdd += commentText + "\n";
        total += parseFloat(value[0].slice(1, -1));
      }
    }
  });

  // If no comments have valid adjustments, do not enforce an empty value in the adjustment-comment box
  if(total == 0 && comments.length > 0) {
    return;
  }

  // If there are no comments and total is 0, clear the adjustmentsToAdd only if it was previously set
  if(total == 0 && comments.length == 0) {
    const textareaElement = document.getElementById('adjustment-comment');
    if (textareaElement && textareaElement.value.startsWith("Adjustments:")) {
      adjustmentsToAdd = "";
    } else {
      return;
    }
  }

  //Otherwise adjust points and comments
  if(document.getElementById('pointAdjustment') != null) {
    const pointAdjustmentInput = document.getElementById('pointAdjustment');
    pointAdjustmentInput.value = total.toString();
    pointAdjustmentInput.dispatchEvent(eventInput);
  }

  if(document.getElementById('adjustment-comment') != null) {
    const textAdjustmentInput = document.getElementById('adjustment-comment');
    textAdjustmentInput.value = adjustmentsToAdd;
    textAdjustmentInput.dispatchEvent(eventInput);
  }
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' || mutation.type === 'subtree') {
      proprogateComments();
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });