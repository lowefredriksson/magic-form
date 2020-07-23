import React from "react";
import { useField } from "./useField";
import { ErrorType, Error } from "./Error";
//-------------------------------------------

export const Field = ({ name, validate, label, ...inputProps }: FieldProps) => {
  const [error, fieldProps] = useField(name, {
    validate,
  });
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input id={name} {...inputProps} {...fieldProps} />
      <Error name={name} error={error as ErrorType | null}/>
      {/* {error ? <div id={`${name}_error`}>{error.message}</div> : null} */}
    </>
  );
};

type FieldProps = {
  name: string;
  validate?: (
    value: string,
    formState: {
      [Key: string]: any;
    }
  ) => Promise<ErrorType>;
  required?: boolean;
  label: string;
} & React.HTMLProps<HTMLInputElement>;
