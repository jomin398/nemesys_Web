export default function knobDomInit(knobSelectors = [".knobBody.knobLeft", ".knobBody.knobRight"], onLeftKnob, onRightKnob) {
    const { KnobWidth, KnobHeight } = (sel => {
        const KnobElm = getComputedStyle(document.querySelector(sel));
        return { KnobWidth: parseFloat(KnobElm.width), KnobHeight: parseFloat(KnobElm.height) }
    })(knobSelectors[0])
    let _knobsetup = {
        width: KnobWidth,
        height: KnobHeight,
        fgColor: "#FFFFFF",
        bgColor: '#9AF6FD',
        _stap: 1,
        min: 0,
        max: 10,
        cursor: 20,
        displayInput: false,
        thickness: 0.3,
    }
    let kStap = _knobsetup.stap ?? 1;
    let KL = $(knobSelectors[0]);
    let KR = $(knobSelectors[1]);
    const kStats = {
        l: {
            rotate: 0,
            preV: 0,
            value: 0
        },
        r: {
            rotate: 0,
            preV: 0,
            value: 0
        },
        mobFuns: [],
    }
    /**
     * Left Knob on Clock Wise Rotate.
     * @returns {string} knob value
     */
    let LCW = () => {
        let v = Number(KL.val());
        if (v == _knobsetup.max) {
            KL.val(_knobsetup.min).trigger("change");
        } else {
            KL.val(v + kStap).trigger("change");
        }
        v = Number(KL.val());
        KL[0].parentElement.querySelector('span').innerText = Math.floor(v);
        // console.log(KL)
        kStats.l.rotate = 2;
        kStats.l.value = v;
        if (onLeftKnob) onLeftKnob(v, _knobsetup._stap, _knobsetup.max);
        return KL.val();
    }
    /**
     * Left Knob on Counter Clock Wise Rotate.
     * @returns {string} knob value
     */
    let LCCW = () => {
        let v = Number(KL.val());
        if (v == _knobsetup.min) {
            KL.val(_knobsetup.max).trigger("change");
        } else {
            KL.val(v - kStap).trigger("change");
        }
        v = Number(KL.val());
        KL[0].parentElement.querySelector('span').innerText = Math.floor(v);
        kStats.l.rotate = 1;
        kStats.l.value = v;
        if (onLeftKnob) onLeftKnob(v, _knobsetup._stap, _knobsetup.max);
        return KL.val();
    };
    /**
     * Right Knob on Counter Clock Wise Rotate.
     * @returns {string} knob value
     */
    let RCW = () => {
        let v = Number(KR.val());
        if (v == _knobsetup.max) {
            KR.val(_knobsetup.min).trigger("change");
        } else {
            KR.val(v + kStap).trigger("change");
        }
        v = Number(KR.val());
        KR[0].parentElement.querySelector('span').innerText = Math.floor(v);
        kStats.r.rotate = 2;
        kStats.r.value = v;
        if (onRightKnob) onRightKnob(v, _knobsetup._stap, _knobsetup.max);
        return KR.val();
    }
    /**
     * Right Knob on Counter Clock Wise Rotate.
     * @returns {string} knob value
     */
    let RCCW = () => {
        let v = Number(KR.val());
        if (v == _knobsetup.min) {
            KR.val(_knobsetup.max).trigger("change");
        } else {
            KR.val(v - kStap).trigger("change");
        }
        v = Number(KR.val());
        KR[0].parentElement.querySelector('span').innerText = Math.floor(v);
        kStats.r.rotate = 1;
        kStats.r.value = v;
        if (onRightKnob) onRightKnob(v, _knobsetup._stap, _knobsetup.max);
        return KR.val();
    };
    // _knobsetup.change = function (value) {
    //     value = Math.floor(value);
    //     kStats.l.preV
    //     leftknob[0].querySelector('span').innerText = value;
    // }
    const mobLisner = fns => fns.map(e => {
        if (e) e();
    })
    _knobsetup.change = function (value) {
        var newValue = Math.floor(value);
        var rotateStatus = kStats.l.rotate;
        var preValue = kStats.l.preV;

        if (preValue !== null) {
            if (newValue < preValue) {
                rotateStatus = 1;
            } else if (newValue > preValue) {
                rotateStatus = 2;
            } else {
                rotateStatus = 0;
            }
        }

        kStats.l.preV = newValue;
        kStats.l.rotate = rotateStatus;

        leftknob[0].querySelector('span').innerText = newValue;
        if (onLeftKnob) onLeftKnob(newValue, _knobsetup._stap, _knobsetup.max);
        mobLisner(kStats.mobFuns)
    }

    let leftknob = KL.knob(_knobsetup);
    _knobsetup.bgColor = '#FE8DB7';
    leftknob[0].insertAdjacentHTML('beforeend', `<span class="knobLabel_Left">0</span>`);

    _knobsetup.change = function (value) {
        var newValue = Math.floor(value);
        var rotateStatus = kStats.r.rotate;
        var preValue = kStats.r.preV;

        if (preValue !== null) {
            if (newValue < preValue) {
                rotateStatus = 1;
            } else if (newValue > preValue) {
                rotateStatus = 2;
            } else {
                rotateStatus = 0;
            }
        }

        kStats.r.preV = newValue;
        kStats.r.rotate = rotateStatus;

        rightknob[0].querySelector('span').innerText = newValue;
        if (onRightKnob) onRightKnob(newValue, _knobsetup._stap, _knobsetup.max);
        mobLisner(kStats.mobFuns)
    }

    let rightknob = KR.knob(_knobsetup);
    rightknob[0].insertAdjacentHTML('beforeend', `<span class="knobLabel_Right">0</span>`);
    //console.log(leftknob[0], rightknob[0])
    return { LCW, LCCW, RCW, RCCW, kStats }
};