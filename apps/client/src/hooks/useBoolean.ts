import { useState } from "react";

export function useBoolean(defaultValue: boolean = false) {
  const [bool, setBool] = useState(defaultValue);

  function setTrue() {
    setBool(true);
  }

  function setFalse() {
    setBool(false);
  }

  function toggle() {
    setBool(() => !bool);
  }

  return { bool, setBool, setTrue, setFalse, toggle };
}

export type UseBooleanReturn = ReturnType<typeof useBoolean>;
