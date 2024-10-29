import { useSyncExternalStore } from "npm:react@^18.3.1";

class State<T> {
  private state: T;
  private subscribers: Set<(state?: T) => void>;
  private effects: Set<(state?: T) => void>;
  constructor(initialState: T) {
    this.state = initialState;
    this.subscribers = new Set();
    this.effects = new Set();
  }

  get() {
    return this.state;
  }

  set(newState: T) {
    this.state = newState;
  }

  subscribe(subscriber: () => void) {
    this.subscribers.add(subscriber);
    subscriber();
    return () => this.subscribers.delete(subscriber);
  }

  dispatch(updater: () => T): void {
    this.state = updater(this.state);
    this.subscribers.forEach((subscriber) => subscriber());
    this.effects.forEach((effect) => effect());
  }
}

export const createState = <T>(initialState: T) => {
  // @todo: implement
  const state = new State(initialState);
  return state;
};

export const createEffect = (effect: Function, deps: any[]) => {
  // @todo: implement
  return effect;
};

export const dispatch = <T>(state: T, updater: Function) => {
  // @todo: implement
  state = updater(state);
  return state;
};

export const useLibState = <T>(state: T) => {
  // @todo: implement
  const getSnapshot = () => state;
  const setSnapshot = (newState: T) => {
    state = newState;
  };
  const subscribe = (subscriber: () => void) => {
    subscriber();
  };
  const [state, setState] = useSyncExternalStore(
    subscribe,
    getSnapshot,
    setSnapshot,
  );
  return [state, setState];
};
