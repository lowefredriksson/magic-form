import React, { useRef } from "react";
import "./App.css";
import { registerRender } from "./renders";
import { getFormStateFromFields } from "./getFormStateFromFields";
import { cursorTo } from "readline";


type MagicError = {
  message: string
} | null;

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

  const getFormState = () => getFormStateFromFields(fields.current);

  return { fields: fields.current, register, getFormState };

};

type MagicFormProps = { magicForm: ReturnType<typeof useMagicForm> } & React.HTMLProps<HTMLFormElement>;

export const MagicForm: React.FC<MagicFormProps> = ({ magicForm, children }: MagicFormProps) => {
  registerRender("MagicForm");
  const formRef = useRef<HTMLFormElement>();
  const onClick = () => { 
    //
    // console.log(
    //   "formRef", 
    //   // 
    //   (elements as any[]).reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {})
    // ); 
  }
  return (
    <MagicFormContext.Provider value={magicForm}>
      <form ref={formRef as any}>{children}</form>
      <button 
        type="button" 
        onClick={onClick}>Log form</button>
    </MagicFormContext.Provider>
  );
};

export type FieldSpreadProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};
