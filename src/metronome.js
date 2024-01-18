export default class Metronome {
    constructor() {
        // window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.#denominatorElm = document.querySelector(this.#inputSel[0]);

        this.#noteElems = document.querySelectorAll(this.#inputSel[1]);
        this.#bpmInputElem = document.querySelector(this.#inputSel[2]);

        this.#bpmInputElem.onchange = onChangeTimesig.bind(this);
        this.#denominatorElm.onchange = onChangeTimesig.bind(this);
        /* Add dots when time signature is changed */
        //$(".ts-top, .ts-bottom").on("change",

        function onChangeTimesig() {
            var _counter = document.querySelector(".metronomeWrap .counter");
            _counter.innerHTML = "";

            for (var i = 0; i < parseInt(this.#denominatorElm.value, 10); i++) {
                var temp = document.createElement("div");
                temp.className = "dot";

                if (i === 0)
                    temp.className += " active";

                _counter.append(temp);
            }
            this.#noteElems = document.querySelectorAll(this.#inputSel[1]);
            /* Activate dots for accents */
            this.#noteElems.forEach(elm => elm.onclick = () =>
                elm.classList.toggle("active"));

        };

        this.#countElem = document.querySelector(this.#inputSel[3]);
        document.querySelector(this.#inputSel[4]).onchange = ev => rangeChange.bind(this)(ev);
        document.querySelector(this.#inputSel[5]).onchange = ev => rangeChange.bind(this)(ev);
        /* Change pitches for tones in options */
        const rangeChange = ev => {
            if (ev.target.classList.contains("beat-range"))
                this.offBeatPitch = ev.target.value;
            else
                this.accentPitch = ev.target.value;
        };

        /* Play and stop button */
        document.querySelector(".metronomeWrap .play-btn").onclick = ev => {

            if (ev.target.dataset.what === "pause") {
                // ====== Pause ====== //
                this.counting = false;
                window.clearInterval(this.#timer);
                this.#noteElems.forEach(elm => elm.setAttribute('style', ""));
                ev.target.dataset.what = "play";
                ev.target.setAttribute('style', "");
                ev.target.innerText = "Play";
            }
            else if (ev.target.dataset.what != "pause" && this.#noteElems) {
                // ====== Play ====== //
                this.#curTime = this.context.currentTime;
                this.noteCount = parseInt(this.#denominatorElm.value, 10);
                if (this.#noteElems.length == 0) {
                    this.#bpmInputElem.focus()
                    // alert("please define BPM");
                }
                this.#schedule();
                ev.target.dataset.what = "pause";
                ev.target.innerText = "Stop";
                Object.assign(ev.target.style, {
                    background: "#F75454",
                    color: "#FFF"
                });
            }
        };
    }
    #noteElems;
    #denominatorElm;
    #countElem;
    #bpmInputElem;
    #timer;
    #delta = 0;
    #curTime = 0.0;
    noteCount = 0;
    counting = false;
    accentPitch = 380;
    offBeatPitch = 200;
    /*
    Scheduling Help by: https://www.html5rocks.com/en/tutorials/audio/scheduling/
    */
    #schedule() {
        while (this.#curTime < this.context.currentTime + 0.1) {
            this.#playNote.bind(this)(this.#curTime);
            this.#updateTime.bind(this)();
        }
        this.#timer = window.setTimeout(this.#schedule.bind(this), 0.1);
    }
    #inputSel = [".metronomeWrap .ts-top", ".metronomeWrap .counter .dot", ".speedInfo-container #bpm", ".metronomeWrap .timer", ".beat-range", ".accent-range"];
    #updateTime() {
        this.#curTime += 60.0 / parseInt(this.#bpmInputElem.value, 10);
        this.noteCount++;
    }
    /* Play note on a delayed interval of t */
    #playNote(t) {
        const note = this.context.createOscillator();
        /** @type {HTMLInputElement} */
        if (this.noteCount == parseInt(this.#denominatorElm.value, 10))
            this.noteCount = 0;
        const onTempoNodeElm = this.#noteElems[this.noteCount];
        if (onTempoNodeElm.classList.contains("active"))
            note.frequency.value = this.accentPitch;
        else
            note.frequency.value = this.offBeatPitch;

        note.connect(this.context.destination);

        note.start(t);
        note.stop(t + 0.05);
        this.#noteElems.forEach(elm => elm.setAttribute('style', ""))
        // $(".counter .dot").attr("style", "");

        Object.assign(onTempoNodeElm.style, {
            transform: "translateY(-10px)",
            background: "#F75454"
        });
    }
}