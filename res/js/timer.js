class Timer {

    /**
     * The real time accuracy of the displayed time. How often it should check
     * @param {Number} interval Interval real time accuracy
     */
    constructor(interval) {
        this.interval = interval;
        this.totalTime = 0;
        this.timerGoing = false;
    }

    isTimerGoing() {
        console.log('returning:', this.timerGoing);
        return this.timerGoing;
    }
    
    start(callback) {
        if (this.timerGoing) {
            console.log('timer already going');
            return;
        }
        this.cb = callback;
        this.timerGoing = true;
        this.lastTime = new Date();
        // this.lastTime.setHours(0);
        this.timer = setInterval(() => {
            const delta = Date.now() - this.lastTime;
            if (delta >= this.interval) {
                this.totalTime += delta;
                this.lastTime = Date.now();
                callback(new Date(this.totalTime));
            }
        }, 1);
    }
    
    stop() {
        this.timerGoing = false;
        this.totalTime += Date.now() - this.lastTime;
        this.cb(new Date(this.totalTime));
        clearInterval(this.timer);
        return {
            id: localStorage.length,
            time: new Date(this.totalTime),
            complete: true
        };
    }

    reset() {
        this.stop();
        this.totalTime = 0;
    }
}

class UI {

    constructor() {
        this.display = document.getElementById('display');
        this.table = document.getElementById('time-table');
    }

    /**
     * Formats a timestamp in Date form correctly
     * @param {Date} date 
     */
    formatTime(date) {
        const timeStr = date.toISOString().substr(11, 11);
        if (Number.parseInt(timeStr.substr(0, 2)) > 0) {
            return timeStr;
        } else if (Number.parseInt(timeStr.substr(3, 2)) > 0) {
            return timeStr.substr(3);
        } else {
            return timeStr.substr(6);
        }
    }

    /**
     * Displays the timestamp in the UI.
     * @param {Date} date A time in date form to display
     */
    displayTime(date) { // A date object
        this.display.textContent = this.formatTime(date);
    }

    addTimeToTable(timeObject) {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        idCell.textContent = timeObject.id;
        row.appendChild(idCell);
        const timeCell = document.createElement('td');
        timeCell.textContent = this.formatTime(new Date(timeObject.time));
        row.appendChild(timeCell);
        const completeCell = document.createElement('td');
        completeCell.textContent = timeObject.complete;
        row.appendChild(completeCell);
        this.table.appendChild(row);
    }
}

class Storage {

    static saveTime(cubeTime) { // A date object
        localStorage.setItem(cubeTime.id, JSON.stringify(cubeTime));
    }

    static loadTimes() {
        let timeArray = [];
        for (let key in {...localStorage}) {
            const parsed = JSON.parse(localStorage.getItem(key));
            parsed.time = new Date(parsed.time);
            timeArray.push(parsed);
        }
        console.log(timeArray);
        return timeArray;
    }
}

const CUBE_TYPES = {
    TWO_BY_TWO: "2x2",
    THREE_BY_THREE: "3x3",
    FOUR_BY_FOUR: "4x4",
    THREE_BY_THREE: "5x5",
    SIX_BY_SIX: "6x6",
    SEVEN_BY_SEVEN: "7x7",
    EIGHT_BY_EIGHT: "8x8",
    PYRAMINX: "Pyraminx",
    MEGAMINX: "Megaminx",
    SKEWB: "Skewb",
    OTHER: "Other puzzle"
}

class CubeTime {
    constructor(id, puzzleType, time) {
        this.id = id;
        this.puzzleType = puzzleType;
        this.time = time;
    }
}