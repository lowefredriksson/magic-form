import React, { HTMLProps } from "react";
import { useFieldProps } from "./useFieldProps";
import { ValidationResolver, FieldRef } from "./types";

// Render prop vs React.cloneElement(props.children, props);
// https://medium.com/@justynazet/passing-props-to-props-children-using-react-cloneelement-and-render-props-pattern-896da70b24f6
// https://frontarm.com/james-k-nelson/passing-data-props-children/
export const Field: React.FC<
  {
    name: string;
    validate?: ValidationResolver;
    as?: string;
  } & HTMLProps<FieldRef>
> = ({ name, validate, as, children, ...inputProps }) => {
  const fieldProps = useFieldProps(name, {
    validate,
  });
  const props = { ...inputProps, ...fieldProps };
  if (as) {
    return React.isValidElement(as)
      ? React.cloneElement(as, props)
      : React.createElement(as, props);
  }
  return <input {...props} />;
};
