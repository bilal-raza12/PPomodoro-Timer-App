"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  MinusIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon,
  RefreshCwIcon,
  Icon,
} from "lucide-react";

type TimerStatus = "idle" | "running" | "paused";
type SessionType = "work" | "break";

interface PomodoroState {
  workDuration: number;
  breakDuration: number;
  currentTime: number;
  currentSession: SessionType;
  timerStatus: TimerStatus;
}
const PomodoroTimer = () => {
  const [state, setState] = useState<PomodoroState>({
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    currentTime: 25 * 60,
    currentSession: "work",
    timerStatus: "idle",
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.timerStatus === "running" && state.currentTime > 0) {
      timerRef.current = setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          currentTime: prevState.currentTime - 1,
        }));
      }, 1000);
    } else if (state.currentTime === 0) {
      clearInterval(timerRef.current as NodeJS.Timeout);
      handleSessionSwitch();
    }
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [state.timerStatus, state.currentTime]);

  const handleSessionSwitch = () => {
    setState((prevState) => {
      const isWorkSession = prevState.currentSession === "work";
      return {
        ...prevState,
        currentSession: isWorkSession ? "break" : "work",
        currentTime: isWorkSession
          ? prevState.breakDuration
          : prevState.workDuration,
      };
    });
  };

  const handleStartPause = (): void => {
    if (state.timerStatus === "running") {
      setState((prevState) => ({
        ...prevState,
        timerStatus: "paused",
      }));
      clearInterval(timerRef.current as NodeJS.Timeout);
    } else {
      setState((prevState) => ({
        ...prevState,
        timerStatus: "running",
      }));
    }
  };

  const handleReset = (): void => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    setState((prevState) => ({
      ...prevState,
      currentTime: prevState.workDuration,
      currentSession: "work",
      timerStatus: "idle",
    }));
  };

  const handleDurationChange = (
    type: SessionType,
    increment: boolean
  ): void => {
    setState((prevState) => {
      const durationChange = increment ? 60 : -60;
      if (type === "work") {
        return {
          ...prevState,
          workDuration: Math.max(
            60,
            prevState.workDuration - durationChange + durationChange
          ),
          currentTime:
            prevState.currentSession === "work"
              ? Math.max(60, prevState.workDuration + durationChange)
              : prevState.currentTime,
        };
      } else {
        return {
          ...prevState,
          breakDuration: Math.max(60, prevState.breakDuration + durationChange),
          currentTime:
            prevState.currentSession === "break"
              ? Math.max(60, prevState.breakDuration + durationChange)
              : prevState.currentTime,
        };
      }
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 dark:bg-blue-800">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="flex flex-col items-center justify-center gap-6 dark:text-white">
          <h1 className="text-4xl dark:text-white font-bold">Pomodoro Timer</h1>
          <p>A Timer For Pomodoro Technique.</p>
          <div className="flex flex-col items-center gap-4">
            <div className="text-2xl font-medium ">
              <span
                className={`text-${
                  state.currentSession === "work" ? "primary" : "secondary"
                }`}
              >
                {state.currentSession === "work" ? "work" : "break"}
              </span>
            </div>
            <div className="text-8xl font-bold">
              {formatTime(state.currentTime)}
            </div>
          </div>
          <div className="flex items-center gap-2">
              <div className="p-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange("work", false)}
            >
              <MinusIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange("work", true)}
              >
              <PlusIcon className="h-6 w-6" />
            </Button>
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={handleStartPause}
              >
              {state.timerStatus === "running" ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                    <PlayIcon className="h-6 w-6" />
                )}
            </Button>
            <Button variant="outline" size={"icon"} onClick={handleReset}>
              <RefreshCwIcon className="h-6 w-6" />
            </Button>
          </div>
                </div>
          <div className="p-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default">What is Pomodoro Technique</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-full max-w-2xl p-4 md:p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <strong>➡ Explaination of Pomodoro Technique 🔥</strong>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>Pomodoro Technique</strong>
                    is a time management technique that uses a timer to divide
                    the work into intervals called Pomodoros . The Pomodoro
                    timer is traditionally set for 25 minutes but can be
                    costumized to fit your needs. The basic steps are:
                    <br />
                    <br />
                    <ol>
                      <strong>
                        <li>1. Select a single task to focus on .</li>
                        <li>
                          2. Set a timer for 25 - 30 min. and work continously
                          until the timer goes off.
                        </li>
                        <li>
                          3. Take a productive 5 min. break-walk around , get
                          snack and relax .
                        </li>
                        <li>4. Repeat steps 2 and 3 for 4 rounds .</li>
                        <li>5. Take a longer (20 - 30 min) break. </li>
                      </strong>
                    </ol>
                    <br />
                    <Button>
                      <a
                        href="https://todolist.com/productivity-method/pomodoro-technique"
                        target="_blank"
                        rel="noopener norefferer"
                      >
                        Read More!
                      </a>
                    </Button>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PomodoroTimer;