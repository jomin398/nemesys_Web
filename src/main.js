import ARenderer from "./aRenderer.js";
import MuxNode from "./muxNode.js";
import getMediaData from "./lib/getMediaData.js";
import goFullScreen from "./lib/goFullScreen.js";
import getUrlEncoded from "./lib/getURLEncoded.js";
import addKeyEvent from "./addKeyEvent.js";
import knobDomInit from "./knob/index.js";
import BpmCounter from "./bpmCounter.js";
import Metronome from "./metronome.js";
export const isMobile = navigator.userAgentData.mobile;
import { keyMap, editorKeyMap, sfxAudioMap } from "../keyMap/mainMap.js";
import { HPF, LPF, TranceGate } from "./effecter/index.js";
await new Promise(r => window.onload = () => r(1));

function playSfx(p) {

  let el = document.querySelector(`audio#${p}`);

  if (p == 'sfx_c' || p == 'sfx_d') el.volume = 0.8;
  el.currentTime = 0;
  el.play();
}

// Log events flag

var logEvents = false;

let hiPass = null;
let lowPass = null;
let tGate = null;
export function getSelectedKeyActions(k, isOut) {
  //console.log(tGate.onButtonDown)
  const effect = Object.assign({}, sfxAudioMap)
  // "btn<k>option" 클래스의 객체를 가져옴
  var options = document.getElementById("btn" + k + "option");

  // 선택된 값을 찾아 반환
  for (var i = 0; i < options.length; i++) {
    if (options[i].selected) {
      let v = options[i].value;
      if (v.includes('sfx')) {
        playSfx(sfxAudioMap[v]);
      } else if (v.includes('tGate_') && !isOut) {
        v = v.replace('tGate_', '');
        tGate.onButtonDown(v)
      } else if (v.includes('tGate_') && isOut) {

        v = v.replace('tGate_', '');

        tGate.onButtonUp(v)
      }
      return v;
    }
  }

  // 선택된 값이 없으면 null 반환
  return null;
}

let form = document.getElementsByTagName('form')[0];
const getFormProp = form => Object.fromEntries(new FormData(form));
let selectElm = document.querySelector('form #songs');
selectElm.onchange = function () {
  let upload = form.querySelector('input[type=file]');
  let url = form.querySelector('input[type=text]');
  if (this.value == 'null') {
    upload.style.display = 'block';
    url.style.display = 'none';
  } else if (this.value == 'url') {
    upload.style.display = 'none';
    url.style.display = 'block';
  } else {
    upload.style.display = 'none';
    url.style.display = 'none';
  }
}
selectElm.onchange();
//form process
form.onsubmit = () => {
  const formProps = getFormProp(form);
  // Case 1: User selects 'null' from option and uploads a file.
  if (formProps.songs == "null") {
    if (!formProps.upload || formProps.upload.size == 0) {
      alert("Please upload a file.");
      form.querySelector('input[type=file]').focus();
      return false;
    }
  }
  // Case 2: User selects 'url' from option and inputs a URL in the text field.
  else if (formProps.songs == "url") {
    if (!formProps.url || formProps.url.trim() == "") {
      alert("Please provide a URL.");
      form.querySelector('input[type=text]').focus();
      return false;
    }
  }

  // If the validation passes, the form submission continues.
  return true;
};
await new Promise(r => {
  window.FormAct = () => r(true);
  form.action = 'javascript:FormAct()';
});
goFullScreen();
form.classList.add('hide');
document.querySelector(".gitRibbon").classList.add('hide');
//audioFile and path process
const audioPath = await (async form => {
  const formProps = getFormProp(form);
  let audioPath;
  let audioFile;

  // Case 1: User selects 'null' from option and uploads a file.
  if (formProps.songs == "null" && formProps.upload) {
    audioPath = URL.createObjectURL(formProps.upload);
    audioFile = formProps.upload;
  }
  // Case 2: User selects 'url' from option and inputs a URL in the text field.
  else if (formProps.songs == "url" && formProps.url) {
    audioPath = formProps.url;
    audioFile = await (await fetch(formProps.url)).blob();
  }
  // Case 3: User selects an option.
  else {
    audioPath = formProps.songs;
    audioFile = await (await fetch(formProps.songs)).blob();
  }

  // Make sure to handle the case where neither a file nor a URL is provided by the user.
  if (!audioPath || !audioFile) {
    console.warn("Neither a file nor a URL was provided. Unable to proceed.");
  }

  await getMediaData(audioFile)
    .then(data => {
      let { title, artist, pUrl } = data;
      const elems = document.querySelector('.audio-title').children;
      if (title) { elems[0].innerText = title } else {

        elems[0].innerText = decodeURI(getUrlEncoded(audioPath.split("/").pop().replace('.mp3', "")));
      }
      if (artist) elems[1].innerText = artist;
      if (pUrl) {
        const elm = document.querySelector('.audio-jck');
        elm.classList.remove('nojck');
        elm.style.backgroundImage = `url(${pUrl})`;
      }
    });
  return audioPath;
})(form);

export const { LCW, LCCW, RCW, RCCW, kStats: knobStats } = knobDomInit([".knobBody.knobLeft", ".knobBody.knobRight"],
  (value, step, max) => hiPass.onKnob(value, step, max), (value, step, max) => lowPass.onKnob(value, step, max));
keyMap.onchange = function (newSetting) {
  addKeyEvent(logEvents, newSetting, knobStats);
}
const audioElem = document.querySelector("audio#bgm");
const aCtx = new AudioContext();
let muxNode = new MuxNode(aCtx, 2);
const wavesurfer = new ARenderer(audioElem, {
  container: '#waveform',
  waveColor: 'violet',
  progressColor: 'violet',
  cursorColor: 'transparent',
  backend: 'MediaElementWebAudio',
  minPxPerSec: 400,
  //barWidth: 5,
  height: 320,
  hideScrollbar: true,
  interact: false,
  url: audioPath,
  aCtx,
  onReady: function () {
    console.log("onReady")
    let snode = aCtx.createMediaElementSource(audioElem);
    // HPF를 생성하고 활성화함
    hiPass = new HPF(snode, aCtx, null);
    // LPF를 생성하고 hiPass의 biquadFilter 출력에 연결함
    lowPass = new LPF(hiPass.biquadFilter, aCtx, null);
    hiPass.destinationNode = lowPass.biquadFilter;
    hiPass.activateFilter();

    tGate = new TranceGate().init(document.querySelector('.tranceGateWrap'), aCtx);
    tGate.effect.snode = aCtx.createGain();
    lowPass.destinationNode = tGate.effect.snode;

    //lowPass.biquadFilter;
    let outnode = tGate.effect.connect();
    outnode.connect(aCtx.destination)
    lowPass.activateFilter();
    document.querySelector('#MPPS').innerText = wavesurfer.options.minPxPerSec;
  },
  onLoading: function (percentage) {
    console.log("Loading " + percentage + "%")
  }
});

const states = {
  configEntered: false
}

export function STButtonHandler() {
  if (!states.configEntered && wavesurfer.media.paused) {
    wavesurfer.media.play();
  } else if (!states.configEntered && !wavesurfer.media.paused) {
    wavesurfer.media.pause();
  }
};

if (isMobile) {
  knobStats.mobFuns.push(() => {
    const STBTNPushed = document.querySelector(".st._button").classList.contains("active");
    if (STBTNPushed && (knobStats.l.rotate == 2 || knobStats.r.rotate == 2))
      console.log("BPM++");
    if (STBTNPushed && (knobStats.l.rotate == 1 || knobStats.r.rotate == 1))
      console.log("BPM--");
  })
}

let storedKeyHandlers = {}; // 잠시 비활성화된 핸들러를 저장하는 객체
new BpmCounter().init(document.querySelector('.bpmCountWrap'));
export function enterEditor() {
  if (states.configEntered) return;
  console.log('Config');
  states.configEntered = true;
  const configElm = document.querySelector('.sysConfigs');
  configElm.classList.toggle('hide');
  storedKeyHandlers = { ...keyMap.handlers }; // 활성화된 핸들러를 저장
  keyMap.handlers = editorKeyMap;
  //if (tGate.effect.enable) tGate.effect.toggle();
  keyMap.onchange(keyMap);

}

export function exitEditor() {
  keyMap.handlers = { ...storedKeyHandlers }; // 저장된 핸들러를 다시 활성화
  storedKeyHandlers = {}; // 저장 객체를 초기화
  keyMap.onchange(keyMap);
  states.configEntered = false;
  const configElm = document.querySelector('.sysConfigs');
  configElm.classList.toggle('hide');
  console.log('Editor closed');
}
addKeyEvent(logEvents, keyMap, knobStats);
new Metronome();