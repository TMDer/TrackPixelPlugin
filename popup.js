var elemView = document.getElementById("view");
var elemViewMemberRegist = document.getElementById("viewMemberRegist");
var elemRegister = document.getElementById("register");


function showMemberGuide() {
  elemView.style.display = 'none';
  elemViewMemberRegist.style.display = 'block';
}

function initMemberRegist() {
  elemRegister.addEventListener("click", showMemberGuide);
}

initMemberRegist();