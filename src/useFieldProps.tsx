import React, { useCallback } from "react";
import { useFormContext } from "./useFormContext";
import { FieldConfig, FieldRef, ContextType } from "./types";
import { useError } from "./useError";

export const getErrorId = (name: string) => {
  const id = `${name}_error`;
  console.log(id);
  return id;
};

export const useLabelProps = (name: string) => {
  const error = useError(name);
  return {
    htmlFor: `${name}_input`,
  };
};

const useErrorAriaProps = (name: string) => {
  const error = useError(name);
  return {
    id: getErrorId(name),
    ["aria-live"]: "assertive",
    role: "alert",
    ["aria-atomic"]: "true",
  };
};

const useFieldAriaProps = (name: string) => {
  const error = useError(name);
  return {
    ["aria-invalid"]: error ? "true" : "false",
    ["aria-describedby"]: getErrorId(name),
  };
};

const getMultipleSelectValue = (
  options: HTMLOptionElement[] | HTMLOptionsCollection
): string[] =>
  [...options]
    .filter(({ selected }): boolean => selected)
    .map(({ value }): string => value);

type RadioFieldResult = {
  isValid: boolean;
  value: number | string;
};

const defaultReturn: RadioFieldResult = {
  isValid: false,
  value: "",
};

const getRadioValue = (
  options?: { ref: HTMLInputElement }[]
): RadioFieldResult =>
  Array.isArray(options)
    ? options.reduce(
        (previous, option): RadioFieldResult =>
          option && option.ref.checked
            ? {
                isValid: true,
                value: option.ref.value,
              }
            : previous,
        defaultReturn
      )
    : defaultReturn;

// type guards
const isCheckboxInput = (element: FieldRef): element is HTMLSelectElement =>
  element.type === "checkbox";
const isRadioInput = (element: FieldRef): element is HTMLInputElement =>
  element.type === "radio";
const isFileInput = (element: FieldRef): element is HTMLSelectElement =>
  element.type === "file";
const isMultipleSeletct = (element: FieldRef): element is HTMLSelectElement =>
  false;

const getFieldValue = (target: FieldRef & EventTarget) => {
  if (isFileInput(target)) {
    return (target as any).files;
  } else if (isRadioInput(target)) {
    //return getRadioValue(target.options)
  } else if (isMultipleSeletct(target)) {
    return getMultipleSelectValue(target.options);
  } else if (isCheckboxInput(target)) {
    return (target as any).checked;
  }
  return target.value;
};

export const useFieldProps = (
  name: string,
  config: FieldConfig,
  context?: ContextType
) => {
  const _context = useFormContext();
  const { setValue, setTouched, registerField } = context || _context;
  const onChange = useCallback(
    (event: React.ChangeEvent<FieldRef>) => {
      setValue(name, getFieldValue(event.target));
    },
    [setValue, name]
  );
  const onBlur = useCallback(
    (event: React.FocusEvent<FieldRef>) => {
      setTouched(name);
    },
    [setTouched, name]
  );
  const register = useCallback(
    (ref: FieldRef | null) => {
      registerField(ref, name, config);
    },
    [name, config, registerField]
  );
  const ariaProps = useFieldAriaProps(name);
  return {
    name,
    id: `${name}_input`,
    onChange,
    onBlur,
    ref: register,
    ...ariaProps,
  };
};
