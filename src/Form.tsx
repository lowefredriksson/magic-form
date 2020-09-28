import React, { HTMLProps } from "react";
import { useForm } from "./useForm";
import { Context } from "./useFormContext";

/**
 *
 *
 *
 *
 *
 *
 * G199: Providing success feedback when data is submitted successfully.
 * ------------------------------------------------------------------------
 *
 * The objective of this technique is to reduce the effort required for users to confirm that an action,
 * such as submitting a Web form, was completed successfully. This can be accomplished by providing consistently presented
 * feedback that explicitly indicates success of an action, rather than requiring a user to navigate through content to discover if the action was successful.
 *
 * Content that accepts user data input.
 * This technique relates to:
 * Success Criterion 3.3.1: Error Identification (Advisory)
 * Success Criterion 3.3.3: Error Suggestion (Advisory)
 * Success Criterion 3.3.4: Error Prevention (Legal, Financial, Data) (Advisory)
 * Success Criterion 4.1.3: Status Messages (Sufficient as a way to meet ARIA22: Using role=status to present status messages)
 *
 * Provide feedback to users about the results of their form submission, whether successful or not. This includes in-line feedback at or near the form controls and overall feedback that is typically provided after form submission.
 * Notifications have to be concise and clear. In particular, error messages should be easy to understand and should provide simple instructions on how they can be resolved. Success messages are also important to confirm task completion.
 *
 */

export const Form: React.FC<HTMLProps<HTMLFormElement>> = ({
  children,
  ...formProps
}) => {
  const { handleSubmit, ...formBag } = useForm({
    onSubmit: (values) => {
      return Promise.resolve(true);
    },
  });

  return (
    <Context.Provider value={formBag}>
      <form {...formProps} onSubmit={handleSubmit}>
        {children}
      </form>
    </Context.Provider>
  );
};
