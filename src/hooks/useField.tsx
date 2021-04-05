import React, { HTMLProps, useRef } from "react";
import { useInputControl } from "./useInputControl";
import { ErrorResolver, FieldRef } from "../types";
import { FieldError } from "../API/FieldError";

type FieldConfig = {
  name: string;
  label: string;
  validate?: ErrorResolver;
  as?: "input" | "select" | "textarea";
  inputControlProps?: HTMLProps<FieldRef>;
};

export const useField = (config: FieldConfig) => {
  const fieldProps = useInputControl(config.name, {
    validate: config.validate,
  });
  const inputControlProps = {
    ...config.inputControlProps,
    ...fieldProps,
  };
  const { current: inputControlElement } = useRef(
    config.as === "select" ? (
      <select {...inputControlProps} />
    ) : config.as === "textarea" ? (
      <textarea {...inputControlProps} />
    ) : (
      <input {...inputControlProps} />
    )
  );
  const { current: labelElement } = useRef(
    <label htmlFor={`${config.name}_input`}>{config.label}</label>
  );
  const { current: errorElement } = useRef(<FieldError name={config.name} />);
  const { current: fieldElement } = useRef(
    <>
      {labelElement}
      {inputControlElement}
      {errorElement}
    </>
  );
  return [
    fieldElement,
    {
      inputControlElement,
      InputControl: (props: typeof inputControlElement.props) => (
        <inputControlElement.type {...inputControlElement.props} {...props} />
      ),
      labelElement,
      errorElement,
    },
  ] as [
    JSX.Element,
    {
      InputControl: React.FC;
      inputControlElement: JSX.Element;
      labelElement: JSX.Element;
      errorElement: JSX.Element;
    }
  ];
};
