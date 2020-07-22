import React from "react";
import "./App.css";
import { MagicForm } from "./MagicForm";
import { Field } from "./Field";
import { FormLayout } from "./FormLayout";

const isUsernameAvailable = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(false), 2000));
};

function App() {
  return (
    <div className="App">
      <MagicForm>
        <FormLayout>
          <Field
            label="Username"
            name="Username"
            type="email"
            validate={async (name: string) => {
              console.log("validate username");
              const available = await isUsernameAvailable();
              console.log("available", available);
              return available
                ? { value: false }
                : { value: true, message: "Username is already taken" };
            }}
            required
          />
          <Field
            label="Password"
            name="Password"
            type="password"
            validate={async (
              value: string,
              fields: {
                [Key: string]: HTMLInputElement;
              }
            ) => {
              console.log("fields 2", fields);
              return value.length >= 8
                ? { value: false }
                : { value: true, message: "Needs to be 8 or more characters" };
            }}
          />
          <Field
            label="Confirm Password"
            name="PasswordConfirm"
            type="password"
            validate={async (
              value: string,
              fields: {
                [Key: string]: HTMLInputElement;
              }
            ) => {
              console.log("password field", fields["Password"]);
              if (fields["Password"].value !== value) {
                return { value: true, message: "Should be same as password" };
              }

              return value.length >= 8
                ? { value: false }
                : { value: true, message: "Needs to be 8 or more characters" };
            }}
          />
        </FormLayout>
      </MagicForm>
    </div>
  );
}

export default App;
