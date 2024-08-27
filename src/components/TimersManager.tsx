"use client";
import { useState } from 'react';
import Timer from './Timer';

interface TimerItem {
  id: number;
  name: string;
}

const TimersManager: React.FC = () => {
  const [timers, setTimers] = useState<TimerItem[]>([]);

  const addTimer = () => {
    const newTimer: TimerItem = { id: Date.now(), name: '' };
    setTimers((prevTimers) => [...prevTimers, newTimer]);
  };

  const removeTimer = (id: number) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
  };

  const handleNameChange = (id: number, newName: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, name: newName } : timer
      )
    );
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={addTimer}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Timer
      </button>
      <div className="flex flex-col space-y-4">
        {timers.map((timer) => (
          <Timer
            key={timer.id}
            id={timer.id}
            name={timer.name}
            onNameChange={handleNameChange}
            onRemove={removeTimer}
          />
        ))}
      </div>
    </div>
  );
};

export default TimersManager;
