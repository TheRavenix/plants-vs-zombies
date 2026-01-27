import type { Updatable } from "@/game/types/updatable";

export interface Timer extends Updatable {
  readonly time: number;
  readonly state: TimerState;
  readonly type: TimerType;
  readonly cycles: number;
  pause(): void;
  resume(): void;
  reset(): void;
}

type Options = {
  maxTime: number;
  defaultState?: TimerState;
  defaultType?: TimerType;
  maxCycles?: number;
  onReady(): void;
};

export enum TimerState {
  Running = "RUNNING",
  Paused = "PAUSED",
}

export enum TimerType {
  Interval = "INTERVAL",
  Timeout = "TIMEOUT",
}

export function createTimer(options: Options): Timer {
  const {
    maxTime,
    defaultState = TimerState.Running,
    defaultType = TimerType.Interval,
    maxCycles,
    onReady,
  } = options;
  let time = 0;
  let state = defaultState;
  let type = defaultType;
  let cycles = 0;

  function update(deltaTime: number) {
    if (type === TimerType.Timeout && cycles >= 1) {
      return;
    }
    if (
      type === TimerType.Interval &&
      maxCycles !== undefined &&
      cycles >= maxCycles
    ) {
      return;
    }
    if (state === TimerState.Running) {
      time += deltaTime;

      if (time >= maxTime) {
        time = 0;
        cycles++;
        onReady();
      }
    }
  }

  return {
    get time() {
      return time;
    },
    get state() {
      return state;
    },
    get type() {
      return type;
    },
    get cycles() {
      return cycles;
    },
    update,
    pause() {
      state = TimerState.Paused;
    },
    resume() {
      state = TimerState.Running;
    },
    reset() {
      time = 0;
    },
  };
}
