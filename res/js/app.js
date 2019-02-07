const ui = new UI();
const timer = new Timer(10);
ui.displayTime(new Date(0));
document.body.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (!(e.key === ' '))
        return;
    if(timer.isTimerGoing()) {
        mainStop();
    } else {
        mainStart();
    }
});

function puzzleChange(e) {
    console.log("Select event:", e);
    e.target.blur();
    document.body.focus();
}
const select = document.getElementById('puzzle-select');
select.addEventListener('change', puzzleChange);
// select.addEventListener('mouseup', puzzleChange);

document.getElementById('time-table').addEventListener('click', ui.deleteTime);

window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault(); // Prevent space scrolling :)
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