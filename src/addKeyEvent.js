export default function addKeyEvent(isLogging, settings, knobStats) {
  let keys = {};
  let handlers = settings.handlers;
  const isMobile = settings.isMobile;
  let keyList = settings.keyList;

  const keyPress = list => {
    if (typeof isLogging === 'boolean' && isLogging) console.log(list);
    if (typeof isLogging === 'function') isLogging(list);
    for (let keyComboName in handlers) {
      let mapData = handlers[keyComboName];
      let keyCombo = mapData.combo;
      if (keyCombo && keyCombo.every(key => keys[key]) && mapData.callBack) mapData.callBack();
    }
  }

  const keydown = event => {
    keys[event.key.toUpperCase()] = true;

    keyPress(Object.keys(keys));
    let el = document.getElementById(event.key.toUpperCase());
    if (el) el.classList.add('active');
  }

  const keyup = event => {
    let key = event.key.toUpperCase();
    delete keys[key];
    let el = document.getElementById(key);
    if (el) el.classList.remove('active');
    if (knobStats) {
      knobStats.l.rotate = 0;
      knobStats.r.rotate = 0;
    }
    // Here we call the onEnd function
    for (let keyComboName in handlers) {
      let mapData = handlers[keyComboName];
      if (mapData.combo.includes(key) && mapData.onEnd) {
        mapData.onEnd();
      }
    }
  }

  const set_handlers = (name, callBack, isPC) => {
    let el = document.getElementById(name);
    const start_handler = ev => {
      //ev.preventDefault();
      let id = ev.target.id || ev.target.parentElement.id;
      keys[id] = true;
      if (callBack) callBack(keys);
      if (isPC) keys = {};
      let el = document.getElementById(id);
      if (el && !el.classList.contains('active')) {
        el.classList.add('active')
      } else if (el && el.classList.contains('active'))
        el.classList.remove('active');
    }

    const end_handler = ev => {
      //ev.preventDefault();
      keys = {};
      if (knobStats) {
        knobStats.l.rotate = 0;
        knobStats.r.rotate = 0;
      }
      let id = ev.target.id || ev.target.parentElement.id;
      let el = document.getElementById(id);
      if (el) el.classList.remove('active');
      // Here we call the onEnd function
      for (let keyComboName in handlers) {
        let mapData = handlers[keyComboName];
        if (mapData.combo.includes(id) && mapData.onEnd) {
          mapData.onEnd();
        }
      }
    }

    if (!isPC && el) {
      el.ontouchstart = start_handler;
      el.ontouchcancel = end_handler;
      el.ontouchend = end_handler;
    } else if (el) {
      el.onclick = start_handler;
    }
  }
  keyList.forEach(key => set_handlers(key, keyPress, !isMobile));

  if (!isMobile) {
    window.onkeydown = keydown;
    window.onkeyup = keyup;
  }
};