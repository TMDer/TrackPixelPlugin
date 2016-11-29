


//TODO: refactor action name by regexp
function getTargetByBtnClassName(btnClassName) {
  btnClassName = btnClassName || "setup-wizard-purchase-btn";

  return "purchase";
}

function triggerContentScriptUpdateSetupWizard(currentView, target, cb) {
  var message = {
    action: "process",
    target: target,
    currentView: currentView
  };

  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, cb);
  });
}

function initSetupWizardBtns(div) {
  var setupWizardBtns = div.querySelectorAll("button");
  var divId = div.id;

  for (var index = 0; index < setupWizardBtns.length; index++) {
    var setupWizardBtn = setupWizardBtns[index];
    var btnClassName = setupWizardBtn.className;
    var target = getTargetByBtnClassName(btnClassName);

    setupWizardBtn.addEventListener("click", function () {
      triggerContentScriptUpdateSetupWizard(divId, target, showSetupWizard);
    });

  }
}

function showView(currentSetupWizard) {
  var elementId = currentSetupWizard.currentStep;
  var div = document.getElementById(elementId);
  div.style.display = "block";
  return div;
}

function hideAllView() {
  var parentDiv = document.getElementById("view");
  var views = parentDiv.getElementsByTagName("div");

  for (var index = 0; index < views.length; index++) {
    var view = views[index];
    view.style.display = "none";
  }

}

function initView(currentSetupWizard) {
  hideAllView();
  var div = showView(currentSetupWizard);
  initSetupWizardBtns(div);
}

function showSetupWizard() {
  chrome.runtime.sendMessage({action: "showSetupWizard"}, initView);
}

document.addEventListener("DOMContentLoaded", function() {
  showSetupWizard();
});
