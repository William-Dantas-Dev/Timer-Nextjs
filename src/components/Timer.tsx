"use client";

import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  id: number;
  name: string;
  onNameChange: (id: number, newName: string) => void;
  onRemove: (id: number) => void;
}

const Timer: React.FC<TimerProps> = ({ id, name, onNameChange, onRemove }) => {
  const [time, setTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [wasActiveBefore, setWasActiveBefore] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const alarmRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    const totalDuration = hours * 3600 + minutes * 60 + seconds;

    if (isActive && totalDuration > 0 && time < totalDuration) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    if (time >= totalDuration && totalDuration > 0) {
      if (isActive) setWasActiveBefore(true);
      setIsActive(false);
      clearInterval(interval);
      setHasFinished(true);
    }

    return () => clearInterval(interval);
  }, [isActive, time, hours, minutes, seconds, wasActiveBefore]);

  useEffect(() => {
    if (hasFinished) {
      // Tocar o som do alarme e gerar a fala personalizada se o temporizador estava ativo
      if (alarmRef.current) {
        alarmRef.current.volume = 0.1; // Definindo o volume bem baixo
        alarmRef.current.play();
      }
      const utterance = new SpeechSynthesisUtterance(`Timer ${name} has finished.`);
      window.speechSynthesis.speak(utterance);

      // Resetar o estado para evitar que a fala seja repetida
      setHasFinished(false);
    }
  }, [hasFinished, name]);

  const resetTimer = () => {
    setTime(0);
    setIsActive(false);
    setWasActiveBefore(false);
    setHasFinished(false);
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <audio ref={alarmRef} src="/sounds/alarm.mp3" />
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(id, e.target.value)}
        className="text-2xl font-bold mb-2 text-center w-full text-black"
        placeholder="Timer Name"
      />
      <div className="text-2xl font-bold mb-2">
        {new Date(time * 1000).toISOString().slice(11, 19)}
      </div>
      <div className="flex space-x-2">
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-16 px-2 py-1 border rounded text-center text-black"
          min="0"
        />
        <span>Horas</span>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-16 px-2 py-1 border rounded text-center text-black"
          min="0"
          max="59"
        />
        <span>Minutos</span>
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          className="w-16 px-2 py-1 border rounded text-center text-black"
          min="0"
          max="59"
        />
        <span>Segundos</span>
      </div>
      <div className="flex space-x-4 mt-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded text-white ${isActive ? 'bg-red-500' : 'bg-green-500'}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          Reset
        </button>
        <button
          onClick={() => onRemove(id)}
          className="px-4 py-2 rounded bg-gray-500 text-white"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default Timer;
