import React from "react";
import { useField } from "./useField";
import { ErrorType, Error } from "./Error";
import { ErrorResolver } from "./types";
//-------------------------------------------

export const Input = ({
  name,
  validate,
  revalidateFields,
  label,
  ...inputProps
}: InputProps) => {
  const [error, fieldProps] = useField(name, {
    validate,
    revalidateFields,
  });
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input id={name} {...inputProps} {...fieldProps} />
      <Error name={name} error={error as ErrorType | null} />
    </>
  );
};

type InputProps = {
  name: string;
  revalidateFields?: string[];
  validate?: ErrorResolver;
  required?: boolean;
  label: string;
} & React.HTMLProps<HTMLInputElement>;
