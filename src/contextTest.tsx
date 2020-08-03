import React, {
  useRef,
  useState,
  useCallback,
  RefObject,
} from "react";
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
  React.forwardRef(({ name, onChange, onBlur, error, touched }: InputProps, ref: any) => {
    registerRender(name);
    console.log("error", error, "touched", touched);
    return (
      <>
        <input ref={ref} name={name} id={name} onChange={onChange} onBlur={onBlur} />
        <p>{error && touched ? error : ""}</p>
      </>
    );
  })
);

export const Test = () => {
  registerRender("App");
  const validate = (values: Values): Map<string, string> => {
    const a = new Map();
    const firstname = values.get("Firstname") ?? "";
    if (firstname.length < 4) {
      a.set("firstname", "must be 4");
    }
    if (values.get("Lastname") ?? "".length < 5) {
      a.set("lastname", "must be 5");
    }
    return a;
  };
  const fieldsRef = useRef<Map<string, HTMLInputElement>>(new Map());
  const [errors, _setErrors] = useState<Errors>(new Map());
  const [touched, setTouched] = useState<Touched>(new Set());
  const register = (ref: HTMLInputElement) => {
      if (ref && ref.name) {
        fieldsRef.current.set(ref.name, ref);
      }
  }
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const d = new Map();
      d.set('firstname', fieldsRef?.current?.get('firstname')?.value);
      d.set('lastname', fieldsRef?.current?.get('lastname')?.value);
    const vRes = validate(d);
    _setErrors(vRes);
    console.log("vRes", vRes);
  }, []);
  const onBlur = useCallback(
    (name: string) => (event: React.FocusEvent<HTMLInputElement>) => {
            setTouched((old) => new Set(old.add(name)))
    },
    [setTouched]
  );
  return (
    <form>
      <Input
        ref={register}
        name="firstname"
        error={errors.get("firstname")}
        touched={touched.has("firstname")}
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
