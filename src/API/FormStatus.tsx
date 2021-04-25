import React from "react";
import { useFormStatus } from "../hooks/useFormStatus";

// ARIA 22: Using role=status to present status messages.
export function FormStatus(props: { element?: React.ReactElement }) {
  const success = useFormStatus("success");
  return success
    ? React.cloneElement(props.element ? props.element : <div />, {
        role: "status",
        children: success,
      })
    : null;
}
