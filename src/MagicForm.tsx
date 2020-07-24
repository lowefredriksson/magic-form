import React, { useRef } from "react";
import "./App.css";
import { registerRender } from "./renders";
import { getFormStateFromFields } from "./getFormStateFromFields";
import { ErrorType } from "./Error";

type ContextType = {
  fields: { ref: HTMLInputElement, options?: FieldOptions }[];
  register: (ref: HTMLInputElement | null, options?: FieldOptions) => void;
};

type FieldOptions = {
  validate?: (
    value: string,
    fields: {
      [Key: string]: any;
    }
  ) => Promise<ErrorType>;
  required?: boolean;
} 

export const MagicFormContext = React.createContext<ContextType>({
  register: (ref) => {},
  fields: [],
});

export const useMagicForm = () => {

  const fields = useRef<{ ref: HTMLInputElement, options: FieldOptions }[]>([]);

  const register = (ref: HTMLInputElement | null, options: FieldOptions = {}) => {
    if (ref && ref.name) {
      fields.current = [...fields.current.filter(r => r.ref.name !== ref.name) ,({ ref, options })];
    }
  };

  const getFormState = () => getFormStateFromFields(fields.current.map(({ ref }) => ref));

  const validateForm = async () => {
    const _fields = fields.current.map(({ ref }) => ref);
    for (var a = 0; a < fields.current.length; a++) {
      const fieldEntry = fields.current[a]
      if (!fieldEntry.options.validate) {
        return false;
      }
      const value = fieldEntry.ref.value;
      const error = await fieldEntry.options.validate(value, _fields);
      if (error.value === true) {
        fieldEntry.ref.focus();
        return false;
      }
    }
    return true
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = await validateForm();
    console.log("FORM VALID: ", valid);
  }

  return { fields: fields.current, register, getFormState, onSubmit };

};

type MagicFormProps = { magicForm: ReturnType<typeof useMagicForm> } & React.HTMLProps<HTMLFormElement>;

export const MagicForm: React.FC<MagicFormProps> = ({ magicForm, children }: MagicFormProps) => {
  registerRender("MagicForm");
  const formRef = useRef<HTMLFormElement>();
  const onClick = () => { 

  }
  return (
    <MagicFormContext.Provider value={magicForm}>
      <form ref={formRef as any} onSubmit={magicForm.onSubmit} >{children}</form>
      <button 
        type="button" 
        onClick={onClick}>Log form</button>
    </MagicFormContext.Provider>
  );
};

export type FieldSpreadProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};
