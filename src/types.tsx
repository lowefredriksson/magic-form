import { ErrorType } from "./Error";

export type FieldRef = HTMLInputElement | HTMLSelectElement;

export type FieldsRefValue = {
  [Key in string]: {
    ref: FieldRef;
    meta: { touched: boolean; error?: ErrorType | null };
    options: FieldOptions;
  };
};

export type FormContextType = {
  fields: FieldsRefValue;
  register: (ref: FieldRef, options?: FieldOptions) => void;
  setTouched: (name: string) => void;
  getTouched: (name: string) => boolean;
};

export type ErrorResolver = (
  value: string,
  fields: {
    [Key: string]: string;
  }
) => Promise<ErrorType | null>;

export type FieldOptions = {
  validate?: ErrorResolver;
  required?: boolean;
};
