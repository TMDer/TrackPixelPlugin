/* life in the browser  */
(function() {

  TrackPixelSetupWizard.init();

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    var action = message.action;

    switch(action) {

      case "showSetupWizard":
        sendResponse(TrackPixelSetupWizard.getCurrentStep());
        break;

      case "process":
        var isDone = TrackPixelSetupWizard.process(message);
        sendResponse(isDone);
        break;
    }
  });
}());