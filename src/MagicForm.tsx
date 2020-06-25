import React, {
  useRef,
  useContext,
  useState,
  useCallback,
  ChangeEvent,
} from "react";
import "./App.css";
import { registerRender } from "./renders";

type ContextType = {
  fields: { [Key: string]: HTMLInputElement };
  register: (ref: HTMLInputElement | null) => void;
};

const MagicFormContext = React.createContext<ContextType>({
  register: (ref) => {},
  fields: {},
});

const useMagicForm = () => {
  const fields = useRef<{ [Key: string]: HTMLInputElement }>({});

  const register = (ref: HTMLInputElement | null) => {
    if (ref && ref.name) {
      fields.current[ref.name] = ref;
    }
  };

  return { fields: fields.current, register };
};

type FieldSpreadProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};

type Error = {
  message?: string;
  value: boolean;
}

const errorEquals = (oldError: Error | null, newError: Error | null) => {
  if (oldError === null && newError === null) {
    return true;
  }
  if (oldError === null && newError !== null) {
    return false;
  }
  if (oldError !== null && newError === null) {
    return false;
  }
  if (oldError!.value !== newError!.value) {
    return false;
  } 
  if (oldError!.message !== newError!.message) {
    return false;
  }
}

const useError = (
  name: string,
  options: {
    validate?: (value: string) => Error;
  } = {}
): [Error | null, FieldSpreadProps] => {
  const { fields } = useContext(MagicFormContext);
  const { validate } = options;

  const [error, setError] = useState<Error | null>(null);

  const onBlur = useCallback(() => {
    const field = fields[name];
    if (validate && field) {
      const valid = validate(field.value);
      if (!errorEquals(error, valid)) {
        setError(valid);
      }
    }
  }, [fields, validate, error, name]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (error !== null && validate) {
        const valid = validate(event.target.value);
        if (!errorEquals(error, valid)) {
          setError(valid);
        }
      }
    },
    [error, validate]
  );

  return [error, { onBlur, onChange }];
};

export const useField = (
  name: string,
  options: { validate?: (value: string) => Error, required?: boolean } = {}
) => {
  const { register } = useContext(MagicFormContext);
  const [error, fieldProps] = useError(name, {
    validate: options.validate,
  });
  let props: { [Key: string]: any } = {
    ...fieldProps,
    ref: register,
    name,
  };
  props['area-invalid'] = error ? "true" : "false";
  props['area-describyBy'] = `${name}_error`;
  if (options.required) {
    props['required'] = true; 
    props['aria-required'] = true;
   }
  registerRender(name);
  return [
    error,
    props
  ];
};

type FieldProps = {
  name: string;
  validate?: (value: string) => Error;
  label: string;
} & React.HTMLProps<HTMLInputElement>;

export const Field = ({ name, validate, label, ...inputProps }: FieldProps) => {
  const [error, fieldProps] = useField(name, {
    validate,
  });
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        {...inputProps}
        {...fieldProps}
      />
      {error ? (
        <div id={`${name}_error`}>
          {error.message}
        </div>
      ) : null}
    </>
  );
};

type FieldControllerProps = {
  name: string;
  validate?: (value: string) => Error;
  children: (props: ReturnType<typeof useField>) => React.ReactElement;
};

export const FieldController = ({
  name,
  validate,
  children,
}: FieldControllerProps) => {
  const childProps = useField(name, {
    validate,
  });
  return children(childProps);
};

type MagicFormProps = {} & React.HTMLProps<HTMLFormElement>;

export const MagicForm: React.FC = (props: MagicFormProps) => {
  const magicForm = useMagicForm();
  registerRender("MagicForm");
  return (
    <MagicFormContext.Provider value={magicForm}>
      <form>{props.children}</form>
    </MagicFormContext.Provider>
  );
};
