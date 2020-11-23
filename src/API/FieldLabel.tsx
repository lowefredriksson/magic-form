import React, { HTMLProps } from "react";

type FieldLabelProps = {
  name: string;
} & HTMLProps<HTMLLabelElement>;

export const FieldLabel: React.FC<FieldLabelProps> = ({ name, ...rest }) => (
  <label {...rest} htmlFor={`${name}_input`} />
);
