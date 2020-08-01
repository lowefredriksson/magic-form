import React, { useRef, useState } from "react";
import "./App.css";
import { registerRender } from "./renders";
import { getFormStateFromFields } from "./getFormStateFromFields";
import {
  FormContextType,
  FieldRef,
  FieldOptions,
  FieldsRefValue,
} from "./types";

export const MagicFormContext = React.createContext<FormContextType>({
  register: (ref, options) => {},
  fields: {},
  setTouched: (name) => {},
  getTouched: (name) => {
    return false;
  },
});

export const useMagicForm = () => {
  const fields = useRef<FieldsRefValue>({});
  const errors = useState<{ [Key in string]: string }>({});
  const touched = useState<{ [Key in string]: boolean }>({});
  const register = (ref: FieldRef, options: FieldOptions = {}) => {
    if (ref && ref.name) {
      fields.current = {
        ...fields.current,
        [ref.name]: {
          ...(fields.current[ref.name] ?? {}),
          ref,
          options,
        },
      };
    }
  };

  // const unregister = (name: string) => {
  //   return fields.current = fields.current.filter(r => r.ref.name !== name)
  // }

  const getFormValues = () => getFormStateFromFields(fields.current);

  const validateForm = async () => {
    // TODO: recive fields in order
    const _fields = Object.keys(fields.current).map((key) => {
      const field = fields.current[key];
      return field;
    });
    for (var a = 0; a < _fields.length; a++) {
      const fieldEntry = _fields[a];
      if (!fieldEntry.options.validate) {
        return false;
      }
      const value = fieldEntry.ref.value;
      const error = await fieldEntry.options.validate(value, getFormValues());
      if (error) {
        fieldEntry.ref.focus();
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = await validateForm();
    console.log("FORM VALID: ", valid);
  };

  const setTouched = (name: string) => {
    console.log("touched", name);
    fields.current = {
      ...fields.current,
      [name]: {
        ...fields.current[name],
        meta: {
          touched: true,
        },
      },
    };
  };
  const getTouched = (name: string) => {
    return !!fields.current[name]?.meta.touched;
  };

  return {
    fields: fields.current,
    register,
    getFormValues,
    onSubmit,
    setTouched,
    getTouched,
  };
};

type MagicFormProps = {
  magicForm: ReturnType<typeof useMagicForm>;
} & React.HTMLProps<HTMLFormElement>;

export const MagicForm: React.FC<MagicFormProps> = ({
  magicForm,
  children,
}: MagicFormProps) => {
  registerRender("MagicForm");
  return (
    <MagicFormContext.Provider value={magicForm}>
      <form onSubmit={magicForm.onSubmit}>{children}</form>
    </MagicFormContext.Provider>
  );
};

export type FieldSpreadProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};
