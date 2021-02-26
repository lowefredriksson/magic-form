import React, { HTMLProps } from "react";
import { ErrorResolver, FieldRef } from "../types";
import { FieldDescription } from "./FieldDescription";
import { FieldError } from "./FieldError";
import { FieldInputControl } from "./FieldInputControl";
import { FieldLabel } from "./FieldLabel";

type FieldProps = {
  name: string;
  validate?: ErrorResolver;
  as?:
    | "input"
    | "textarea"
    | "select"
    | React.FunctionComponent<{ name: string }>;
  label?: string;
  description?: string;
  //labelVisuallyHidden: boolean
} & HTMLProps<FieldRef>;

export const Field: React.FC<FieldProps> = ({
  as = "input",
  label,
  name,
  validate,
  description,
  ...rest
}) => {
  const labelText = label ? label : name;
  // H44: Note that the label is positioned after input elements of type="checkbox" and type="radio"
  if (rest.type === "checkbox" || rest.type === "radio") {
    return (
      <>
        <FieldInputControl {...rest} as={as} name={name} validate={validate} />
        <FieldLabel name={name}>{labelText}</FieldLabel>
        {description !== undefined ? (
          <FieldDescription name={name}>{description}</FieldDescription>
        ) : null}
        {validate !== undefined ? <FieldError name={name} /> : null}
      </>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          position: "relative",
        }}
      >
        <FieldLabel name={name} style={{ fontWeight: "bold" }}>
          {labelText}
        </FieldLabel>
        <div style={{ marginLeft: 10 }}>( 2 )</div>
      </div>
      {description !== undefined ? (
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", right: -40 }}>( 3 )</div>
          <FieldDescription name={name}>{description}</FieldDescription>
        </div>
      ) : null}
      {validate !== undefined ? (
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", right: -40 }}></div>
          <FieldError name={name} />
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -40, top: 4 }}>( 5 )</div>
        <FieldInputControl
          {...rest}
          as={as}
          name={name}
          validate={validate}
          style={{ marginTop: 5 }}
        />
      </div>
    </>
  );
};
