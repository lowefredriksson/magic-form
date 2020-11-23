import React, { useEffect, useState } from "react";
import { Value } from "./types";
import { FieldError } from "./API/FieldError";
import { Field, useField } from "./API/Field";
import { useRenderCounter } from "./hooks/useRenderCounter";
import { Form } from "./API/Form";
import { useValue } from "./hooks/useValue";
import { FieldLabel } from "./API/FieldLabel";
import { FieldInputControl } from "./API/FieldInputControl";
import { FieldDescription } from "./API/FieldDescription";

const CustomLabel = ({
  htmlFor,
  labelText,
}: {
  htmlFor: string;
  labelText: string;
}) => {
  return <div style={{ color: "red" }}>{labelText}</div>;
};

const RadioGroup = () => {
  const value = useValue("volvo");
  const saabValue = useValue("saab");
  useEffect(() => {
    console.log("radiogroup volvo:", value, "saabValue: ", saabValue);
  }, [value, saabValue]);
  return (
    <fieldset>
      <legend>Cars</legend>
      <Field name="volvo" type="checkbox" />
      <Field name="saab" type="checkbox" />
    </fieldset>
  );
};

export const Lowely2 = () => {
  const [error, setError] = useState<string | null>(null);
  return (
    <form>
      <fieldset>
        <legend>Cars</legend>
        <input
          id="checkbox-volvo"
          type="checkbox"
          name="car"
          onChange={(e) => {
            console.log(
              "checkbox-volvo: onChange",
              e.target.value,
              e.target.checked
            );
          }}
        />
        <label htmlFor="checkbox-volvo">Volvo</label>
        <input
          id="checkbox-saab"
          type="checkbox"
          name="car"
          onChange={(e) => {
            console.log(
              "checkbox-saab: onChange",
              e.target.value,
              e.target.checked
            );
          }}
        />
        <label htmlFor="checkbox-saab">Saab</label>
      </fieldset>
      <fieldset>
        <legend>Colors</legend>
        <input
          multiple
          id="radio-color-blue"
          name="radio-color"
          type="radio"
          value="blue"
          onChange={(e) => {
            console.log(
              "radio-color-blue: onChange",
              e.target.value,
              e.target.checked
            );
          }}
        />
        <label htmlFor="radio-color-blue">Blue</label>
        <input
          multiple
          id="radio-color-red"
          name="radio-color"
          type="radio"
          value="red"
          onChange={(e) => {
            console.log(
              "radio-color-red: onChange",
              e.target.value,
              e.target.checked
            );
          }}
        />
        <label htmlFor="radio-color-red">Blue</label>
      </fieldset>
      <label htmlFor="name">
        Name
        <span id="name-error" aria-live="assertive">
          {error}
        </span>
      </label>
      <input
        id="name"
        aria-describedby="name-error"
        aria-invalid={error !== null}
        onBlur={() => {
          setError("Fel namn");
        }}
      />
      <label htmlFor="password">Lösenord</label>
      <input id="password" />
    </form>
  );
};

const LowelyInner: () => JSX.Element = () => {
  const [emailField] = useField({
    label: "Email",
    name: "email",
    inputControlProps: {
      type: "email",
    },
  });
  const [passwordField] = useField({
    label: "Lösenord",
    name: "password",
    validate: (value: Value) =>
      (value as string).length < 4
        ? "Should be at least 4 characters"
        : undefined,
    inputControlProps: {
      type: "password",
    },
  });
  const [repeatPasswordField] = useField({
    inputControlProps: {
      type: "password",
    },
    name: "confirm password",
    label: "Repetera Lösenord",
    validate: (value: Value, values) => {
      if ((value as string).length < 4) {
        return "Should be at least 4 characters";
      }
      if (value !== values.get("password")) {
        return "Should match password";
      }
      return undefined;
    },
  });
  const [_, { InputControl, labelElement }] = useField({
    name: "color",
    label: "Color",
    as: "select",
  });
  const [isCompanyField] = useField({
    name: "isCompany",
    label: "Company",
    as: "input",
    inputControlProps: {
      type: "checkbox",
    },
  });
  const [messageField] = useField({
    name: "message",
    label: "Message",
    as: "textarea",
  });

  return (
    <>
      {emailField}
      <fieldset>
        <legend>Create Password</legend>
        {passwordField}
        {repeatPasswordField}
      </fieldset>
      {labelElement}
      <InputControl>
        <option id="hej" value="hej" label="hej"></option>
        <option id="hej2" value="hej2" label="hej2"></option>
      </InputControl>
      {isCompanyField}
      {messageField}
      <input type="submit" value="Sign up" />
    </>
  );
};

export const Lowely6 = () => {
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
        onSubmit={(values) => {
          console.log("values", values);
          return;
        }}
      >
        <FieldLabel name="email">Email</FieldLabel>
        <FieldDescription name="email">* Obligatorisk</FieldDescription>
        <FieldError
          name="email"
          Component={(props) => (
            <div
              style={{ color: "red", backgroundColor: "green" }}
              {...props}
            />
          )}
        />
        <FieldInputControl
          name="email"
          type="email"
          validate={(value) => {
            console.log("Validate value:", value);
            if ((value as string).length > 4) {
              return "Max 4 chars allowed";
            }
            return undefined;
          }}
        />
        <fieldset>
          <legend>Create Password</legend>
          <Field
            type="password"
            name="password"
            label="Lösenord"
            required
            validate={(value: Value) =>
              (value as string).length < 4
                ? "Should be at least 4 characters"
                : undefined
            }
          />
          <Field
            type="password"
            name="confirm password"
            label="Repetera Lösenord"
            required
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
        </fieldset>
        <Field as="select" name="colour">
          <option value="red" label="red" />
          <option value="blue" label="blue" />
        </Field>
        <Field
          type="checkbox"
          name="isCompany"
          description="Handlar du med ditt företag?"
        />
        <input type="submit" value="Sign up" />
      </Form>
      Renders {count}
    </div>
  );
};

export const Lowely = () => {
  return (
    <Form>
      <Field
        label="Username"
        description="This is the email associated with your account"
        required
        name="username"
      />
      <Field label="Password" required name="password" />
      <Field name="rememberUser" type="checkbox" label="Remember me" />
      <button type="submit">Submit</button>
    </Form>
  );
};
