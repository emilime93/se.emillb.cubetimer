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

    /**
     * Returns wether the timer is going or not
     */
    isTimerGoing() {
        return this.timerGoing;
    }

    /**
     * @param {funciton} callback Callback function for updating UI with time
     */
    start(callback) {
        if (this.timerGoing) {
            console.log('timer already going');
            return;
        }
        this.callback = callback;
        this.timerGoing = true;
        this.lastTime = new Date();
        this.timer = setInterval(() => {
            const delta = Date.now() - this.lastTime;
            if (delta >= this.interval) {
                this.totalTime += delta;
                this.lastTime = Date.now();
                callback(new Date(this.totalTime));
            }
        }, 10);
    }
    
    stop() {
        // Cleanup
        this.timerGoing = false;
        this.totalTime += Date.now() - this.lastTime;
        this.callback(new Date(this.totalTime));
        clearInterval(this.timer);

        // Build return object
        const date = new Date(this.totalTime);
        const stoppedTime = new Timestamp(date.getMilliseconds(), date.getSeconds(), date.getMinutes());
        const type = ui.cubeSelect.value;
        this.totalTime = 0;
        return new CubeTime(Storage.getCurrentID(), type, stoppedTime);
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
        
        // Remove?
        this.cubeSelect = document.getElementById('puzzle-select');
    }

    /**
     * Formats a timestamp in Date form correctly
     * @param {Date | Timestamp} date 
     */
    formatTime(date) {
        if (date instanceof Timestamp) {
            let formattedString = '';
            if (date.min) {
                formattedString += `${"00".substr(date.min.toString().length) + date.min}:`;
            }
            formattedString += `${"00".substr(date.sec.toString().length) + date.sec}:`;
            formattedString += `${"00".substr(date.millis.toString().length) + date.millis.toString().substr(0,2)}`;
            return formattedString;
        } else if (date instanceof Date) {
            const timeStr = date.toISOString().substr(11, 11);
            if (Number.parseInt(timeStr.substr(0, 2)) > 0) {
                return timeStr;
            } else if (Number.parseInt(timeStr.substr(3, 2)) > 0) {
                return timeStr.substr(3);
            } else {
                return timeStr.substr(6);
            }
        } else {
            console.error("it was nothing");
        }
    }

    /**
     * Displays the timestamp in the UI.
     * @param {Date} date A time in date form to display
     */
    displayTime(date) { // A date object
        this.display.textContent = this.formatTime(date);
    }

    /**
     * 
     * @param {CubeTime} cubeTime The time taken
     */
    addTimeToTable(cubeTime) {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        idCell.textContent = cubeTime.id;
        row.appendChild(idCell);
        const timeCell = document.createElement('td');
        timeCell.textContent = this.formatTime(cubeTime.timestamp);
        row.appendChild(timeCell);
        const typeCell = document.createElement('td');
        typeCell.textContent = cubeTime.puzzleType;
        row.appendChild(typeCell);
        const completeCell = document.createElement('td');
        completeCell.textContent = cubeTime.dnf;
        row.appendChild(completeCell);
        this.table.appendChild(row);
    }
}

class Storage {

    /**
     * Gets the current ID
     * !!! AND !!! increments it
     */
    static getCurrentID() {
        if (!localStorage.getItem("id")) {
            localStorage.setItem("id", 0);
        }
        const oldID = Number.parseInt(localStorage.getItem("id"))
        localStorage.setItem("id", Number.parseInt(localStorage.getItem("id")) + 1);
        return oldID;
    }

    /**
     * @param {CubeTime} cubeTime A CubeTime object
     */
    static saveTime(cubeTime) { // A date object
        localStorage.setItem(cubeTime.id, JSON.stringify(cubeTime));
    }

    /**
     * Loads an array of CubeTimes from localstorage
     */
    static loadTimes() {
        let timeArray = [];
        for (let key in {...localStorage}) {
            if (key == "id")
                continue;
            const parsed = new CubeTime(JSON.parse(localStorage.getItem(key)));
            timeArray.push(parsed);
        }
        console.log(timeArray);
        return timeArray;
    }
}

class Timestamp {
    /**
     * @param {Number} millis The amount of milliseconds taken
     * @param {Number} sec The amount of seconds taken
     * @param {Number} min The amounds of minutes taken
     */
    constructor(millis, sec, min) {
        if (typeof(millis) !== 'number') {
            const oldObj = millis;
            this.millis = oldObj.millis;
            this.sec = oldObj.sec;
            this.min = oldObj.min;
        } else {
            this.millis = millis;
            this.sec = sec;
            this.min = min;
        }
    }
}

class CubeTime {
    /**
     * @param {Number | CubeTime} id Unique ID for solve
     * @param {String} puzzleType The puzzle solved
     * @param {Timestamp} timestamp Timestamp for the solve
     * @param {Boolean} dnf Wether the solve is DNF, false default
     */
    constructor(id, puzzleType, timestamp, dnf = false, sessionID = 'DEFAULT') {
        // For recreating a object from a serialized obj
        if (typeof(id) !== 'number') {
            const oldObj = id;
            this.id = oldObj.id;
            this.puzzleType = oldObj.puzzleType;
            this.dnf = oldObj.dnf;
            this.timestamp = new Timestamp(oldObj.timestamp);
            this.sessionID = oldObj.sessionID;
        } else {
            this.id = id;
            this.puzzleType = puzzleType;
            this.timestamp = timestamp;
            this.dnf = dnf;
            this.sessionID = sessionID;
        }
    }
}