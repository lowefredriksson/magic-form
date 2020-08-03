import React, { useRef, useState, useCallback, RefObject } from "react";
import { registerRender } from "./renders";

type Values = Map<string, string>;
type Errors = Map<string, string | null>;
type Touched = Set<string>;
type ValueContextType = {
  values: Values;
  updateValue: (key: string) => (value: string) => void;
  setTouched: (name: string) => void;
  errors: Errors;
  touched: Touched;
};

const ValueContext = React.createContext<ValueContextType>({
  values: new Map(),
  updateValue: () => () => {},
  setTouched: () => {},
  errors: new Map(),
  touched: new Set(),
});

type InputProps = {
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | null;
  touched: boolean;
};

const Input = React.memo(
  React.forwardRef(
    ({ name, onChange, onBlur, error, touched }: InputProps, ref: any) => {
      registerRender(name);
      // console.log(name, "error", error, "touched", touched);
      return (
        <>
          <input
            ref={ref}
            name={name}
            id={name}
            onChange={onChange}
            onBlur={onBlur}
          />
          <p>{error && touched ? error : ""}</p>
        </>
      );
    }
  ),
  (prev, next) => {
    // console.log("check");
    return true;

    console.log("prev", prev, "next", next);

    if (prev.error !== next.error) {
      return false;
    }
    if (prev.touched !== next.touched) {
      return false;
    }

    return true;
  }
);

const errorEquals = (prev: Errors, next: Errors) => {
  if (prev.size !== next.size) {
    return false;
  }
  let equals = true;
  prev.forEach((error, key) => {
    if (equals) {
      if (error !== next.get(key)) {
        equals = false;
      }
    }
  });
  return equals;
};

export const Test = () => {
  registerRender("App");
  const validate = (values: Values): Map<string, string> => {
    const a = new Map();
    const firstname = values.get("firstname") ?? "";
    if (firstname.length < 4) {
      a.set("firstname", "must be 4");
    }
    if (values.get("lastname") ?? "".length < 5) {
      a.set("lastname", "must be 5");
    }
    return a;
  };
  const fieldsRef = useRef<Map<string, HTMLInputElement>>(new Map());
  const getValues = () => {
    const values = new Map();
    fieldsRef.current.forEach((ref, key) => {
      values.set(key, ref.value);
    });
    return values;
  };
  const [errors, _setErrors] = useState<Errors>(new Map());
  const [touched, setTouched] = useState<Touched>(new Set());
  const register = (ref: HTMLInputElement) => {
    if (ref && ref.name) {
      fieldsRef.current.set(ref.name, ref);
    }
  };
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const values = getValues();
      // console.log("values", values);
      const vRes = validate(values);
      const ee = errorEquals(vRes, errors);
      // console.log("errorsEquals", ee);
      if (!ee) {
        _setErrors(vRes);
      }
    },
    [errors]
  );
  const onBlur = useCallback(
    (name: string) => (event: React.FocusEvent<HTMLInputElement>) => {
      setTouched((old) => new Set(old.add(name)));
    },
    [setTouched]
  );
  const firstNameError = errors.get("firstname");
  const firstNameTouched = touched.has("firstname");
  return (
    <form>
      <Input
        ref={register}
        name="firstname"
        error={firstNameError}
        touched={firstNameTouched}
        onChange={onChange}
        onBlur={onBlur("firstname")}
      />
      <Input
        ref={register}
        name="lastname"
        error={errors.get("lastname")}
        touched={touched.has("lastname")}
        onChange={onChange}
        onBlur={onBlur("lastname")}
      />
    </form>
  );
};
