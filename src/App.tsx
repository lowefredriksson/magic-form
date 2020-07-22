import React from "react";
import "./App.css";
import { MagicForm, Field, FieldController, useField } from "./MagicForm";

function App() {
  const [field1Error, field1Props] = useField("firstname", {
    validate: (value: string) => ({ valid: value.length > 4, message: "Name needs to be atleast 4 characters long" }),
  });
  return (
    <div className="App">
      <MagicForm>
        {/* <input type="fname" {...field1Props} />
  {field1Error && !field1Error.valid ? <div>{field1Error.message}</div> : null} */}
        <Field
          label="Username"
          name="Username"
          type="email"
          validate={(name: string) => ({ valid: name.length > 4, message: "Name needs to be atleast 4 characters long" })}
          required
        />
        {/* <FieldController
          name="Password"
          validate={(password: string) => ({ valid: password.length > 4, message: password.length < 4 ? "Password needs to be atleast 4 characters long" : undefined })}
        >
          {([error, props]) => <input type="password" {...props} />}
        </FieldController> */}
      </MagicForm>
    </div>
  );
}

export default App;
