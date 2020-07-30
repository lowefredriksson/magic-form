import { useContext, useState } from "react";
import { registerRender } from "./renders";
import { useError } from "./useError";
import { MagicFormContext } from "./MagicForm";
import { ErrorType } from "./Error";

const useTouched = (name: string) => {

  const [touched, setTouched] = useState(false);

  const onBlur = () => {
    if (touched === false) {
      setTouched(true);
    }
  }

  return [touched, { onBlur }]

}

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
        [Key: string]: any;
      }
    ) => Promise<ErrorType>;
    required?: boolean;
  } = {}
) => {
  const { register, setTouched, getTouched } = useContext(MagicFormContext);
  const [error, errorProps] = useError(name, {
    validate: options.validate,
  });
  let props: { [Key: string]: any } = {
    ...errorProps,
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
