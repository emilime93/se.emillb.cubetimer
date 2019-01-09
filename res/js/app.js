const ui = new UI();
const timer = new Timer(10);
ui.displayTime(new Date(0));
document.getElementById('start').addEventListener('click', () => {
    mainStart();
});
document.getElementById('stop').addEventListener('click', () => {
    mainStop();
});
document.getElementById('reset').addEventListener('click', () => {
    timer.reset();
    ui.displayTime(new Date(0));
});
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
window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === document.body)
        e.preventDefault();
});

function mainStart() {
    timer.start((time) => {
        ui.displayTime(time);
    });
}

function mainStop() {
    const result = timer.stop();
    console.log('Stopped time:', result);
    Storage.saveTime(result);
}

if (localStorage.length > 0) {
    console.log('Things are stored');
    const times = Storage.loadTimes();
    for (let key in times) {
        ui.addTimeToTable(times[key]);
    }
}