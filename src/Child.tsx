import React, { useContext, useEffect } from "react";
import { useRenderCounter } from "./useRenderCounter";
import { Context } from "./Context";
import { Value } from "./types";
import { useValue } from "./useValue";

export const Child: React.FC<{
  name: string;
}> = ({ name }) => {
  const { setValue, getValue, registerField } = useContext(Context);
  useEffect(() => {
    registerField(null, name, {
      validate: (value: Value, values: Map<string, Value>) => {
        return value < 0 ? "Should be positive" : undefined;
      },
    });
  }, [registerField, name]);
  const wVal = useValue(name);
  const counter = useRenderCounter();
  const increase = () => {
    const prev = getValue(name);
    setValue(name, ((prev as number) ?? 0) - 1);
  };
  const decrease = () => {
    const prev = getValue(name);
    setValue(name, ((prev as number) ?? 0) + 1);
  };
  return (
    <>
      <div>
        {name} {counter}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button type="button" onClick={increase}>
          Minus
        </button>
        The watch {wVal}
        <button type="button" onClick={decrease}>
          Plus
        </button>
      </div>
    </>
  );
};
