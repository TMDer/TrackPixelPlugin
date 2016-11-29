/**
 * TrackPixelSetupWizard
 *
 * @author Allen Tien
 * @version 1.0
 */
var TrackPixelSetupWizard = (function() {
  var _isPurchaseDone = false;
  var _isRegisterDone = false;
  var _tempStep = "setup-wizard-start-view";
  var _currentSetupWizard = null;
  var _target = "";

  var _data = {
    "setup-wizard-start-view": false,
    "purchase": {
      "setup-wizard-product0-view": false,
      "setup-wizard-product1-view": false,
      "setup-wizard-product-edit": null,
      "setup-wizard-product-selector": null,
      "setup-wizard-checkout-flow-view": false,
      "setup-wizard-checkout-flow-edit": null,
      "setup-wizard-checkout-flow-next-step-view": false,
      "setup-wizard-checkout-flow-next-step-edit": null,
      "setup-wizard-purchase-edit": null,
    },
    "register":{
      "setup-wizard-register-view": false,
      "setup-wizard-register-edit": null,
    }
  }

  var _processfunctions = {
    "setup-wizard-product1-view": collectProduct
  }

  var _keys = Object.keys(_data);

  var _self = {};


  /** ====================================================================
   **                 private method for selector
   ** ====================================================================
   */

  function collectProduct() {

    function getProductType(selector) {
      var nodeList = document.querySelectorAll(selector);
      var result = "";
      var node = null;

      for (var index = 0; index < nodeList.length; index++) {
        node = nodeList[index];
        result = result.concat(node.textContent);
      }

      return result;
    }

    var productName = document.querySelectorAll(".product-text strong")[0].textContent;

    var productType = getProductType(".breadcrumb span");
    var price = document.querySelectorAll(".price-2 span")[1].textContent;
    document.getElementsByClassName("btn btn-red btn-mm shopping-btn")[0].style.border="blue 10px solid";
    document.getElementsByClassName("btn btn-gray btn-mm favorites-btn")[0].style.border="yellow 10px solid";

    var result = {
      productId: "1111",
      productName: productName,
      productType: productType,
      price: price,
      shoppingCart: "blue",
      favorites: "yellow"
    }

    return result;
  }


  /** ====================================================================
   **                 private method
   ** ====================================================================
   */

  function initCurrentSetupWizard(tempStep) {
    var flow = _data[_target];
    var data = "";

    if (flow)
      data = flow[tempStep];
    else
      data = _data[tempStep];

    _currentSetupWizard = {
      currentStep: tempStep,
      data: data
    }
  }

  function getNextStep() {
    var length = _keys.length - 1;
    var index = _keys.indexOf(_tempStep);

    if (index === length) {
      if (length > 3)
        _isPurchaseDone = true;
      else
        _isRegisterDone = true;
      return "setup-wizard-start-view";
    }

    return _keys[index + 1];
  }

  function forward(target) {

    if (isForwardPurchaseOrRegister(target)) {
      _target = target;
      _keys = Object.keys(_data[target]);
    }

    var nextStep = getNextStep();
    _tempStep = nextStep;
    initCurrentSetupWizard(_tempStep);
  }

  function initTrackPixelSetupWizard() {
    var localStorageData = localStorage.getItem("trackPixelSetupWizard");

    if (!localStorageData) {
      initCurrentSetupWizard(_tempStep);
      return;
    }
    //
    // var tmpCurrentStep = localStorageData.currentStep;
    // _currentSetupWizard = _setupStep[currentStep];
    // _currentSetupWizard.data = localStorageData.data[tmpCurrentStep];
    // _setupWizard = localStorageData;
  }

  function save(message) {
    if (isForwardPurchaseOrRegister(message.target))
      return;

    _data[_target][_tempStep] = message.data;
    initCurrentSetupWizard(_tempStep);
  }

  function isForwardPurchaseOrRegister(target) {
    return _data[target]
  }


  /** ====================================================================
   **                 public method for inject.js
   ** ====================================================================
   */

  _self.collectData = function(message) {
    var collect = _processfunctions[message.currentView];

    if (!collect) return;

    return collect();
  }



  /** ====================================================================
   **                 public method for background.js
   ** ====================================================================
   */

  _self.getCurrentStep = function() {
    return _currentSetupWizard;
  }

  _self.process = function(message) {
    forward(message.target);
    save(message);

    if(_tempStep.includes("selector"))
      forward(message.target);

    return true;
  }

  _self.init = function() {
    initTrackPixelSetupWizard();
  }



  return _self;

}());
