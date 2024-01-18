import WaveSurfer from 'wavesurfer';
import WavesurferStats from 'wavesurferStats';

export default class ARenderer extends WaveSurfer {
  constructor(elem, opt) {
    let { aCtx, onLoading, onReady,statJsOpt } = opt;
    opt = Object.assign(opt, { media: elem })
    new WavesurferStats(document.querySelector('.fpsdisp'),statJsOpt)
    super(opt);
    if (onLoading) this.on('loading', onLoading);
    if (onReady)
      this.on('ready', onReady);
    if (aCtx) {
      this.aCtx = aCtx;
      elem.addEventListener('play', () => {
        this.aCtx.resume();
      }, true);
    }
  }
  aCtx = null;
}