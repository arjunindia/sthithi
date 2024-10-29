# State Management Library

## What this library does
- It provides a simple way to manage state in a React project.
- Uses useSyncExternalStore under the hood.

## How to use 
- Write state anywhere in your project.

```tsx
import { createState, createEffect, dispatch } from "stithi";

const userState = createState({
    count: 0,
    name: "Arjun",
    isLoggedIn: false,
});

const incrementCount = () => {
    dispatch(userState, (prevState) => ({
        ...prevState,
        count: prevState.count + 1,
    }));
};

createEffect(() => {
    console.log("User State Changed", userState);
}, [userState]);

export { userState };
```

- Use the state in a react component.

```tsx
import { useLibState } from "stithi";
import { userState } from "./userState";

export const UserComponent = () => {
    const [userState,setUserState] = useLibState(userState);``

    return (
        <>
            <h1>User Component</h1>
            <p>Count: {userState.count}</p>
            <p>Name: {userState.name}</p>
            <p>Is Logged In: {userState.isLoggedIn}</p>
            <button onClick={() => setUserState((prevState) => ({
                ...prevState,
                count: prevState.count + 1,
            }))}>
                Increment Count
            </button>
        </>
    );
};
```

## How it works

### createState

```tsx
const userState = createState({
    count: 0,
    name: "Arjun",
    isLoggedIn: false,
});
```

This creates a state object with the specified initial state. The state object cannot be modified directly, but you can use the dispatch function to update the state.

### createEffect

```tsx
createEffect(() => {
    console.log("User State Changed", userState);
}, [userState]);
```

This creates an effect that will be triggered whenever the userState object changes. The effect function receives the current state of the userState object as an argument. This will run after all component updates are completed.

### dispatch

```tsx
const incrementCount = () => {
    dispatch(userState, (prevState) => ({
        ...prevState,
        count: prevState.count + 1,
    }));
};
```

This function allows you to dispatch a new state to the userState object. The dispatch function takes two arguments: the state object and a function that returns the new state. The function is called with the current state of the userState object as an argument and should return the new state.

### useLibState

```tsx
const [userState,setUserState] = useLibState(userState);
```

This function returns a tuple with current state and a setter function. The setter function can be used to update the state. This function should be similar to useState in React.

## Contributing

Please open an issue about features/bugs first before submitting a pull request. Though this project is supposed to be simple, I'm open to suggestions and/or improvements.
