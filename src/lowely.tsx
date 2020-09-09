import React from "react";
import { Value } from "./types";
import { useForm } from "./useForm";
import { Context } from "./useFormContext";
import { ErrorComponent } from "./ErrorComponent";
import { Field, Field2 } from "./Field";
import { useRenderCounter } from "./useRenderCounter";
import { useFieldProps } from "./useFieldProps";

const shouldBeAtLeast = (c: number, value: string) => {
  return value.length < c ? "Should be at least 4 characters" : undefined;
};

export const Lowely = () => {
  const { handleSubmit, ...formBag } = useForm({
    onSubmit: () => {
      return Promise.resolve(true);
    },
  });
  const count = useRenderCounter();
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Context.Provider value={formBag}>
        <form
          style={{
            width: "400px",
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit}
        >
          <Field2 name="Email" />
          <fieldset>
            <Field2
              type="password"
              name="password"
              validate={(value: Value) =>
                (value as string).length < 4
                  ? "Should be at least 4 characters"
                  : undefined
              }
            />
            <ErrorComponent name="password" />
            <Field2
              type="password"
              name="confirm password"
              validate={(value: Value, values) => {
                if ((value as string).length < 4) {
                  return "Should be at least 4 characters";
                }
                if (value !== values.get("password")) {
                  return "Should match password";
                }
                return undefined;
              }}
            />
            <ErrorComponent name="confirm password" />
          </fieldset>
          <Field2 as="select" name="colour">
            <option value="red" label="red" />
            <option value="blue" label="blue" />
          </Field2>
          <Field2 type="checkbox" name="isCompany" />
          <input type="submit" value="Sign up" />
        </form>
      </Context.Provider>
      Renders {count}
    </div>
  );
};
