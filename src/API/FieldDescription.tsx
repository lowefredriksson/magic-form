import React from "react";
import { useRegisterDescription } from "../hooks/useRegisterDescription";

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
