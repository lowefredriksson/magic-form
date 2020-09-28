import React from "react";
import { Value } from "./types";
import { Error } from "./Error";
import { Field } from "./Field";
import { useRenderCounter } from "./useRenderCounter";
import { Form } from "./Form";

const CustomLabel = ({
  htmlFor,
  labelText,
}: {
  htmlFor: string;
  labelText: string;
}) => {
  return <div style={{ color: "red" }}>{labelText}</div>;
};

export const Lowely = () => {
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
      <Form
        style={{
          width: "400px",
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        }}
      >
        <Field name="Email" />
        <fieldset>
          <legend>Create Password</legend>
          <Field
            type="password"
            name="password"
            label="Lösenord"
            validate={(value: Value) =>
              (value as string).length < 4
                ? "Should be at least 4 characters"
                : undefined
            }
          />
          <Error name="password" />
          <Field
            type="password"
            name="confirm password"
            label="Repetera Lösenord"
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
          <Error name="confirm password" />
        </fieldset>
        <Field as="select" name="colour">
          <option value="red" label="red" />
          <option value="blue" label="blue" />
        </Field>
        <Field type="checkbox" name="isCompany" />
        <input type="submit" value="Sign up" />
      </Form>
      Renders {count}
    </div>
  );
};
