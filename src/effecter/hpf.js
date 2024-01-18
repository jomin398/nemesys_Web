import { highPassKnob } from "./highPassKnob.js";
export class HPF {
    constructor(sourceNode, audioContext, destinationNode, filterFrequency = 20) {
        this.audioContext = audioContext;
        this.sourceNode = sourceNode;
        this.destinationNode = destinationNode;
        this.biquadFilter = this.audioContext.createBiquadFilter();

        // 필터 초기 설정
        this.biquadFilter.type = "highpass";
        this.biquadFilter.frequency.value = filterFrequency;

        // 노드 연결
        if (this.destinationNode)
            this.sourceNode.connect(this.destinationNode);
    }

    activateFilter(frequency = 20) {
        //console.log(this.sourceNode,this.destinationNode)
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
    onKnob = (value, step, max) => highPassKnob(this, value, step, max)
};