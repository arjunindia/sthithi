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

  addSubscriber(subscriber: () => void) {
    this.subscribers.add(subscriber);
  }

  removeSubscriber(subscriber: () => void) {
    this.subscribers.delete(subscriber);
  }

  addEffect(effect: () => void) {
    this.effects.add(effect);
  }

  removeEffect(effect: () => void) {
    this.effects.delete(effect);
  }

  runEffects() {
    this.effects.forEach((effect) => effect());
  }
  updateSubscribers() {
    this.subscribers.forEach((subscriber) => subscriber());
  }
}

export const createState = <T>(initialState: T) => {
  const state = new State(initialState);
  return state;
};

export const createEffect = <T>(effect: () => void, deps: State<T>[]) => {
  deps.forEach((dep) => dep.addEffect(effect));
  return () => {
    deps.forEach((dep) => dep.removeEffect(effect));
  };
};

export const dispatch = <T>(state: State<T>, updater: (state: T) => T) => {
  state.set(updater(state.get()));
  state.updateSubscribers();
  state.runEffects();
};

export const useLibState = <T>(
  state: State<T>,
): readonly [T, (state: T) => void] => {
  // @todo: implement
  const getSnapshot = state.get;
  const setSnapshot = state.set;
  const subscribe = (subscriber: () => void) => {
    state.addSubscriber(subscriber);
    return () => {
      state.removeSubscriber(subscriber);
    };
  };
  const [syncState, setState] = useSyncExternalStore(
    subscribe,
    getSnapshot,
    setSnapshot,
  );
  return [syncState, setState];
};
