import React, { useCallback, useContext } from "react";
import { Context } from "./Context";
import { FieldConfig, FieldRef } from "./types";
import { useError } from "./useListener";
const useFieldAriaProps = (name: string) => {
  const error = useError(name);
  let props: any = {};
  props["aria-invalid"] = error ? "true" : "false";
  props["aria-describyBy"] = `${name}_error`;
  return props;
};
export const useFieldProps = (name: string, config: FieldConfig) => {
  const { setValue, setTouched, registerField } = useContext(Context);
  const onChange = useCallback(
    (event: React.ChangeEvent<FieldRef>) => {
      if (event.target.type === "checkbox") {
        setValue(name, (event.target as any).checked);
      } else {
        setValue(name, event.target.value);
      }
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
    ariaProps,
  };
};
