import React, { HTMLProps } from "react";
import { useTouched } from "../hooks/useTouched";
import { useError } from "../hooks/useError";
import { getErrorId } from "../hooks/getErrorId";
import { useRenderCounter } from "../hooks/useRenderCounter";
import { AlertCircle } from "react-feather";

/**
 * The Error component is used to display field errors in an accessible way. It implements the ARIA19 technique.
 * The component is only rendered every time the error or touched state of the field changes.
 *
 *
 * ARIA19: Using ARIA role=alert or Live Regions to Identify Errors
 * 3.3.1: Error Identification
 * 4.1.3: Status Messages when ARIA19 is used in combination with any of these
 **** G83: Providing text descriptions to identify required fields that were not completed
 **** G84: Providing a text description when the user provides information that is not in the list of allowed values
 **** G85: Providing a text description when user input falls outside the required format or values
 **** G177: Providing suggested correction text
 **** G194: Providing spell checking and suggestions for text input
 *
 * ARIA1: Using the aria-describedby property to provide a descriptive label for user interface controls
 * 1.3.1 Info and Relationships
 * 3.3.3 Labels or Instruction
 *
 * ----------------------------------------------------------------
 *
 * The intent of this Success Criterion is to make users aware of important changes in content that are not given focus, and to do so in a way that doesn't unnecessarily interrupt their work.
 *
 */
export type CustomErrorComponent = React.FC<{
  id: string;
  role: string;
  "aria-atomic": "true" | "false";
  children: string | null;
}>;

type FieldErrorProps = {
  name: string;
  Component?: CustomErrorComponent;
} & HTMLProps<HTMLSpanElement>;

export const FieldError = ({ name, Component, ...rest }: FieldErrorProps) => {
  const count = useRenderCounter();
  const error = useError(name);
  const touched = useTouched(name);
  console.log(name, " count", count, "touched", touched, "error", error);

  if (Component) {
    return (
      <Component id={getErrorId(name)} role="alert" aria-atomic="true">
        {error && touched ? `${error}` : null}
      </Component>
    );
  }

  return (
    <span
      {...rest}
      id={getErrorId(name)}
      role="alert"
      aria-atomic="true"
      style={{
        marginTop: "3px",
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {error && touched ? (
        <>
          <AlertCircle size={14} color="red" style={{ marginRight: "3px" }} />
          {error}
        </>
      ) : null}
      {error && touched ? (
        <div style={{ position: "absolute", right: -40, top: 0 }}>( 4 )</div>
      ) : null}
    </span>
  );
};

/**
 * aria-labelledby: Identifies the element (or elements) that labels the current element. See related aria-describedby.
 * aria-label: Defines a string value that labels the current element. See related aria-labelledby.
 * aria-describedby: Identifies the element (or elements) that describes the object. See related aria-labelledby.
 * aria-details: Identifies the element that provides a detailed, extended description for the object. See related aria-describedby.
 * aria-errormessage: Identifies the element that provides an error message for the object. See related aria-invalid and aria-describedby.
 * aria-invalid: Indicates the entered value does not conform to the format expected by the application. See related aria-errormessage.
 * aria-live: Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
 * aria-required: Indicates that user input is required on the element before a form may be submitted.
 * aria-atomic: Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute.
 *
 * role
 * -------
 * alert: A type of live region with important, and usually time-sensitive, information. See related alertdialog and status.
 * status: A type of live region whose content is advisory information for the user but is not important enough to justify an alert, often but not necessarily presented as a status bar.
 *
 */

/**
 *
 * H71: Providing a description for groups of form controls using fieldset and legend elements.
 * H65: Using the title attribute to identify form controls when the label element cannot be used
 *
 *
 */
