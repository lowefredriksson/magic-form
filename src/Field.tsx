import React, { HTMLProps, LabelHTMLAttributes } from "react";
import { useFieldProps } from "./useFieldProps";
import { ValidationResolver, FieldRef } from "./types";
import { useFormContext } from "./useFormContext";

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

// Title, Accessible Title. Use html tags whenever possible
//

// In an accessible form each form input field should have a label. Hence the form input field and corresponding label have strong cohesion. Therefore the library combines the two in the Field component.

// type HTMLInputType = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
// type HTMLSelectType = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
// type HTMLTextAreaType = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
// type InputType = HTMLInputType | HTMLSelectType | HTMLTextAreaType;

export const Field2: React.FC<{
  name: string;
  as?:
    | "input"
    | "textarea"
    | "select"
    | React.FunctionComponent<{ name: string }>;
  Label?: React.FC<{ label: string }>;
}> = ({ as = "input", Label, name }) => {
  const fieldProps = useFieldProps(name, {});
  const _inputProps = { ...fieldProps };
  const inputLabel = Label ? (
    <Label label={name} />
  ) : (
    <label htmlFor={`${name}_input`}>{name}</label>
  );
  const inputField = React.isValidElement(as)
    ? React.cloneElement(as, _inputProps)
    : React.createElement(as, _inputProps);
  return (
    <>
      {inputLabel}
      {inputField}
    </>
  );
};

// const Submit: React.FC<{}> = () => {
//   return <input type="submit" />;
// };

// const Form: React.FC<{}> = ({ children }) => {
//   const a = useFormContext();
//   return <form onSubmit={a.}>{children}</form>;
// };

// React.children.Map would be nice to use instead of context but that would require that all form elements are imidate children of the form? If so would it hidnder any styling approaches?

// Write something nice about React.memo and maybe how it relates to Component and PureComponent?

// Write something nice about the behaviour of React.cloneElement, React.createElement, React.isValidElement
