function hasAncestorWithClass(element, className) {
    while (element) {
        if (element.classList && element.classList.contains(className)) {
            return true;
        }
        element = element.parentElement;
    }
    return false;
}

function rearrangeUI() {
    const container = document.querySelector('.tiiBtnContainer');
    if (container && !hasAncestorWithClass(container, 'submissionGraderRegradeRequest--content')) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tiiBtn tiiBtn-secondary u-pointerEventsAuto pageViewerControls--fadingBtn ';
        button.setAttribute('aria-hidden', 'false');
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'rgb(28, 161, 160)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.textContent = 'Turn on Grading Mode';
        
        button.addEventListener('click', function() {
            if (button.textContent === 'Turn on Grading Mode') {
                button.textContent = 'Turn off Grading Mode';
                button.style.backgroundColor = 'rgb(202, 50, 50)';
                
                const topDetails = document.querySelector('.submissionGraderSidebar--details');
                if (topDetails) {
                    topDetails.style.display = 'none';
                }
                
                const parentContainer = document.querySelector('.submissionGraderSidebar--adjustments');
                if (parentContainer) {
                    const addRubricItems = parentContainer.querySelector('.form--group');
                    if (addRubricItems) {
                        addRubricItems.style.display = 'none';
                    }
                }
                
                const mainWrapperElement = document.querySelector('.l-mainWrapper');
                if (mainWrapperElement) {
                    mainWrapperElement.style.paddingLeft = '0px';
                }

                const sidebarElement = document.querySelector('.l-sidebar.sidebar-collapsed');
                if (sidebarElement) {
                    sidebarElement.style.display = 'none';
                }

                const actionBar = document.querySelector('.l-actionBar');
                if (actionBar) {
                    actionBar.style.display = 'none';
                }                
            } else {
                button.textContent = 'Turn on Grading Mode';
                button.style.backgroundColor = 'rgb(28, 161, 160)';

                const topDetails = document.querySelector('.submissionGraderSidebar--details');
                if (topDetails) {
                    topDetails.style.removeProperty('display');
                }
                
                const parentContainer = document.querySelector('.submissionGraderSidebar--adjustments');
                if (parentContainer) {
                    const addRubricItems = parentContainer.querySelector('.form--group');
                    if (addRubricItems) {
                        addRubricItems.style.removeProperty('display');
                    }
                }

                const mainWrapperElement = document.querySelector('.l-mainWrapper');
                if (mainWrapperElement) {
                    mainWrapperElement.style.removeProperty('padding-left');
                }
                
                const sidebarElement = document.querySelector('.l-sidebar.sidebar-collapsed');
                if (sidebarElement) {
                    sidebarElement.style.removeProperty('display');
                }

                const actionBar = document.querySelector('.l-actionBar');
                if (actionBar) {
                    actionBar.style.removeProperty('display');
                }
            }    
        });
        container.insertBefore(button, container.firstChild);
    }
}

// Wait for the page to fully load before running the script
window.addEventListener('load', rearrangeUI);
