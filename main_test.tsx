/** @jsxImportSource react */
import { assertEquals } from "@std/assert";
import { createEffect, createState, dispatch, useLibState } from "./main.ts";
import { render } from "npm:@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import ReactDOM from "react-dom/client";
GlobalRegistrator.register({});

Deno.test("State Object", function () {
  const state = createState("a");
  assertEquals(state.get(), "a");
  state.set("b");
  assertEquals(state.get(), "b");
});

Deno.test("Effects", function () {
  // Variable to check if the effect has been called
  let updateChecker = "Not Called";
  const state = createState("a");
  // Check for the effect to be called if created
  const effect = createEffect(() => {
    updateChecker = "Called";
  }, [state]);
  state.runEffects();
  assertEquals(updateChecker, "Called");
  // Check for the effect not to be called if removed
  updateChecker = "Not Called";
  effect();
  state.runEffects();
  assertEquals(updateChecker, "Not Called");
});

Deno.test("Effects with multiple dependencies", function () {
  // Variable to check if the effect has been called
  let updateChecker = "Not Called";
  const state1 = createState("a");
  const state2 = createState("b");
  // Check for the effect to be called if created
  const effect = createEffect(() => {
    updateChecker = "Called";
  }, [state1, state2]);
  state1.runEffects();
  assertEquals(updateChecker, "Called");
  updateChecker = "Not Called";
  state2.runEffects();
  assertEquals(updateChecker, "Called");
  // Check for the effect not to be called if removed
  updateChecker = "Not Called";
  effect();
  state1.runEffects();
  assertEquals(updateChecker, "Not Called");
  state2.runEffects();
  assertEquals(updateChecker, "Not Called");
});

//const state = createState({
//  count: 0,
//  name: "Arjun",
//  isLoggedIn: false,
//});
//
//const Component: React.FC = () => {
//  const [value, setValue] = useLibState(state);
//  return <div>{value.name}</div>;
//};
//Deno.test("useLibState", () => {
//  const root = ReactDOM.createRoot(document.createElement("div"));
//  root.render(<Component />);
//  const val = document.querySelector("div")!;
//  assertEquals(val.textContent, "Arjun");
//});
