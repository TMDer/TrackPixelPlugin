


(function() {

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    message.data = TrackPixelSetupWizard.collectData(message);
    chrome.runtime.sendMessage(message, sendResponse);
  });

}());