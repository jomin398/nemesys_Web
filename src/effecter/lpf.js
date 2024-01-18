import { lowPassKnob } from "./lowPassKnob.js";
export class LPF {
    constructor(sourceNode, audioContext, destinationNode, filterFrequency = 22050) {
        this.audioContext = audioContext;
        this.sourceNode = sourceNode;
        this.destinationNode = destinationNode;
        this.biquadFilter = this.audioContext.createBiquadFilter();

        // 필터 초기 설정
        this.biquadFilter.type = "lowpass";
        this.biquadFilter.frequency.value = filterFrequency;

        // 노드 연결

        if (this.destinationNode)
            this.sourceNode.connect(this.destinationNode);
    }

    activateFilter(frequency = 22050) {
        // 필터 활성화
        //this.sourceNode.disconnect(this.destinationNode);
        this.sourceNode.connect(this.biquadFilter);
        this.biquadFilter.connect(this.destinationNode);
        this.biquadFilter.frequency.value = frequency;
    }

    deactivateFilter() {
        // 필터 비활성화 (필터 우회)
        this.sourceNode.disconnect(this.biquadFilter);
        this.biquadFilter.disconnect(this.destinationNode);
        this.sourceNode.connect(this.destinationNode);
    }

    setFilterFrequency(frequency) {
        // 필터 frequency 값 수정
        this.biquadFilter.frequency.value = frequency;
    }
    onKnob = (value, step, max) =>
        lowPassKnob(this, value, step, max);
};