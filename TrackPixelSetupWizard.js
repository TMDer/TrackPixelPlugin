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
    var productName = document.querySelectorAll(".product-text strong")[0].textContent;
    var productType = $(".breadcrumb span").text();
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
    var length = _keys.length;
    var index = _keys.indexOf(_tempStep);

    //TODO: 判斷購物或是註冊會員已設定完成
    if (index === length) {
      console.error("!!!!! error index === length");
      return _tempStep;
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

  function save(data) {
    if (isForwardPurchaseOrRegister(data.target))
      return;

    console.log("save done.");
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

  _self.process = function(data) {
    save(data);
    forward(data.target);
    return true;
  }

  _self.init = function() {
    initTrackPixelSetupWizard();
  }



  return _self;

}());
