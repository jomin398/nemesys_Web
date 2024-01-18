import Stats from 'statsjs';
import WaveSurfer from 'wavesurfer';

/**
 * Initialize stats.js and append it to the target element.
 * @param {HTMLElement} [appendElemetTarget=document.body] - The element to which the stats.js panel will be appended.
 * @returns {Stats} The initialized Stats instance.
 */
function statInit(appendElemetTarget, statjsOption) {
  const stats = new Stats(statjsOption);
  stats.dom.className = 'statJS';
  stats.showPanel(0);
  appendElemetTarget ??= document.body;
  const searchElement = appendElemetTarget.querySelector('.statJS');
  if (searchElement) searchElement.remove();
  appendElemetTarget.appendChild(stats.dom);
  return stats;
}
/**
 * handles frame updates.
 */
function onframe() {
  // begin measuring time.
  this.stats.begin();
  // Get the current audio playback time in milliseconds.
  const currentTime = this.getCurrentTime();
  // Render the progress of the audio playback, and emit 'timeupdate' and 'audioprocess' events with the current time.
  this.renderer.renderProgress(currentTime / this.getDuration(), true);
  this.emit('timeupdate', currentTime);
  this.emit('audioprocess', currentTime);

  // end of time measurement.
  this.stats.end();
};

/**
 * Append the stats module. into Wavesurfer class
 * @param {Stats} stats - The Stats instance created through the statInit function.
 */
function appendStatsModule(stats) {
  //override init function.
  WaveSurfer.prototype.initTimerEvents = function() {
    //add stats properties to parent class.
    this.stats = stats;
    // subscriptions = Event listener, tick = frame.
    // registering onframe event.
    this.subscriptions.push(this.timer.on('tick', onframe.bind(this)));
  }
}

/**
 * @export
 * @default
 * @class WavesurferStats
 * adding the stats module into Wavesurfer class.
 * @requires Stats
 * @requires WaveSurfer
 */
export default class WavesurferStats {
  /**
   * Creates an instance of the WavesurferStats class.
   * @param {HTMLElement} appendElemetTarget - The element to which the stats.js panel will be appended.
   * @param {Object} statjsOption statjs Option
   */
  constructor(appendElemetTarget, statjsOption) {
    /** @type {Stats} status object*/
    const stats = statInit(appendElemetTarget, statjsOption);
    appendStatsModule(stats);
  }
}