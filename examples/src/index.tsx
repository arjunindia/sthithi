import ReactDOM from "react-dom/client";
import {
  createEffect,
  createState,
  dispatch,
  useLibState,
} from "../../main.ts";

const state = createState({
  count: 0,
  name: "Arjun",
  isLoggedIn: false,
});
const incrementCount = () => {
  dispatch(state, (prevState) => ({
    ...prevState,
    count: prevState.count + 1,
  }));
};
createEffect(() => {
  console.log("User State Changed", state.get());
}, [state]);
export const UserComponent = () => {
  const [userState, _] = useLibState(state);

  return (
    <>
      <h1>User Component</h1>
      <p>Count: {userState.count}</p>
      <p>Name: {userState.name}</p>
      <p>Is Logged In: {userState.isLoggedIn}</p>
      <button
        onClick={incrementCount}
      >
        Increment Count
      </button>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<UserComponent />);
