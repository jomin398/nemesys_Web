/**
 * @class MuxNode
 * @exports
 * 컨텍스트와 포트 번호를 받아와서 포트를 생성하고 연결하는 기능을 제공합니다.
 */
export default class MuxNode {
  /**
   * MuxNode 클래스의 생성자입니다.
   * @param {AudioContext} context 오디오 컨텍스트 객체
   * @param {number} portNum 생성할 포트의 개수
   */
  constructor(context, portNum) {
    /**
     * 컨텍스트 객체
     * @type {AudioContext}
     */
    this.context = context;

    /**
     * 생성할 포트의 개수
     * @type {number}
     */
    this.portNum = portNum;

    /**
     * 포트를 저장하는 배열
     * @type {Array<GainNode>}
     */
    this.port = [];

    for (let i = 0; i < this.portNum; i++) {
      let gainNode = this.context.createGain();
      this.port.push(gainNode);
    }

    /**
     * 출력에 연결되는 GainNode
     * @type {GainNode}
     */
    this.output = this.context.createGain();

    this.port.forEach(node => node.connect(this.output));
  }

  /**
   * 현재 노드의 출력을 주어진 목적지에 연결합니다.
   * @param {AudioNode} dest - 연결할 목적지 노드
   */
  connect(dest) {
    this.output.connect(dest);
  }
}