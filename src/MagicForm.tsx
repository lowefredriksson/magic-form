import React, { useRef } from "react";
import "./App.css";
import { useField } from "./useField";
import { Error } from "./Error";
import { registerRender } from "./renders";

// Core

type ContextType = {
  fields: { [Key: string]: HTMLInputElement };
  register: (ref: HTMLInputElement | null) => void;
};

export const MagicFormContext = React.createContext<ContextType>({
  register: (ref) => {},
  fields: {},
});

export const useMagicForm = () => {
  const fields = useRef<{ [Key: string]: HTMLInputElement }>({});

  const register = (ref: HTMLInputElement | null) => {
    if (ref && ref.name) {
      fields.current[ref.name] = ref;
    }
  };

  return { fields: fields.current, register };
};

type MagicFormProps = {} & React.HTMLProps<HTMLFormElement>;

export const MagicForm: React.FC = (props: MagicFormProps) => {
  const magicForm = useMagicForm();
  registerRender("MagicForm");
  return (
    <MagicFormContext.Provider value={magicForm}>
      <form>{props.children}</form>
    </MagicFormContext.Provider>
  );
};

export type FieldSpreadProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};

//-------------------------------------------

type FieldProps = {
  name: string;
  validate?: (value: string) => Error;
  label: string;
} & React.HTMLProps<HTMLInputElement>;

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

type FieldControllerProps = {
  name: string;
  validate?: (value: string) => Error;
  children: (props: ReturnType<typeof useField>) => React.ReactElement;
};

export const FieldController = ({
  name,
  validate,
  children,
}: FieldControllerProps) => {
  const childProps = useField(name, {
    validate,
  });
  return children(childProps);
};
