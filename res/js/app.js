const ui = new UI();
const timer = new Timer(10);
ui.displayTime(new Date(0));
document.body.addEventListener('keyup', (event) => {
  event.preventDefault();
  if (!(event.key === ' '))
  return;
  if(timer.isTimerGoing()) {
    mainStop();
  } else {
    mainStart();
  }
});

const NOT_STARTED = 'NOT_STARTED';
const STARTED = 'STARTED';
const TOUCH_STOPPED = 'TOUCH_STOPPED';

let touchScenario = NOT_STARTED;
ui.display.addEventListener('touchstart', (event) => {
  if(timer.isTimerGoing() && touchScenario !== NOT_STARTED) {
    mainStop();
    touchScenario = TOUCH_STOPPED;
  }
});
ui.display.addEventListener('touchend', (event) => {
  if(!timer.isTimerGoing()) {
    if (touchScenario === NOT_STARTED) {
      mainStart();
      touchScenario = STARTED;
    } else if (touchScenario === TOUCH_STOPPED) {
      touchScenario = NOT_STARTED;
    }
  }
});


function puzzleChange(e) {
  console.log("Select event:", e);
  e.target.blur();
  document.body.focus();
}
const select = document.getElementById('puzzle-select');
select.addEventListener('change', puzzleChange);
select.addEventListener('keydown', puzzleChange);

document.getElementById('time-table').addEventListener('click', ui.deleteTime);

window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && e.target === document.body) {
    e.preventDefault(); // Prevent space scrolling :)
    // document.body.focus();
  }
});

function mainStart() {
  timer.start((time) => {
    ui.displayTime(time);
  });
}

function mainStop() {
  const result = timer.stop();
  ui.addTimeToTable(result);
  Storage.saveTime(result);
}

if (localStorage.length > 0) {
  const times = Storage.loadAllTimes();
  for (let key in times) {
    ui.addTimeToTable(times[key]);
  }
}