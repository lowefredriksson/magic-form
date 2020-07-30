import { ErrorType } from "./Error";

export type FieldOptions = {
  validate?: (
    value: string,
    fields: {
      [Key: string]: any;
    }
  ) => Promise<ErrorType>;
  required?: boolean;
};

export type FieldRef = HTMLInputElement | HTMLSelectElement;

export type FieldsRefValue = { [Key in string]: { ref: FieldRef, meta: { touched: boolean, error?: ErrorType | null }, options: FieldOptions } }

export type FormContextType = {
  fields: FieldsRefValue;
  register: (ref: FieldRef, options?: FieldOptions) => void;
  setTouched: (name: string) => void;
  getTouched: (name: string) => boolean; 
};
