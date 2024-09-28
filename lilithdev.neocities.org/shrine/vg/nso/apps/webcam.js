const bgNode = document.getElementById("bg");
const ameNode = document.getElementById("ame");
const heartsNode = document.getElementById("hearts");
const patNode = document.getElementById("headpat-hitbox");
const bedDark = document.getElementById("bed-dark");

const audioPat = new Audio('https://files.catbox.moe/3h5rzj.wav');
const audioBed = new Audio('https://files.catbox.moe/6qhjx1.wav');
//https://files.catbox.moe/pw8l8n.wav

let globalVolume = 20;
const params = new URLSearchParams(window.location.search);
const paramVolume = params.get("volume");
if(paramVolume)
    globalVolume = paramVolume;

const amePortrait = {
    normal: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/lslald_idle.gif",
    happy: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/lslald_happy.gif",
    getup: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/get_up.gif",
    banger: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/banger.gif",
    handspinner: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/handspinner.gif",
    selfie: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/selfie.gif",
    manga: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/manga.gif",
    movie: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/movie.gif",
    gaming: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/ame/gaming.gif",
    /*stress: {
        low: {
            affection: {
                low: {
                    darkness: {
                        normal: "",
                        happy: ""
                    }
                }
            }
        }
    }*/
}

let firstMusic = false;
const animations = {
    idle: {
        trigger: () => updateAmePortraitUrl(amePortrait.normal),
        priority: 0
    },
    happy: {
        trigger: () => updateAmePortraitUrl(amePortrait.happy),
        priority: 3
    },
    leave: {
        trigger: () => {
            updateAmePortraitUrl(amePortrait.getup);
        },
        priority: 5
    },
    gaming: {
        trigger: () => {
            updateAmePortraitUrl(amePortrait.gaming);
            setTimeout(() => {
                if(isAnimation("gaming"))
                    setAnimation("idle", true);
            }, 20000);
        },
        priority: 5
    },
    movie: {
        trigger: () => {
            updateAmePortraitUrl(amePortrait.movie);
            setTimeout(() => {
                if(isAnimation("movie"))
                    setAnimation("idle", true);
            }, 20000);
        },
        priority: 5
    },
    bed: {
        trigger: () => {
            updateAmePortraitUrl(amePortrait.getup);
            const maxRatio = 0.8;
            const amountOfTime = 400;
            let timeCounter = 0;
            var fadeTimer = setInterval(() => {
                if (timeCounter >= amountOfTime)
                    clearInterval(fadeTimer);
                bedDark.style.opacity = timeCounter/amountOfTime*maxRatio;
                timeCounter += 10;
            }, 10);
            setTimeout(() => {
                heartsNode.style.display = "initial";
                heartsNode.src = heartsNode.src;
                bgNode.classList.add("shake");
                let bedCount = 0;
                playSound(audioBed);
                let bedTimer = setInterval(() => {
                    playSound(audioBed);
                    bedCount++;
                    if(bedCount > 8) {
                        clearInterval(bedTimer);
                        setTimeout(() => {
                            heartsNode.style.display = "none";
                            bedDark.style.opacity = 0;
                            setAnimation("idle", true);
                            bgNode.classList.remove("shake");
                        }, 333);
                    }
                }, 333);
            }, 2200);
        },
        priority: 5
    },
    banger: {
        trigger: () => {
            if(firstMusic)
                updateAmePortraitUrl(amePortrait.banger);
            else
                firstMusic = true;
            /*setTimeout(() => {
                if(isAnimation("banger"))
                    setAnimation("idle", true);
            }, 10000);*/
        },
        priority: 0
    },
    handspinner: {
        trigger: () => {
            updateAmePortraitUrl(amePortrait.handspinner);
            setTimeout(() => {
                if(isAnimation("handspinner"))
                    setAnimation("idle", true);
            }, 20000 + Math.random() * 40000);
        },
        priority: 2
    },
    selfie: {
        trigger: () => {
            updateAmePortraitUrl(amePortrait.selfie);
            setTimeout(() => {
                if(isAnimation("selfie"))
                    setAnimation("idle", true);
            }, 8000 + Math.random() * 12000);
        },
        priority: 2
    }
}

let currentAnimation = animations.idle;
function setAnimation(name, force) {
    let newAnimation = animations[name];
    if(!newAnimation)
        return false;
    
    if(currentAnimation.priority < newAnimation.priority || force) {
        currentAnimation = newAnimation;
        currentAnimation.trigger();
        return true;
    }

    return false;
}

function isAnimation(name) {
    return animations[name] && animations[name] === currentAnimation;
    /*console.log(currentAnimation);
    return currentAnimation.id === name;*/
}

function playSound(sound, volume = 1) {
    let audioClone = sound.cloneNode(false);
    audioClone.volume = volume * globalVolume / 100;
    audioClone.addEventListener("ended", function(){
        audioClone.remove();
    });
    audioClone.play();
}

let happinessInterval;
patNode.addEventListener("click", (e) => {
    //updateAmePortraitUrl(amePortrait.happy);
    if(!setAnimation("happy", false) && !isAnimation("happy"))
        return;

    if(happinessInterval != null)
        clearInterval(happinessInterval);

    playSound(audioPat, 0.8);
    
    happinessInterval = setTimeout(() => {
        //updateAmePortraitUrl(amePortrait.normal);
        if(isAnimation("happy"))
            setAnimation("idle", true);
    }, 10000);
    
    // Achievement stuff
    progressAchievement();
});

function updateAmePortraitUrl(url) {
    if(!ameNode.src.includes(url))
        ameNode.src = url;
}

function progressAchievement() {
  const storageID = "ame-pat-counter";
  if (localStorage.getItem(storageID) === null)
    window.localStorage.setItem(storageID, 0);
  
  let value = parseInt(window.localStorage.getItem(storageID)) + 1;
  window.localStorage.setItem(storageID, value);
  
  let achievement;
  if(value == 5) {
    achievement = "needy1";
  }
  if(value == 25) {
    achievement = "needy2";
  }
  if(value == 75) {
    achievement = "needy3";
  }
  if(value == 200) {
    achievement = "needy4";
  }
  if(value == 500) {
    achievement = "needy5";
  }
  if(achievement) {
    window.top.postMessage({
      namespace: "nso",
      achievement: achievement
    }, "*");
  }
  
  /*window.top.postMessage({
    namespace: "nso",
    achievement: "needy-girl"
  }, "*");*/
  //parseInt('123')  
}

window.addEventListener("message", (e) => {
    if("volume" in e.data) {
        globalVolume = e.data.volume;
        return;
    }

    setAnimation(e.data.animation, e.data.force);
});

const randomIdle = () => {
    setTimeout(() => {
        if (Math.random() >= 0.5)
            setAnimation("selfie", false);
        else
            setAnimation("handspinner", false);
        randomIdle();
    }, 50000 + Math.random() * 50000);
};
randomIdle();