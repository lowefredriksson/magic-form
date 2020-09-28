import React, { HTMLProps } from "react";
import { useFieldProps } from "./useFieldProps";
import { ValidationResolver, FieldRef } from "./types";

// Render prop vs React.cloneElement(props.children, props);
// https://medium.com/@justynazet/passing-props-to-props-children-using-react-cloneelement-and-render-props-pattern-896da70b24f6
// https://frontarm.com/james-k-nelson/passing-data-props-children/

// Title, Accessible Title. Use html tags whenever possible
// GOOD: http://usability.com.au/2008/09/accessible-forms-using-wcag-2-0/

/* 
The Field component is used to declare a field in a form.
According to WCAG 2.1 bla bla an accessible form each form input field should have a label. The Field component implements the H44 technique which is a 
sufficient technique for Success Criteria 1.1.1, 1.3.1 and 4.1.2. If the label is visually present the Success Criteria 3.3.2 is also sufficently satisfied. 
Hence the form input field and corresponding label have strong cohesion, therefore the library combines the two in the Field component. 
The Field component applies component composition of a Label component and an Input component. 
The Label component prop is optional. If no label are given the default Label component will be used with the value of the name prop as content.
If a custom Label component prop is provided it should be a React component that takes a labelText prop and a htmlFor prop.
The optional as prop determine which kind of input field is used, either a html input element, html textarea eleemnt, html select element or a custom component.
If no as prop is provided the html input is used as a default. The optional validate prop expects a Validation Resolver.
If a Validation Resolver is provided the field will be include in the form validation and triggered according to the given validation strategy of the field.
The default validation strategy is onChange. The validtion strategy can be used to limit how often the validation resolver is triggered,
A Validation Resolver has two parameters. The first parameter is the current value of the field.
The second parameter is the current state of the form, i.e. the current value of all fields in the form. 
*/
//
/* 
  3.3.2: Labels or Instructions 
  The intent of this Success Criterion is to have content authors present instructions or labels that identify the controls in a form so that users know what input data is expected. 
  Instructions or labels may also specify data formats for fields especially if they are out of the customary formats or if there are specific rules for correct input.
  Content authors may also choose to make such instructions available to users only when the individual control has focus especially when instructions are long and verbose.
*/
/* 1.3.1: Info and Relationships
  The intent of this Success Criterion is to ensure that information and relationships that are implied by visual or auditory formatting are preserved when the presentation format changes. 
  For example, the presentation format changes when the content is read by a screen reader or when a user style sheet is substituted for the style sheet provided by the author.
*/
// 4.1.2: Name, Role, Value
// H44: Using label elements to associate text labels with form controls (HTML)
// H65: Using the title attribute to identify form controls when the label element cannot be used (HTML)
// ARIA2: Identifying a required field with the aria-required property?

// ARIA18: Using aria-alertdialog to Identify Errors
// ARIA21: Using Aria-Invalid to Indicate An Error Field
// ARIA19: Using ARIA role=alert or Live Regions to Identify Errors

// ARIA1: Using the aria-describedby property to provide a descriptive label for user interface controls?
// ARIA14: Using aria-label to provide an invisible label where a visible label cannot be used
// SCR18: Providing client-side validation and alert https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18
// SCR19: Using an onchange event on a select element without causing a change of context
// SCR32: Providing client-side validation and adding error text via the DOM

// type HTMLInputType = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
// type HTMLSelectType = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
// type HTMLTextAreaType = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
// type InputType = HTMLInputType | HTMLSelectType | HTMLTextAreaType;
type FieldProps = {
  name: string;
  validate?: ValidationResolver;
  as?:
    | "input"
    | "textarea"
    | "select"
    | React.FunctionComponent<{ name: string }>;
  Label?: React.FC<{ labelText: string; htmlFor: string }>;
  label?: string;
  //labelVisuallyHidden: boolean
} & HTMLProps<FieldRef>;

export const Field: React.FC<FieldProps> = ({
  as = "input",
  Label,
  label,
  name,
  validate,
  ...rest
}) => {
  const fieldProps = useFieldProps(name, { validate });
  const inputFieldProps = {
    ...rest,
    ...fieldProps,
  };
  const labelText = label ? label : name;
  const labelElement = Label ? (
    <Label labelText={labelText} htmlFor={`${name}_input`} />
  ) : (
    <label htmlFor={`${name}_input`}>{labelText}</label>
  );
  const inputElement = React.isValidElement(as)
    ? React.cloneElement(as, inputFieldProps)
    : React.createElement(as, inputFieldProps);

  // H44: Note that the label is positioned after input elements of type="checkbox" and type="radio"
  if (rest.type === "checkbox" || rest.type === "radio") {
    return (
      <>
        {inputElement}
        {labelElement}
      </>
    );
  }

  return (
    <>
      {labelElement}
      {inputElement}
    </>
  );
};

// React.children.Map would be nice to use instead of context but that would require that all form elements are imidate children of the form? If so would it hidnder any styling approaches?

// Write something nice about React.memo and maybe how it relates to Component and PureComponent?

// Write something nice about the behaviour of React.cloneElement, React.createElement, React.isValidElement
