import React, { useState, useRef } from "react";
import "./App.css";
import { FormLayout } from "./FormLayout";
import { registerRender } from "./renders";
import { useMagicForm, MagicForm } from "./MagicForm";
import { Field } from "./Input";

type FormContextValue<T> = {
  values: T;
  methods: any;
};

const FormContext = React.createContext<FormContextValue<any>>({
  values: {},
  methods: {},
});

function useForm() {
  const [values, setValues] = useState<any>({});
  return { values, methods: { setValues } };
}

const useOnChange = () => {
  const values = useRef({});
  const onChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log("name", name, "value", value);
    if (name) {
      values.current = { ...values.current, [name]: value };
    }
  };
  return onChange;
};

function App() {
  // const formBag = useForm();
  // const onChange = useOnChange();
  const bag = useMagicForm();
  registerRender("app");
  return (
    <div className="App">
      {/* <MagicForm magicForm={bag} validation={(values) => {
          return {}
        }}> */}
      <FormLayout>
        <Field
          label="Username"
          name="username"
          type="email"
          validate={(value) => {
            return Promise.resolve(
              value.length < 4
                ? { message: "Should be at least 4 charchters long" }
                : null
            );
          }}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          revalidateFields={["confirm"]}
          validate={(value) => {
            return Promise.resolve(
              value.length < 8
                ? { message: "Should be at least 8 charchters long" }
                : null
            );
          }}
        />
        <Field
          label="Confirm Password"
          name="confirm"
          type="password"
          validate={(value, fields) => {
            return Promise.resolve(
              value === fields["password"]
                ? null
                : { message: "Should match password" }
            );
          }}
        />
      </FormLayout>
      {/* </MagicForm> */}
      {/* <FormContext.Provider value={formBag}>
        <form>
          <FormLayout>
            <input name="firstname" onChange={onChange}/>
            <input name="lastname" onChange={onChange} />
            <select name="cars" id="cars" onChange={onChange}>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
            <input type="checkbox" name="vehicle1" value="Bike" onChange={onChange}/>
            <input type="checkbox" name="vehicle1" value="Car" onChange={onChange}/>
            <input list="browsers" name="browser" onChange={onChange}/>
            <datalist id="browsers">
              <option value="Internet Explorer" />
              <option value="Firefox" />
              <option value="Chrome" />
              <option value="Opera" />
              <option value="Safari" />
            </datalist>
            <input type="radio" id="male" name="gender" value="male" onChange={onChange}/>
            <label htmlFor="male">Male</label>
            <input type="radio" id="female" name="gender" value="female" onChange={onChange}/>
            <label htmlFor="female">Female</label>
            <input type="radio" id="other" name="gender" value="other" onChange={onChange}/>
            <label htmlFor="other">Other</label>
          </FormLayout>
        </form>
      </FormContext.Provider> */}
    </div>
  );
}

export default App;
