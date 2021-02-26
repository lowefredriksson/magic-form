import { useEffect, useRef } from "react";
import { useFormContext } from "./useFormContext";
import { uniqueId } from "../utils/uniqueId";

export const useRegisterDescription = (name: string) => {
  const { addDescription, removeDescription } = useFormContext();
  const { current: id } = useRef(uniqueId(`${name}_description`));
  useEffect(() => {
    addDescription(name, id);
    return () => removeDescription(name, id);
  }, [addDescription, removeDescription, name, id]);
  return id;
};
