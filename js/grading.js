// Grading Mode Code // 
function hasAncestorWithClass(element, className) {
    while (element) {
        if (element.classList && element.classList.contains(className)) {
            return true;
        }
        element = element.parentElement;
    }
    return false;
}

function triggerResize() {
    window.dispatchEvent(new Event('resize'));
}

function rearrangeUI() {
  const container = document.querySelector('.tiiBtnContainer');
  if (container && !hasAncestorWithClass(container, 'submissionGraderRegradeRequest--content')) {
      let button = document.getElementById('gradingModeButton');
      if (!button) {
          button = document.createElement('button');
          button.type = 'button';
          button.id = 'gradingModeButton';
          button.className = 'tiiBtn tiiBtn-secondary u-pointerEventsAuto pageViewerControls--fadingBtn js-interactiveElement';
          button.setAttribute('aria-hidden', 'false');
          button.style.cursor = 'pointer';
          button.style.backgroundColor = 'rgb(28, 161, 160)';
          button.style.color = 'white';
          button.style.border = 'none';
          button.style.borderRadius = '5px';
          button.textContent = 'Turn on Grading Mode';

          chrome.storage.sync.get(['settings'], function(data) {
              const settings = data.settings || {};
              const toggleTopDetails = settings.toggleTopDetails !== false;
              const toggleAdjustments = settings.toggleAdjustments !== false;
              const toggleSidebar = settings.toggleSidebar !== false;
              const toggleActionBar = settings.toggleActionBar !== false;
              const toggleCommentsSection = settings.toggleCommentsSection !== false;
              const toggleGradingButtons = settings.toggleGradingButtons !== false;

              button.addEventListener('click', function() {
                  if (button.textContent === 'Turn on Grading Mode') {
                      button.textContent = 'Turn off Grading Mode';
                      button.style.backgroundColor = 'rgb(202, 50, 50)';

                      if (toggleTopDetails) {
                          const topDetails = document.querySelector('.submissionGraderSidebar--details');
                          if (topDetails) {
                              topDetails.style.display = 'none';
                          }
                      }

                      if (toggleAdjustments) {
                          const parentContainer = document.querySelector('.submissionGraderSidebar--adjustments');
                          if (parentContainer) {
                              const addRubricItems = parentContainer.querySelector('.form--group');
                              if (addRubricItems) {
                                  addRubricItems.style.display = 'none';
                              }
                          }
                      }

                      if (toggleSidebar) {
                          const mainWrapperElement = document.querySelector('.l-mainWrapper');
                          if (mainWrapperElement) {
                              mainWrapperElement.style.paddingLeft = '0px';
                          }

                          const sidebarElement = document.querySelector('.l-sidebar.sidebar-collapsed');
                          if (sidebarElement) {
                              sidebarElement.style.display = 'none';
                          }
                      }

                      if (toggleActionBar) {
                          const actionBar = document.querySelector('.l-actionBar');
                          if (actionBar) {
                              actionBar.style.display = 'none';
                          }
                      }

                      if (toggleCommentsSection) {
                          const commentsSection = document.querySelector('.adjustmentForm');
                          if (commentsSection) {
                              commentsSection.style.display = 'none';
                          }
                      }

                      if (toggleGradingButtons) {
                          const gradingButtons = document.querySelector('.pageViewerControls--row.pageViewerControls--row-top');
                          if (gradingButtons) {
                              gradingButtons.style.display = 'none';
                          }
                      }
                      
                  } else {
                      button.textContent = 'Turn on Grading Mode';
                      button.style.backgroundColor = 'rgb(28, 161, 160)';

                      if (toggleTopDetails) {
                          const topDetails = document.querySelector('.submissionGraderSidebar--details');
                          if (topDetails) {
                              topDetails.style.removeProperty('display');
                          }
                      }

                      if (toggleAdjustments) {
                          const parentContainer = document.querySelector('.submissionGraderSidebar--adjustments');
                          if (parentContainer) {
                              const addRubricItems = parentContainer.querySelector('.form--group');
                              if (addRubricItems) {
                                  addRubricItems.style.removeProperty('display');
                              }
                          }
                      }

                      if (toggleSidebar) {
                          const mainWrapperElement = document.querySelector('.l-mainWrapper');
                          if (mainWrapperElement) {
                              mainWrapperElement.style.removeProperty('padding-left');
                          }

                          const sidebarElement = document.querySelector('.l-sidebar.sidebar-collapsed');
                          if (sidebarElement) {
                              sidebarElement.style.removeProperty('display');
                          }
                      }

                      if (toggleActionBar) {
                          const actionBar = document.querySelector('.l-actionBar');
                          if (actionBar) {
                              actionBar.style.removeProperty('display');
                          }
                      }

                      if (toggleCommentsSection) {
                          const commentsSection = document.querySelector('.adjustmentForm');
                          if (commentsSection) {
                              commentsSection.style.removeProperty('display');
                          }
                      }

                      if (toggleGradingButtons) {
                          const gradingButtons = document.querySelector('.pageViewerControls--row.pageViewerControls--row-top');
                          if (gradingButtons) {
                              gradingButtons.style.removeProperty('display');
                          }
                      }
                  }
                  setTimeout(triggerResize, 500);
              });
          });
          container.insertBefore(button, container.firstChild);
      }
  }
}


// Dynamic Commenting // 
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


// Setting up the appropriate observers and loaders
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        proprogateComments();
      }
    });
  });

// Mapping rearrangeUI to the letter '+'
document.addEventListener('keypress', function(event) {
  if (event.key === '+') {
    event.preventDefault();
      const gradingButton = document.getElementById('gradingModeButton');
      if (gradingButton) {
          gradingButton.click();
      }
  }
});
  
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener('load', rearrangeUI);
