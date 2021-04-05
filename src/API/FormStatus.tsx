import React from "react";
import { useFormStatus } from "../hooks/useFormStatus";

export const FormStatus = () => (
  <>
    <FormStatusSuccess />
    <FormStatusError />
  </>
);

// ARIA 22: Using role=status to present status messages.
export function FormStatusSuccess(props: { element?: React.ReactElement }) {
  const success = useFormStatus("success");
  return success
    ? React.cloneElement(props.element ? props.element : <div />, {
        role: "status",
        children: success,
      })
    : null;
}

// ARIA 19: Using ARIA role=alert or Live Regions to Identify Errors technique.
export function FormStatusError(props: { element?: React.ReactElement }) {
  const error = useFormStatus("error");
  return error
    ? React.cloneElement(props.element ? props.element : <div />, {
        role: "status",
        children: error,
      })
    : null;
}
