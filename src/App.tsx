import React from "react";
import "./App.css";
import { MagicForm, useMagicForm } from "./MagicForm";
import { Field } from "./Field";
import { FormLayout } from "./FormLayout";

const isUsernameAvailable = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(false), 2000));
};

function App() {
  const magicForm = useMagicForm();
  return (
    <div className="App">
      <MagicForm magicForm={magicForm}>
        <FormLayout>
        <h1>Log in</h1>
          <Field
            label="Username"
            name="Username"
            type="email"
            validate={async (name: string) => {
              const available = await isUsernameAvailable();
              return available
                ? { value: false }
                : { value: true, message: "Username is already taken" };
            }}
          />
          <Field
            label="Password"
            name="Password"
            type="password"
            //dependencies=["password"]
            validate={async (
              value: string,    
              fields: {
                [Key: string]: any;
              }
            ) => {
              return value.length >= 8
                ? { value: false }
                : { value: true, message: "Needs to be 8 or more characters" };
            }}
          />
          <Field
            label="Confirm Password"
            name="PasswordConfirm"
            type="password"
            //strategy={ change: (touched) => touched, blur: true, submit: true }
            //strategy=["changeAfterTouch", "blur", "submit", "password"]
            validate={async (
              value: string,
              fields: {
                [Key: string]: any;
              }
            ) => {
              if (fields["Password"] !== value) {
                return { value: true, message: "Should be same as password" };
              }

              return value.length >= 8
                ? { value: false }
                : { value: true, message: "Needs to be 8 or more characters" };
            }}
          />
          <input type="submit" value="send"/>
        </FormLayout>
      </MagicForm>
    </div>
  );
}

export default App;
