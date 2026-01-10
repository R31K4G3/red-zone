const audioElement = document.createElement("audio");
audioElement.src = "./audio.mp3";
audioElement.loop = true;
audioElement.preload = "auto";
audioElement.style.pointerEvents = "none";
audioElement.load();
audioElement.addEventListener("loadedmetadata", () => {
    updateCurrentTimeDisplay();
});
document.body.appendChild(audioElement);

const audioContext = new AudioContext();
const source = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();
gainNode.gain.value = 1;
source.connect(gainNode);
gainNode.connect(audioContext.destination);

const controlsSpan = document.createElement("span");
controlsSpan.style.userSelect = "none";
controlsSpan.style.background = "#222";
controlsSpan.style.display = "flex";
controlsSpan.style.padding = "7px 14px 7px 3px";
controlsSpan.style.alignItems = "center";
controlsSpan.style.width = "fit-content";
controlsSpan.style.fontFamily = "sans-serif";

const playingControl = document.createElement("input");
playingControl.type = "checkbox";
playingControl.id = "playing-control";
playingControl.style.width = "0px";
playingControl.style.height = "0px";
controlsSpan.appendChild(playingControl);

const playingDisplaylabel = document.createElement("label");
playingDisplaylabel.htmlFor = "playing-control";
const playingDisplay = document.createElement("img");
playingDisplay.src = "./play.svg";
playingDisplay.style.verticalAlign = "middle";
playingDisplay.style.width = "28px";
playingDisplay.style.height = "28px";
playingDisplay.style.padding = "0px 8px 0px 0px";
playingDisplaylabel.appendChild(playingDisplay);
controlsSpan.appendChild(playingDisplaylabel);

const currentTimeControl = document.createElement("input");
currentTimeControl.type = "range";
currentTimeControl.min = "0";
currentTimeControl.max = "1024";
controlsSpan.appendChild(currentTimeControl);

const paddingSpace = document.createElement("span");
paddingSpace.style.width = "8px";
controlsSpan.appendChild(paddingSpace);

const currentTimeDisplay = document.createElement("span");
currentTimeDisplay.textContent = "00:00 / 00:00";
currentTimeDisplay.style.fontSize = "small";
currentTimeDisplay.style.padding = "0px 8px 0px 0px";
const updateCurrentTimeDisplay = () => {
    let t = Math.round(audioElement.currentTime);
    let currentTime = `${t % 60}`.padStart(2, "0");
    t = Math.floor(t / 60);
    currentTime = `${t % 60}`.padStart(2, "0") + ":" + currentTime;
    t = Math.floor(t / 60);
    if (t) currentTime = `${t}:${currentTime}`;

    t = Math.round(audioElement.duration);
    let duration = `${t % 60}`.padStart(2, "0");
    t = Math.floor(t / 60);
    duration = `${t % 60}`.padStart(2, "0") + ":" + duration;
    t = Math.floor(t / 60);
    if (t) duration = `${t}:${duration}`;

    currentTimeDisplay.textContent = `${currentTime} / ${duration}`;
};
controlsSpan.appendChild(currentTimeDisplay);

const muteControl = document.createElement("input");
muteControl.type = "checkbox";
muteControl.id = "mute-control";
muteControl.style.width = "0px";
muteControl.style.height = "0px";
controlsSpan.appendChild(muteControl);

const muteDisplaylabel = document.createElement("label");
muteDisplaylabel.htmlFor = "mute-control";
const muteDisplay = document.createElement("img");
muteDisplay.src = "./unmuted.svg";
muteDisplay.style.verticalAlign = "middle";
muteDisplay.style.padding = "0px 7px 0px 0px";
muteDisplay.style.width = "20px";
muteDisplay.style.height = "20px";
muteDisplaylabel.appendChild(muteDisplay);
controlsSpan.appendChild(muteDisplaylabel);

const volumeControl = document.createElement("input");
volumeControl.type = "range";
volumeControl.min = "0";
volumeControl.style.width = "60px";
volumeControl.max = "1024";
controlsSpan.appendChild(volumeControl);

requestAnimationFrame(() => {
    currentTimeControl.value = "0";
    volumeControl.value = "1024";
});
document.body.appendChild(controlsSpan);

const intervalIds = [];
audioElement.addEventListener("play", () => {
    intervalIds.push(setInterval(() => {
        currentTimeControl.value = Math.round(currentTimeControl.max * (audioElement.currentTime / audioElement.duration));
        updateCurrentTimeDisplay();
    }, 60));
});
audioElement.addEventListener("pause", () => {
    for (const id of intervalIds.splice(0, intervalIds.length)) {
        clearTimeout(id);
    }
});
playingControl.addEventListener("input", () => {
    playingDisplay.src = playingControl.checked ? "./pause.svg" : "./play.svg";
    audioElement[playingControl.checked ? "play" : "pause"]();
    audioContext.resume();
});
currentTimeControl.addEventListener("input", () => {
    audioElement.currentTime = audioElement.duration * (currentTimeControl.value / currentTimeControl.max);
    updateCurrentTimeDisplay();
});
muteControl.addEventListener("input", () => {
    audioElement.muted = muteControl.checked;
    muteDisplay.src = muteControl.checked ? "./muted.svg" : "./unmuted.svg";
    if (audioElement.muted) {
        volumeControl.value = "0";
    } else {
        volumeControl.value = Math.round(gainNode.gain.value * volumeControl.max);
    }
});
volumeControl.addEventListener("input", () => {
    gainNode.gain.value = volumeControl.value / volumeControl.max;
});
