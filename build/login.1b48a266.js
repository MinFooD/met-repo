var e=globalThis,t={},o={},n=e.parcelRequire94c2;null==n&&((n=function(e){if(e in t)return t[e].exports;if(e in o){var n=o[e];delete o[e];var r={id:e,exports:{}};return t[e]=r,n.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){o[e]=t},e.parcelRequire94c2=n),(0,n.register)("kxgSl",function(e,t){async function o(){let e=document.getElementById("username").value,t=document.getElementById("password").value;console.log(window.config.apiBaseUrl),await n({username:e,password:t})}async function n(e){try{let t=await fetch(`https://${window.config.apiBaseUrl}/api/Auth/Login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),o=await t.json();o.userName&&localStorage.setItem("loginName",o.userName),o.jwtToken?(localStorage.setItem("jwtToken",o.jwtToken),window.location.href="/",o.userId&&localStorage.setItem("userId",o.userId)):(console.log("No Token! Please check."),document.getElementById("errorMessage").textContent="Token Failed")}catch(e){console.error("Error:",e),document.getElementById("errorMessage").textContent="Login failed!"}}async function r(){let e=document.getElementById("username").value,t=document.getElementById("password").value,o=document.getElementById("CheckboxLarge").checked?["writer"]:["reader"];if(!e||!t){alert("Username and password cannot be empty.");return}var n={userName:e,password:t,roles:o};try{let e=await OneSignal.getUserId();if(e)n.playerId=e;else{console.log("No Player ID found. Requesting permission...");let e=await OneSignal.getNotificationPermission();("default"===e||"denied"===e)&&await OneSignal.showNativePrompt()}let t=await OneSignal.getUserId();t&&(n.playerId=t,console.log("Player ID after prompt:",t)),await a(n)}catch(e){console.error("Error getting playerId from OneSignal:",e)}}async function a(e){try{let t=await fetch(`https://${window.config.apiBaseUrl}/api/Auth/Register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(t.ok){let e=await t.json(),o=e.userId;o?(localStorage.setItem("userId",o),console.log("Registration Successful:",e.message),alert(e.message),await l(o),window.location.href="/login"):(alert("Registration failed. No userId received."),console.error("No userId in the response."))}else{let e=await t.text();alert("Registration failed. Please check your permissions."),console.error("Failed to register:",e)}}catch(e){alert("Load data failed, please check your connection to the backend."),console.error("Error:",e)}}async function l(e){try{"undefined"!=typeof OneSignal&&e&&(await OneSignal.setExternalUserId(e),console.log(`Linked userId ${e} to OneSignal`))}catch(e){console.error("Error linking userId to OneSignal:",e)}}async function i(){try{await OneSignal.removeExternalUserId(),console.log("Removed external user ID from OneSignal")}catch(e){console.error("Error removing external user ID from OneSignal:",e)}localStorage.clear(),localStorage.setItem("logoutMessage","Logout succeeded!"),window.location.href="/login"}Object.defineProperty(e.exports,"logout",{get:()=>i,set:void 0,enumerable:!0,configurable:!0}),document.addEventListener("DOMContentLoaded",()=>{let e=localStorage.getItem("logoutMessage");e&&(alert(e),localStorage.removeItem("logoutMessage"));let t=document.getElementById("CheckboxLarge"),o=document.getElementById("checkboxLabel");function n(){let e=t.checked?"Writer":"Reader";o.textContent!==e&&(o.textContent=e)}null!=t&&(t.addEventListener("change",n),n())});let s={Register:a,login:n,callLogin:o,callRegister:r};Object.keys(s).forEach(e=>{window[e]=s[e]})}),n("kxgSl");
//# sourceMappingURL=login.1b48a266.js.map