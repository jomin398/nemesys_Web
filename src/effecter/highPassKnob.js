/**
 * highPass Knob Handler 
 * @param {Object} hiPass highPass Effect module
 * @param {number} value knob value
 * @param {number?} step knob Stap
 * @param {number} max knob max
 */
export function highPassKnob(hiPass, value, step, max) {
    if (!hiPass)
        return;
    // 20Hz에서 10000으로 변경
    let freq = (value / max) * (10000 - 20) + 20;
    console.log("highPass Freq:", freq);
    hiPass.setFilterFrequency(freq);
}