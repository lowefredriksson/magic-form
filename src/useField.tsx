import { useContext } from "react";
import { registerRender } from "./renders";
import { useError } from "./useError";
import { MagicFormContext } from "./MagicForm";
import { ErrorResolver } from "./types";

type UseFieldOptions = {
  validate?: ErrorResolver;
  revalidateFields?: string[];
  required?: boolean;
};

/**
 *
 * @param name
 * @param options
 */
export const useField = (name: string, options: UseFieldOptions = {}) => {
  const { register, setTouched } = useContext(MagicFormContext);
  const [error, errorProps] = useError(name, {
    validate: options.validate,
  });
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(name);
    errorProps.onBlur(e);
  };
  let props: { [Key: string]: any } = {
    ...errorProps,
    onBlur,
    ref: (ref: HTMLInputElement) => register(ref, options),
    name,
  };
  props["aria-invalid"] = error ? "true" : "false";
  props["aria-describyBy"] = `${name}_error`;
  if (options.required) {
    props["required"] = true;
    props["aria-required"] = true;
  }
  registerRender(name);
  return [error, props];
};
