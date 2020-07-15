import React, { useContext } from "react";
import { registerRender } from "./renders";
import { useError } from "./useError";
import { MagicFormContext } from "./MagicForm";
import { Error } from "./Error";
/**
 *
 * @param name
 * @param options
 */

export const useField = (
  name: string,
  options: {
    validate?: (
      value: string,
      fields: {
        [Key: string]: HTMLInputElement;
      }
    ) => Promise<Error>;
    required?: boolean;
  } = {}
) => {
  const { register } = useContext(MagicFormContext);
  const [error, fieldProps] = useError(name, {
    validate: options.validate,
  });
  let props: { [Key: string]: any } = {
    ...fieldProps,
    ref: register,
    name,
  };
  props["area-invalid"] = error ? "true" : "false";
  props["area-describyBy"] = `${name}_error`;
  if (options.required) {
    props["required"] = true;
    props["aria-required"] = true;
  }
  registerRender(name);
  return [error, props];
};
