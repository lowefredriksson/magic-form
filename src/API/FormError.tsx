import React from "react";
import { useFormStatus } from "../hooks/useFormStatus";
// ARIA 19: Using ARIA role=alert or Live Regions to Identify Errors technique.
export function FormError(props: { element?: React.ReactElement }) {
  const error = useFormStatus("error");
  return error
    ? React.cloneElement(props.element ? props.element : <div />, {
        role: "status",
        children: error,
      })
    : null;
}
