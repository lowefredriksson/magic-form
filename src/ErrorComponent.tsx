import React from "react";
import { useTouched } from "./useTouched";
import { useError } from "./useError";
import { useRenderCounter } from "./useRenderCounter";

export const ErrorComponent = ({ name }: { name: string }) => {
  const count = useRenderCounter();
  const error = useError(name);
  const touched = useTouched(name);
  return (
    <div
      style={{
        padding: "5px",
        borderRadius: "10px",
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <p>Renders {count}</p>
      {error && touched ? (
        <p aria-live="assertive" role="alert" aria-atomic="true">
          {error}
        </p>
      ) : null}
    </div>
  );
};
