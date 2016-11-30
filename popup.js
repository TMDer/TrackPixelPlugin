


function getTargetByBtnClassName(btnClassName) {
  return btnClassName.replace(/.*-(.*)-btn/,"$1");
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

function initSetupWizardBtns(div, currentSetupWizard) {
  var setupWizardBtns = div.querySelectorAll("button");
  var divId = div.id;

  for (var index = 0; index < setupWizardBtns.length; index++) {

    var setupWizardBtn = setupWizardBtns[index];

    setupWizardBtn.addEventListener("click", function () {
      var btnClassName = this.className;
      var target = getTargetByBtnClassName(btnClassName);
      triggerContentScriptUpdateSetupWizard(divId, target, showSetupWizard);

    });

  }

  if (currentSetupWizard.currentStep !== "setup-wizard-start-view")
    return;

  if (currentSetupWizard._isPurchaseDone)
    setupWizardBtns[0].style.background='yellow';

  if (currentSetupWizard._isRegisterDone)
    setupWizardBtns[1].style.background='yellow';

}

function isEditView(value) {
  return typeof value === "object";
}

function generateEditView(currentSetupWizard, div) {
  var keys = Object.keys(currentSetupWizard.data);
  var eleUl = document.createElement("ul");

  for (var index = 0; index < keys.length; index++) {
    var key = keys[index];
    var data = currentSetupWizard.data[key];

    var eleLi = document.createElement("li");
    var textNode = document.createTextNode(key + " : " + data);
    eleLi.appendChild(textNode);
    eleUl.appendChild(eleLi);
  }

  div.insertBefore(eleUl, div.firstElementChild);
}

function showView(currentSetupWizard) {
  var elementId = currentSetupWizard.currentStep;
  var div = document.getElementById(elementId);
  div.style.display = "block";

  if (isEditView(currentSetupWizard.data)) {
    generateEditView(currentSetupWizard, div);
  }

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
  initSetupWizardBtns(div, currentSetupWizard);
}

function showSetupWizard() {
  chrome.runtime.sendMessage({action: "showSetupWizard"}, initView);
}

document.addEventListener("DOMContentLoaded", function() {
  showSetupWizard();
});
