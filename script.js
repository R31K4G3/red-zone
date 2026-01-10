const pauseSvg = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>')}`;
const playSvg = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M8 5v14l11-7z" /></svg>')}`;
const mutedSvg = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>')}`;
const unmutedSvg = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>')}`;

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
playingDisplay.src = playSvg;
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
muteDisplay.src = unmutedSvg;
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
    playingDisplay.src = playingControl.checked ? pauseSvg : playSvg;
    audioElement[playingControl.checked ? "play" : "pause"]();
    audioContext.resume();
});
currentTimeControl.addEventListener("input", () => {
    audioElement.currentTime = audioElement.duration * (currentTimeControl.value / currentTimeControl.max);
    updateCurrentTimeDisplay();
});
muteControl.addEventListener("input", () => {
    muteDisplay.src = muteControl.checked ? mutedSvg : unmutedSvg;
    audioElement.muted = muteControl.checked;
    if (audioElement.muted) {
        volumeControl.value = "0";
    } else {
        volumeControl.value = Math.round(gainNode.gain.value * volumeControl.max);
    }
});
volumeControl.addEventListener("input", () => {
    if (+volumeControl.value) {
        audioElement.muted = false;
        muteControl.checked = false;
        muteDisplay.src = unmutedSvg;
        gainNode.gain.value = volumeControl.value / volumeControl.max;
    } else {
        audioElement.muted = true;
        muteControl.checked = true;
        muteDisplay.src = mutedSvg;
        gainNode.gain.value = 0.5;
    }
});
