import React, { HTMLProps, useMemo } from "react";
import { useInputControlProps } from "../hooks/useInputControlProps";
import { ValidationResolver, FieldRef } from "../types";

type FieldInputControlProps = {
  name: string;
  as?:
    | "select"
    | "textarea"
    | "input"
    | React.FunctionComponent<{ name: string }>;
  validate?: ValidationResolver;
} & HTMLProps<FieldRef>;

export const FieldInputControl = ({
  name,
  as = "input",
  validate,
  ...props
}: FieldInputControlProps) => {
  const inputProps = useInputControlProps(name, { validate });
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
