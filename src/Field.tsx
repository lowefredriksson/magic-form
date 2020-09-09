import React, {
  HTMLProps,
  LabelHTMLAttributes,
  useRef,
  useEffect,
} from "react";
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
// GOOD: http://usability.com.au/2008/09/accessible-forms-using-wcag-2-0/

// The Field component is used to declare a field in a form.
// In an accessible form each form input field should have a label. Hence the form input field and corresponding label have strong cohesion.
// Therefore the library combines the two in the Field component. The field component applies component composition of a Label component and an Input component.
// The Label component prop is optional. If no label are given the default Label component will be used with the value of the name prop as content.
// If a custom Label component prop is provided it should be a React component that takes a labelText prop and a htmlFor prop.
// The optional as prop determine which kind of input field is used, either a html input element, html textarea eleemnt, html select element or a custom component.
// If no as prop is provided the html input is used as a default. The optional validate prop expects a Validation Resolver.
// If a Validation Resolver is provided the field will be include in the form validation and triggered according to the given validation strategy of the field.
// The default validation strategy is onChange. The validtion strategy can be used to limit how often the validation resolver is triggered,
// A Validation Resolver has two parameters. The first parameter is the current value of the field.
// THe second parameter is the current state of the form, i.e. the current value of all fields in the form.
//
//
// 3.3.2: Labels or Instructions
// 1.3.1: Info and Relationships
// 4.1.2: Name, Role, Value

// ARIA2: Identifying a required field with the aria-required property?
// ARIA1: Using the aria-describedby property to provide a descriptive label for user interface controls?
// ARIA14: Using aria-label to provide an invisible label where a visible label cannot be used
// SCR18: Providing client-side validation and alert https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18
// SCR19: Using an onchange event on a select element without causing a change of context
// SCR32: Providing client-side validation and adding error text via the DOM

// type HTMLInputType = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
// type HTMLSelectType = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
// type HTMLTextAreaType = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
// type InputType = HTMLInputType | HTMLSelectType | HTMLTextAreaType;

export const Field2: React.FC<
  {
    name: string;
    validate?: ValidationResolver;
    as?:
      | "input"
      | "textarea"
      | "select"
      | React.FunctionComponent<{ name: string }>;
    Label?: React.FC<{ labelText: string; htmlFor: string }>;
  } & HTMLProps<FieldRef>
> = ({ as = "input", Label, name, validate, ...rest }) => {
  const fieldProps = useFieldProps(name, { validate });
  const inputFieldProps = { ...rest, ...fieldProps };
  const inputLabel = Label ? (
    <Label labelText={name} htmlFor={`${name}_input`} />
  ) : (
    <label htmlFor={`${name}_input`}>{name}</label>
  );
  const inputField = React.isValidElement(as)
    ? React.cloneElement(as, inputFieldProps)
    : React.createElement(as, inputFieldProps);
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
