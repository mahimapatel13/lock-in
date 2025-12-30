import React, { useState, useEffect } from "react";

const CountDownTimer = () => {
    let pomo25 = {
        timer: 25,
        break: 5,
    }

    let pomo50 = {
        timer: 50,
        break: 10,
    }
    const [eventTime, setEventTime] = useState("")
    const [eventName, setEventName] = useState("")
    const [eventDate, setEventDate] = useState("")
    const [countdownStarted, setCountdownStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        if(countdownStarted && eventDate) {
            const countdownInterval = setInterval(() => {
                const currentTime = new Date().getTime();
                const eventTime = new Date(eventDate).getTime();
                let remainingTime = eventTime - currentTime;
                console.log(remainingTime)

                if (remainingTime <= 0){
                    remainingTime = 0;
                    clearInterval(countdownInterval);
                    alert("Countdown complete!")
                }

                setTimeRemaining(remainingTime);

            }, 1000)

            return () => clearInterval(countdownInterval);
        }
    }, [countdownStarted, eventDate, timeRemaining])

    useEffect(() => {
        if (countdownStarted){
            document.title = eventName;
        }

    }, [countdownStarted, eventName]);

    const handleSetCountdown = () => {
        setCountdownStarted(true);
        let finishTime = new Date().getTime() + eventTime*10000;
        localStorage.setItem("eventDate", eventDate);
        localStorage.setItem("eventName", eventName);
    }

    return (
        <div className="countdown-timer-container">
            <h2 className="countdown-name">
                {countdownStarted ? eventName : "Countdown Timer"}
            </h2>
            {!countdownStarted  && (
                <form className="countdown-form">
                    <label htmlFor="title">Event Name</label>
                    <input
                     type="text" 
                     name="title" 
                     placeholder="Enter event name"
                     value={eventName}
                     onChange={(e) => setEventName(e.target.value)}
                    />

                    <label htmlFor="date-picker">Date</label>
                    <input 
                     type="date" 
                     name="date-picker"
                     value={eventDate}
                     onChange={(e) => setEventDate(e.target.value)}
                     onClick={(e) => e.target.type = "date"}
                    />

                    <label htmlFor="pomodoro-picker">Pomodor</label>
                    <select name="pomdoro-picker">
                        <option value={pomo25}>25</option>
                        <option value={pomo50}>50</option>
                    </select>

                    <button onClick={handleSetCountdown}>Start Countdown</button>
                </form>
            )}

            <div className="control-buttons">
                {/* <button onClick={handleStopCountdown}>Stop</button>
                <button onClick={handleResetCountdown}>Reset</button> */}

            </div>

            
        </div>
    );
};

export default CountDownTimer;