document.addEventListener('DOMContentLoaded', function() {
    //Fetch settings
    chrome.storage.sync.get(['settings'], function(data) {
        if (data.settings) {
            document.getElementById('toggleTopDetails').checked = data.settings.toggleTopDetails || false;
            document.getElementById('toggleAdjustments').checked = data.settings.toggleAdjustments || false;
            document.getElementById('toggleSidebar').checked = data.settings.toggleSidebar || false;
            document.getElementById('toggleActionBar').checked = data.settings.toggleActionBar || false;
            document.getElementById('toggleCommentsSection').checked = data.settings.toggleCommentsSection || false;
            document.getElementById('toggleGradingButtons').checked = data.settings.toggleGradingButtons || false;
        }
    });

    //On click, save the settings
    document.getElementById('saveSettings').addEventListener('click', function() {
        const settings = {
            toggleTopDetails: document.getElementById('toggleTopDetails').checked,
            toggleAdjustments: document.getElementById('toggleAdjustments').checked,
            toggleSidebar: document.getElementById('toggleSidebar').checked,
            toggleActionBar: document.getElementById('toggleActionBar').checked,
            toggleCommentsSection: document.getElementById('toggleCommentsSection').checked,
            toggleGradingButtons: document.getElementById('toggleGradingButtons').checked
        };
        // Also display the refresh message
        chrome.storage.sync.set({ settings: settings }, function() {
            console.log('Settings saved');
            refreshMessage = document.getElementById('refreshMessage');
            refreshMessage.style.display = 'block';
        });
    });
});
