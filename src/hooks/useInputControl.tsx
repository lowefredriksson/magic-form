import React, { useCallback, useMemo } from "react";
import { useFormContext } from "./useFormContext";
import { FieldConfig, FieldRef, ContextType } from "../types";
import { useError } from "./useError";
import { useObservedValue } from "./useObserver";
import { getErrorId } from "./getErrorId";

const getMultipleSelectValue = (
  options: HTMLOptionElement[] | HTMLOptionsCollection
): string[] =>
  [...options]
    .filter(({ selected }): boolean => selected)
    .map(({ value }): string => value);

// type guards
const isCheckboxInput = (element: FieldRef): element is HTMLSelectElement =>
  element.type === "checkbox";
const isRadioInput = (element: FieldRef): element is HTMLInputElement =>
  element.type === "radio";
const isFileInput = (element: FieldRef): element is HTMLSelectElement =>
  element.type === "file";
const isMultipleSelect = (element: FieldRef): element is HTMLSelectElement =>
  element.type === "select";

const getFieldValue = (target: FieldRef & EventTarget) => {
  if (isFileInput(target)) {
    return (target as any).files;
  } else if (isRadioInput(target)) {
    return (target as any).value;
  } else if (isMultipleSelect(target)) {
    return getMultipleSelectValue(target.options);
  } else if (isCheckboxInput(target)) {
    return (target as any).checked;
  }
  return target.value;
};

export const useInputControl = (
  name: string,
  config: FieldConfig,
  context?: ContextType
) => {
  const _context = useFormContext();
  const { setValue, setTouched, registerField, registerDescriptionObserver } =
    context || _context;
  const error = useError(name);
  const describedBy = useObservedValue(name, registerDescriptionObserver);
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
  const ariaDescribedBy = useMemo(() => {
    if (describedBy && (describedBy.length ?? 0) > 0) {
      return [getErrorId(name), ...describedBy].join(" ");
    }
    return getErrorId(name);
  }, [describedBy, name]);
  return {
    name,
    id: `${name}_input`,
    onChange,
    onBlur,
    ref: register,
    "aria-invalid": error ? true : false,
    "aria-describedby": ariaDescribedBy,
  };
};

// const useErrorAriaProps = (name: string) => {
//   const error = useError(name);
//   return {
//     id: getErrorId(name),
//     role: "alert",
//     ["aria-atomic"]: "true",
//   };
// };
