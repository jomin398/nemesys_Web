import { sfxAudioMap } from '../keyMap/mainMap.js';

function playSfx(p) {
  let el = document.querySelector(`audio#${p}`);
  if (p == 'sfx_c' || p == 'sfx_d') el.volume = 0.8;
  el.currentTime = 0;
  el.play();
}
export function getSelectedKeyActions(k, isOut) {
  console.log()
  const effect = Object.assign({}, sfxAudioMap)
  // "btn<k>option" 클래스의 객체를 가져옴
  var options = document.getElementById("btn" + k + "option");

  // 선택된 값을 찾아 반환
  for (var i = 0; i < options.length; i++) {
    if (options[i].selected) {
      let v = options[i].value;
      if (v.includes('sfx')) {
        playSfx(sfxAudioMap[v]);
      }
      return v;
    }
  }

  // 선택된 값이 없으면 null 반환
  return null;
}