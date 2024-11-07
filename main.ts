import { useSyncExternalStore } from "react";

class State<T> {
  /** The current state of the store */
  private state: T;
  /** The subscribers to the store
   *  A subscriber is a function that is recalled when the state changes so that it now reflects the new state
   */
  private subscribers: Set<(state?: T) => void>;
  /** The effects to be run when the state changes
   *  An effect is a function that is called when one or more of the dependent states change
   */
  private effects: Set<(state?: T) => void>;

  constructor(initialState: T) {
    this.state = initialState;
    this.subscribers = new Set();
    this.effects = new Set();
  }

  /** Get the current state of the store. This does not trigger re-renders. */
  get(): T {
    return this.state;
  }

  /** Set the current state of the store. This does not trigger re-renders. */
  set(newState: T) {
    this.state = newState;
  }

  /** Add a function that subscribes to the store. */
  addSubscriber(subscriber: () => void): void {
    this.subscribers.add(subscriber);
  }

  /** Remove a function that subscribes to the store. */
  removeSubscriber(subscriber: () => void): void {
    this.subscribers.delete(subscriber);
  }

  /** Add a side-effect to the store. */
  addEffect(effect: () => void): void {
    this.effects.add(effect);
  }

  /** Remove a side-effect from the store. */
  removeEffect(effect: () => void): void {
    this.effects.delete(effect);
  }

  /** Run all the effects that depend on the current state. */
  runEffects(): void {
    this.effects.forEach((effect) => effect());
  }

  /** Run and update all the subscribers. */
  updateSubscribers(): void {
    this.subscribers.forEach((subscriber) => subscriber());
  }
}

/** Create a new global state object. This is the main entry point for creating a state object.
 * @param initialState The initial state of the store.
 * @returns A state object that can be used to access the current state and subscribe to changes.
 */
export const createState = <T>(initialState: T): State<T> => {
  const state = new State<T>(initialState);
  return state;
};

/** Create a new effect. This is the main entry point for creating a side-effect.
 * @param effect The side-effect to be run when the state changes.
 * @param deps The dependent states that the effect depends on.
 * @returns A function that removes the effect from the store.
 */
export const createEffect = <T>(
  effect: () => void,
  deps: State<T>[],
): () => void => {
  deps.forEach((dep) => dep.addEffect(effect));
  return () => {
    deps.forEach((dep) => dep.removeEffect(effect));
  };
};

/**
 * Dispatch a new state to the store. This will trigger a re-render of all subscribers.
 * This function does not subscribe to the store. The use for this is to update the state from outside the component, from a component that is not subscribed to the store.
 * This helps avoid unnecessary re-renders.
 * The updater function is called with the current state and should return the new state.
 * @param state The state object to dispatch to.
 * @param updater The updater function that takes the current state and returns the new state.
 * @example
 * import { createState, dispatch } from "sthithi";
 * const state = createState(0);
 * const increment = () => dispatch(state, (prevState) => prevState + 1);
 * const decrement = () => dispatch(state, (prevState) => prevState - 1);
 */
export const dispatch = <T>(
  state: State<T>,
  updater: (state: T) => T,
): void => {
  state.set(updater(state.get()));
  state.updateSubscribers();
  state.runEffects();
};

type SetStateParams<T> = T | ((prevState: T) => T);
type DispatchParams<T> = (state: SetStateParams<T>) => void;

/** useLibState is a custom hook that allows you to use the state object in a React component.
 * It returns a tuple of the current state and a function that dispatches a new state to the store.
 * @param state The state object to use.
 * @returns A tuple of the current state and a function that dispatches a new state to the store.
 */
export const useLibState = <T>(
  state: State<T>,
): readonly [T, DispatchParams<T>] => {
  const getSnapshot = () => state.get();
  const setSnapshot = (newState: T) => {
    state.set(newState);
  };
  const subscribe = (subscriber: () => void) => {
    state.addSubscriber(subscriber);
    return () => {
      state.removeSubscriber(subscriber);
    };
  };

  const setState = (newState: SetStateParams<T>) => {
    if (newState instanceof Function) {
      setSnapshot(newState(state.get()));
      state.updateSubscribers();
      state.runEffects();
      return;
    }
    setSnapshot(newState);
    state.updateSubscribers();
    state.runEffects();
  };
  const syncState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    setSnapshot,
  );
  return [syncState, setState];
};
