/**
 * @const
 * @type {Array<number>}
Low Pass Filter Consts
 */
export const LPFConsts = [22080, 12000, 7390, 6000, 4500, 3200, 1000, 800, 400, 200, 200];
/**
 * lowPass Knob Handler 
 * @param {Object} lowPass lowPass Effect module
 * @param {number} value knob value
 * @param {number?} step knob Stap
 * @param {number} max knob max
 */
export function lowPassKnob(lowPass, value, step, max) {
    if (!lowPass)
        return;

    let freq;
    if (max == 10) {
        freq = LPFConsts[value];
    } else if (max == 100) {

        // 지수적 보간 함수
        function exponentialInterpolation(y1, y2, mu, n) {
            return y1 * Math.pow(y2 / y1, mu / n);
        }

        // 데이터 배열


        // 새로운 데이터 배열을 저장할 변수
        let newData = [];

        // 0부터 100까지 각 구간을 10으로 쪼개서 보간
        for (let i = 0; i < LPFConsts.length - 1; i++) {
            // 각 구간의 시작점
            newData.push(LPFConsts[i]);

            // 각 구간을 10개의 값으로 나누어서 보간
            for (let j = 1; j < 10; j++) {
                const interpolatedValue = exponentialInterpolation(data[i], data[i + 1], j, 10);
                newData.push(interpolatedValue);
            }
        }

        // 마지막 값은 별도로 추가 (100% 값)
        newData.push(LPFConsts[LPFConsts.length - 1]);
        freq = newData[value];
    }
    console.log("lowPass Freq:", freq);
    lowPass.setFilterFrequency(freq);
};