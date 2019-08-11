const NOT_STARTED = 'NOT_STARTED';
const STARTED = 'STARTED';
const TOUCH_STOPPED = 'TOUCH_STOPPED';

let touchScenario = NOT_STARTED;

class App {
  constructor() {
    this.ui = new UI();
    this.timer = new Timer(10);
    this.ui.displayTime(new Date(0));

    this.initializeEventListeners();

    if (localStorage.length > 0) {
      const times = Storage.loadAllTimes();
      for (let key in times) {
        this.ui.addTimeToTable(times[key]);
      }
    }
  }

  initializeEventListeners() {
    // Start and stop with 'space'
    document.body.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (!(event.key === ' '))
        return;
      if (this.timer.isTimerGoing()) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    });

    // Prevent space from scrolling site
    window.addEventListener('keydown', (event) => {
      if (event.key === ' ' && event.target === document.body) {
        event.preventDefault();
      }
    });

    this.ui.display.addEventListener('touchstart', (event) => {
      if (this.timer.isTimerGoing() && touchScenario !== NOT_STARTED) {
        this.stopTimer();
        touchScenario = TOUCH_STOPPED;
      }
    });
    this.ui.display.addEventListener('touchend', (event) => {
      if (!this.timer.isTimerGoing()) {
        if (touchScenario === NOT_STARTED) {
          this.startTimer();
          touchScenario = STARTED;
        } else if (touchScenario === TOUCH_STOPPED) {
          touchScenario = NOT_STARTED;
        }
      }
    });

    const select = document.getElementById('puzzle-select');
    select.addEventListener('change', this.puzzleChangedHandler);
    select.addEventListener('keydown', this.puzzleChangedHandler);

    document.getElementById('time-table').addEventListener('click', this.ui.deleteTime);
  }

  startTimer() {
    console.log('Start timer');
    this.timer.start((time) => {
      this.ui.displayTime(time);
    });
  }
  
  stopTimer() {
    console.log('Stop timer');
    const stoppedTime = this.timer.stop();
    const type = this.ui.cubeSelect.value;
    const cubeTime = new CubeTime(Storage.getCurrentID(), type, stoppedTime);
    console.log(': App -> stopTimer -> result', cubeTime);
    this.ui.addTimeToTable(cubeTime);
    Storage.saveTime(cubeTime);
  }

  puzzleChangedHandler() {
    // e.target.blur();
    document.body.focus();
  }
}

// const ui = new UI();
// const timer = new Timer(10);
const app = new App();