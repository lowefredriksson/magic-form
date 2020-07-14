import React from "react";
import "./App.css";
import { MagicForm } from "./MagicForm";
import { Field } from "./Field";
import { useField } from "./useField";

function App() {
  const [field1Error, field1Props] = useField("firstname", {
    validate: (value: string) =>
      value.length > 5
        ? { value: false }
        : { value: true, message: "Needs to be 5" },
  });
  return (
    <div className="App">
      <MagicForm>
        <input type="fname" {...field1Props} />
        {field1Error ? <div>ER</div> : null}
        <Field
          label="Username"
          name="Username"
          type="email"
          validate={(name: string) =>
            name.length > 4
              ? { value: false }
              : { value: true, message: "Needs to be 4" }
          }
          required
        />
      </MagicForm>
    </div>
  );
}

export default App;
