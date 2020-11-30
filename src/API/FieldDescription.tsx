import React, { useEffect, useRef } from "react";
import { useFormContext } from "../hooks/useFormContext";
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

export type CustomDescriptionComponent = React.FC<{
  id: string;
}>;

type FieldDescriptionProps = {
  name: string;
  Component?: CustomDescriptionComponent;
};

export const FieldDescription: React.FC<FieldDescriptionProps> = ({
  name,
  Component,
  ...rest
}) => {
  const id = useRegisterDescription(name);
  if (Component) {
    return <Component id={id} {...rest} />;
  }

  return <span id={id} {...rest} />;
};
