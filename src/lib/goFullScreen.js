export default function goFullScreen() {
    const el = document.documentElement;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }

    const interval = setInterval(() => {
      console.log('timerTicking...');
      if (!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)) {
        clearInterval(interval);
        alert("전체화면이 아닙니다. 전체화면으로 전환해 주세요.");
        location.reload();
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 10000);
  };