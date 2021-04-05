import React, { HTMLProps, useMemo } from "react";
import { useInputControl } from "../hooks/useInputControl";
import { ErrorResolver, FieldRef } from "../types";

type FieldInputControlProps = {
  name: string;
  as?:
    | "select"
    | "textarea"
    | "input"
    | React.FunctionComponent<{ name: string }>;
  validate?: ErrorResolver;
} & HTMLProps<FieldRef>;

export const FieldInputControl = ({
  name,
  as = "input",
  validate,
  ...props
}: FieldInputControlProps) => {
  const inputProps = useInputControl(name, { validate });
  return useMemo(() => {
    const inputControlProps = {
      ...props,
      ...inputProps,
    };
    return React.isValidElement(as)
      ? React.cloneElement(as, inputControlProps)
      : React.createElement(as, inputControlProps);
  }, [props, inputProps, as]);
};
