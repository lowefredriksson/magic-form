import React from "react";
import { useField } from "./useField";
import { Error } from "./Error";
//-------------------------------------------

export const Field = ({ name, validate, label, ...inputProps }: FieldProps) => {
  const [error, fieldProps] = useField(name, {
    validate,
  });
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input id={name} {...inputProps} {...fieldProps} />
      {error ? <div id={`${name}_error`}>{error.message}</div> : null}
    </>
  );
};

type FieldProps = {
  name: string;
  validate?: (
    value: string,
    fields: {
      [Key: string]: HTMLInputElement;
    }
  ) => Promise<Error>;
  required?: boolean;
  label: string;
} & React.HTMLProps<HTMLInputElement>;
