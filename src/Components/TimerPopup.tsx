import { useEffect, useState } from "react";
import Popup from "reactjs-popup";

interface Props {
  isOpen: boolean;
  minutes: number;
  seconds: number;
}

function TimerPopup({ minutes, seconds, isOpen }: Props) {
  const formatTime = (time: number) => {
    if (time === 100) {
      return "100";
    }
    return ("00" + String(time)).slice(-2);
  };
  const [timerSeconds, setTimerSeconds] = useState(seconds);
  const [timerMinutes, setTimerMinutes] = useState(minutes);
  useEffect(() => {
    // In order for this type to work, you need to install the @types/node package (npm install @types/node)
    let intervalId: NodeJS.Timeout;
    const decrementTimer = () => {
      if (timerSeconds === 0) {
        setTimerSeconds(59);
        setTimerMinutes((prevMin) => prevMin - 1);
      } else {
        setTimerSeconds((prevSec) => prevSec - 1);
      }
    };
    if ((timerMinutes > 0 || timerSeconds > 0) && isOpen) {
      intervalId = setInterval(decrementTimer, 1000);
    }
    if (timerMinutes === 0 && timerSeconds === 0) {
      document.getElementById("popupTimer")!.classList.add("overtime");
    }
    return () => clearInterval(intervalId);
  }, [timerSeconds, timerMinutes]);

  return (
    <Popup open={isOpen} position="right center" closeOnDocumentClick={false}>
      <div id="popupTimer" className="timer-popup">
        {formatTime(timerMinutes)}:{formatTime(timerSeconds)}
      </div>
    </Popup>
  );
}

export default TimerPopup;
