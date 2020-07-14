import React, { useContext } from "react";
import { registerRender } from "./renders";
import { useError } from "./useError";
import { MagicFormContext, useMagicForm } from "./MagicForm";
import { Error } from "./Error";
/**
 *
 * @param name
 * @param options
 */

export const useField = (
  name: string,
  options: { validate?: (value: string) => Error; required?: boolean } = {}
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
