import { useState } from "react";

export default function useCustomHook() {
  const [state, setState] = useState(true);

  const changeState = () => setState((prevState) => !prevState);

  return { state, changeState };
}
