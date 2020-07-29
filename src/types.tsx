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

export type FormContextType = {
  fields: { ref: FieldRef; options?: FieldOptions; }[];
  register: (ref: FieldRef, options?: FieldOptions) => void;
};
