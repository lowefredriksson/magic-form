import React from "react";
import { useTouched } from "./useTouched";
import { useError } from "./useError";
import { useRenderCounter } from "./useRenderCounter";

/**
 * The Error component is used to display field errors in an accessible way. 
 * 
 * The component is only rerendered if error or touched state of the field is changed. 
 * 
 * The Error Component implements the ARIA19 technique to display errors. 
 * 
 * 
 * ARIA19: Using ARIA role=alert or Live Regions to Identify Errors
 */

export const Error = ({ name }: { name: string }) => {
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
