import React from "react";
import { useTouched } from "./useTouched";
import { useError } from "./useError";
import { useRenderCounter } from "./useRenderCounter";

export const ErrorComponent = ({ name }: { name: string }) => {
  const count = useRenderCounter();
  const error = useError(name);
  const touched = useTouched(name);
  console.log(name, " count", count);
  return error && touched ? (
        <p aria-live="assertive" role="alert" aria-atomic="true">
          {error}
        </p>
      ) : null
};
