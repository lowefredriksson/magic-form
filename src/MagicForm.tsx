import React, { useRef } from "react";
import "./App.css";
import { registerRender } from "./renders";

// Core

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

  return { fields: fields.current, register };
};

type MagicFormProps = {} & React.HTMLProps<HTMLFormElement>;

export const MagicForm: React.FC = (props: MagicFormProps) => {
  const magicForm = useMagicForm();
  registerRender("MagicForm");
  return (
    <MagicFormContext.Provider value={magicForm}>
      <form
        style={{
          padding: 20,
          borderRadius: 10,
          margin: 100,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          display: "flex",
          width: 500,
          borderColor: "#333",
          borderStyle: "solid",
          borderWidth: 1,
          alignSelf: "center",
        }}
      >
        {props.children}
      </form>
    </MagicFormContext.Provider>
  );
};

export type FieldSpreadProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};
