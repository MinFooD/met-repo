document.addEventListener("DOMContentLoaded",()=>{let e=localStorage.getItem("logoutMessage");e&&(alert(e),localStorage.removeItem("logoutMessage"));let t=document.getElementById("CheckboxLarge"),o=document.getElementById("checkboxLabel");function n(){o.textContent=t.checked?"Writer":"Reader"}t.addEventListener("change",n),n()});
//# sourceMappingURL=index.221b8ae7.js.map
