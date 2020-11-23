import React, { useEffect, useRef } from "react";
import { useFormContext } from "../hooks/useFormContext";
import { uniqueId } from "../utils/uniqueId";

const useRegisterDescription = (name: string) => {
  const { addDescription, removeDescription } = useFormContext();
  const { current: id } = useRef(uniqueId(`${name}_description`));
  useEffect(() => {
    addDescription(name, id);
    return () => removeDescription(name, id);
  }, [addDescription, removeDescription, name, id]);
  return id;
};

type FieldDescriptionProps = {
  name: string;
};

export const FieldDescription: React.FC<FieldDescriptionProps> = ({
  name,
  ...rest
}) => {
  const id = useRegisterDescription(name);
  return <span id={id} {...rest} />;
};
