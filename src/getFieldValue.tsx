import { useContext } from "react";
import { MagicFormContext } from "./MagicForm";

export const getFieldValue = (name: string) => {
  return "hej";
};

export const useFieldRef = (name: string) => {
  const { fields } = useContext(MagicFormContext);
  return fields[name];
};
