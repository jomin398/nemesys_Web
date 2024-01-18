import { LCW, LCCW, RCW, RCCW, enterEditor, STButtonHandler, exitEditor } from '../src/main.js';
import { getSelectedKeyActions } from "../src/main.js";
export const keyMap = {
    isMobile: navigator.userAgentData.mobile,
    keyList: ["S", "D", "K", "L", "C", "M", "Q", "W", "O", "P", "ENTER"],
    handlers: {
        "keyPress_S": {
            combo: ["S"], callBack: function () {
                console.log('S', getSelectedKeyActions("S"));
            }
        },
        "keyPress_D": {
            combo: ["D"], callBack: function () {
                console.log('D', getSelectedKeyActions("D"));
            }
        },
        "keyPress_K": {
            combo: ["K"], callBack: function () {
                console.log('K', getSelectedKeyActions("K"));
            }
        },
        "keyPress_L": {
            combo: ["L"], callBack: function () {
                console.log('L', getSelectedKeyActions("L"));
            }
        },
        "keyPress_C": {
            combo: ["C"], callBack: function () {
                console.log('C', getSelectedKeyActions("FXL"));
            },
            onEnd: function () {
                getSelectedKeyActions("FXL", true);
            }
        },
        "keyPress_M": {
            combo: ["M"], callBack: function () {
                console.log('M', getSelectedKeyActions("FXR"));
            },
            onEnd: function () {
                getSelectedKeyActions("FXR", true);
            }
        },
        "keyPress_ST": {
            combo: ["ENTER"], callBack: STButtonHandler
        },
        "keyPress_Q": {
            combo: ["Q"], callBack: function () {
                LCCW();
            }
        },
        "keyPress_W": {
            combo: ["W"], callBack: function () {
                LCW();
            }
        },
        "keyPress_O": {
            combo: ["O"], callBack: function () {
                RCCW();
            }
        },
        "keyPress_P": {
            combo: ["P"], callBack: function () {
                RCW();
            }
        },
        "Config": {
            combo: ["ENTER", "C"], callBack: enterEditor
        },
        "bpmUPL": {
            combo: ["ENTER", "W"], callBack: function () {
                console.log("bpm++")
            }
        },
        "bpmUPR": {
            combo: ["ENTER", "P"], callBack: function () {
                console.log("bpm++")
            }
        },

        "bpmDownL": {
            combo: ["ENTER", "Q"], callBack: function () {
                console.log("bpm--")
            }
        },
        "bpmDownR": {
            combo: ["ENTER", "O"], callBack: function () {
                console.log("bpm--")
            }
        },
    },
    onLeftKnob:null,
    onchange: null
    // 여기에 추가적인 키 조합과 함수를 추가할 수 있습니다.
};

export const editorKeyMap = {
    "keyPress_CM": {
        combo: ["C", "M"],
        callBack: exitEditor
    }
}

export const sfxAudioMap={
  tap_sfx1:"sfx_a",
  tap_sfx2:"sfx_b",
  tap_sfx3:"sfx_c",
  tap_sfx4:"sfx_d"
};