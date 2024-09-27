/*async function loadToaster() {
  document.body.insertAdjacentHTML("beforeend", await ( await fetch( 'https://lilithdev.neocities.org/shrine/vg/nso/toast.xml' ) ).text());
}

loadToaster();*/

// script parameter
/*const namespace = "nso";*/

let achievementData;

fetch('https://lilithdev.neocities.org/achievements.json', {cache: "no-store"})
    .then((response) => response.json())
    .then((json) => {
      achievementData = json;
});

async function loadAssets(namespace) {
  const toastStyleID = "toast-style-" + namespace;
  if(!document.getElementById(toastStyleID)) {
    // Load the achievement style in advance just to preload it
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.id = toastStyleID;
    // document.currentScript.getAttribute('namespace');
    console.log(achievementData);
    console.log(namespace);
    link.href = achievementData[namespace].style;

    // Append link element to HTML head
    document.head.appendChild(link);
  }
  
  const toastTemplateID = "toast-template-" + namespace;
  if(!document.getElementById(toastTemplateID)) {
    /*fetch(achievementData[namespace].template, {cache: "no-store"})
    .then((response) => response.text())
    .then((text) => {
      document.body.insertAdjacentHTML("beforeend", "<template id=" + toastTemplateID + ">" + text + "</template>");
      //achievementTemplate = document.querySelector("#" + toastTemplateID);
    });*/
    const response = await fetch(achievementData[namespace].template, {cache: "no-store"});
    const templateData = await response.text();
    document.body.insertAdjacentHTML("beforeend", "<template id=" + toastTemplateID + ">" + templateData + "</template>");
  }
}

function hasAchievement(namespace, achievementID) {
  return window.localStorage.getItem(namespace + ":" + achievementID) === 'true';
}

function waitForAchievementData(checkInterval = 100) {
  return new Promise((resolve) => {
    if(achievementData)
      resolve();
    
    const interval = setInterval(() => {
      if (achievementData) { // or any specific condition
        clearInterval(interval); // Stop checking
        resolve(); // Resolve the promise
      }
    }, checkInterval); // Check every 'checkInterval' milliseconds
  });
}

async function getAchievement(namespace, achievementID) {
  console.log("Got " + namespace + ":" + achievementID);
  
  // You already have the achievement
  if(hasAchievement(namespace, achievementID)) {
    return;
  }
  
  // Wait for the critical data (I know, gross)
  await waitForAchievementData();
  
  // Achievement doesn't exist
  if(!(achievementID in achievementData[namespace].achievements)) {
    return;
  }
  
  window.localStorage.setItem(namespace + ":" + achievementID, true);
  
  loadAssets(namespace).then(() => {
    const achievementTemplate = document.getElementById("toast-template-" + namespace);
  
    const clone = achievementTemplate.content.cloneNode(true);

    clone.querySelector(".achievement-toast").className += " " + achievementData[namespace].achievements[achievementID].class;
    clone.querySelector(".toast-icon").src = achievementData[namespace].achievements[achievementID].icon;
    clone.querySelector(".toast-title").textContent = achievementData[namespace].achievements[achievementID].title;
    clone.querySelector(".toast-description").textContent = achievementData[namespace].achievements[achievementID].description;

    // Play the achievement SFX
    let soundToPlay;
    soundToPlay = achievementData[namespace].sfx;
    if("sfx" in achievementData[namespace].achievements[achievementID])
      soundToPlay = achievementData[namespace].achievements[achievementID].sfx;

    if(soundToPlay) {
      let pienSFX = new Audio(soundToPlay);
      pienSFX.volume = 0.2;
      pienSFX.play();
    }

    // Handle the animation
    const toast = clone.querySelector(".achievement-toast");
    setTimeout(() => {
      if(getComputedStyle(toast)["animation-name"] == "none") {
        toast.remove();
        return;
      }

      toast.style.animationDirection = "reverse";

      const elm = toast;
      var newone = elm.cloneNode(true);
      elm.parentNode.replaceChild(newone, elm);

      newone.addEventListener("animationend", (event) => {
        newone.remove();
      });
    }, 10000);

    document.body.appendChild(clone);
  });
}

/*document.onkeypress = function (e) {
  switch(e.key) {
    case "a":
      getAchievement("nso", "something");
      break;
    case "z":
      getAchievement("nso", "pien");
      break;
    case "e":
      getAchievement("nso", "touch-grass");
      break;
    case "r":
      getAchievement("nso", "404");
      break;
    case "t":
      getAchievement("nso", "nudes");
      break;
    case "y":
      getAchievement("nso", "bed");
      break;
  }
};*/

window.addEventListener("message", (e) => {
  if("achievement" in e.data) {
    getAchievement(e.data.namespace, e.data.achievement);
  }
});