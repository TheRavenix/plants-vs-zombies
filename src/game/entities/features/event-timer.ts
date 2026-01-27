import type { GameEvent } from "@/game/events/types";
import type { Updatable } from "@/game/types/updatable";

export interface EventTimer extends Updatable<GameEvent[]> {
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
  events: GameEvent[];
  defaultState?: TimerState;
  defaultType?: TimerType;
  maxCycles?: number;
};

export enum TimerState {
  Running = "RUNNING",
  Paused = "PAUSED",
}

export enum TimerType {
  Interval = "INTERVAL",
  Timeout = "TIMEOUT",
}

export function createEventTimer(options: Options): EventTimer {
  const {
    maxTime,
    events,
    defaultState = TimerState.Running,
    defaultType = TimerType.Interval,
    maxCycles,
  } = options;
  let time = 0;
  let state = defaultState;
  let type = defaultType;
  let cycles = 0;

  function update(deltaTime: number) {
    if (type === TimerType.Timeout && cycles >= 1) {
      return [];
    }
    if (
      type === TimerType.Interval &&
      maxCycles !== undefined &&
      cycles >= maxCycles
    ) {
      return [];
    }
    if (state === TimerState.Running) {
      time += deltaTime;

      if (time >= maxTime) {
        time = 0;
        cycles++;
        return events;
      }
    }

    return [];
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
