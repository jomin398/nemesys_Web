class effNode {
    constructor(audioContext) {
        this.aCtx = audioContext;
        this.init();
        return this;
    }
    snode = null;
    intervalId = null;
    out = null;
    //gainNodes
    #wet = null;
    #dry = null;
    init() {
        // 기존의 GainNode를 효과음 제어용으로 사용합니다.
        this.#wet = this.aCtx.createGain();
        // 새로운 GainNode를 원음 제어용으로 추가합니다.
        this.#dry = this.aCtx.createGain();
        // 두 GainNode를 모두 오디오 컨텍스트의 출력에 연결합니다.
        this.out = this.aCtx.createGain();
        // 토글 상태를 추적하는 변수를 추가합니다. 초기 상태는 'Off'입니다.
        this.enable = false;
    };

    toggle() {
        // 토글 상태를 변경합니다.
        this.enable = this.enable == false ? true : false;
        
    };

    connect() {
        // 기존 연결을 해제합니다.
        this.snode.disconnect();
        // 토글 상태가 'On'일 경우 wet과 dry를 각각 out에 연결합니다.
        if (this.enable) {
            this.snode.connect(this.#wet);
            this.snode.connect(this.#dry);
            this.#wet.connect(this.out);
            this.#dry.connect(this.out);
        } else {
            // 그렇지 않으면, snode를 직접 out에 연결합니다.
            this.snode.connect(this.out);
        }

        return this.out;
    };
    update(bpm, gVal, mix) {

        console.log("update", bpm, gVal, mix)

        let quarterNoteTime = 60 / bpm;
        let beatTime = quarterNoteTime / gVal;
        let cycleTime = quarterNoteTime * 1000;

        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            let startTime = this.aCtx.currentTime;
            let endTime = startTime + quarterNoteTime;

            let time = startTime;
            let gainValue = 1;

            while (time < endTime) {
                this.#wet.gain.setValueAtTime(gainValue, time); // gainNode를 wetGainNode로 변경합니다.

                gainValue = (gainValue === 1) ? 0 : 1;
                time += beatTime;
            }

            // Dry/Wet mix 설정을 추가합니다.
            this.#dry.gain.value = 1 - mix;
            this.#wet.gain.value = mix;
        }, cycleTime);
    }

}

export class TranceGate {
    constructor() {
        this.element = null;
        this.aCtx = null;
        this.bpmElm = null;
        this.mixRate = 1;
    }
    #updateAudioPath = null;
    isEffect = true;
    effect = null;
    onButtonDown(gValue) {
        const scope = this;
        console.log(gValue,"down");
        if(scope.effect.enable)return;
        // button.onclick = function() {
        //   scope.#toggleButton(this.value);
        //   //console.log(`버튼 ${this.value} 가 클릭(토글)되었습니다. 현재 상태: ${this.classList.contains('active') ? '활성화' : '비활성화'}`);
        scope.#drawIndecater(gValue);
        scope.effect.toggle();
        scope.effect.connect();
        scope.effect.update(scope.bpm, gValue, scope.mixRate);
        //   /* if (scope.#isAllButtonsDeactivated()) {
        //      scope.isEnable = false;
        //      scope.efftoggle();
        //    }*/
        // })
        //scope.#updateAudioPath();
    }
    #drawIndecater(trace) {
        const canvas = this.element.querySelector('.indecater');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 90;
        const outerRadius = radius;
        const innerRadius = radius / (8 / 6); // 도넛의 안쪽 반지름을 설정합니다.
        const segmentThickness = 2; // 세그먼트 경계선의 두께를 설정합니다.

        // 각 세그먼트에 대한 각도를 계산합니다.
        const angle = Math.PI * 2 / trace;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < trace; i++) {
            // 각 세그먼트의 시작과 끝 각도를 계산합니다.
            const startAngle = angle * i;
            const endAngle = angle * (i + 1);

            // 세그먼트를 그립니다.
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            ctx.closePath();

            // 세그먼트의 스타일을 설정합니다. (2칸마다 다른색?)
            //ctx.fillStyle = i % 2 === 0 ? '#3498db' : '#ecf0f1';
            ctx.fillStyle = '#3498db';
            ctx.fill();

            // 세그먼트 경계선을 그립니다.
            ctx.lineWidth = segmentThickness;
            ctx.strokeStyle = '#34495e';
            ctx.stroke();
        }

    }
    get bpm() {
        return this.bpmElm?.value ?? 0;
    }
    init(elm, aCtx, updater) {
        this.#updateAudioPath = updater;
        this.bpmElm = document.getElementById('bpm');
        this.element = elm.querySelector('.module');

        this.aCtx = aCtx;
        this.effect = new effNode(this.aCtx)
        return this;
    }

    onButtonUp(gValue) {
      console.log(gValue,"up");
        const scope = this;
        if(!scope.effect.enable)return;
        scope.effect.toggle();
        scope.effect.connect();
        //scope.#updateAudioPath();
    }
}