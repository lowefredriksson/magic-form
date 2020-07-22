import React, {
  useRef,
  useContext,
  useState,
  useCallback,
  ChangeEvent,
} from "react";
import "./App.css";

const renders: { [Key: string]: number } = {};

const registerRender = (name: string) => {
  if (renders[name] === undefined) {
    renders[name] = 0;
  }
  renders[name] = renders[name] + 1;
  console.log("renders", renders);
};

type MagicError = {
  message: string
} | null;

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
      console.log("ref", ref);
    }
  };

  return { fields: fields.current, register };
};

type FieldSpreadProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};

const useError = (
  name: string,
  options: {
    validate?: (value: string) => {
      valid: boolean;
      message?: string;
    };
  } = {}
): [{
  valid: boolean;
  message?: string;
} | null, FieldSpreadProps] => {
  const { fields } = useContext(MagicFormContext);
  const { validate } = options;

  const [error, setError] = useState<{
    valid: boolean;
    message?: string;
  } | null>(null);

  const onBlur = useCallback(() => {
    const field = fields[name];
    if (validate && field) {
      const fieldStatus = validate(field.value);
      console.log("onBlur", fieldStatus, error);
      if (error === null || (fieldStatus.valid !== error.valid)) {
        setError(fieldStatus);
      }
    }
  }, [fields, validate, error, name]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (error !== null && validate) {
        const fieldStatus = validate(event.target.value);
        console.log("onChange", fieldStatus, error);
        if (fieldStatus.valid !== error.valid) {
          setError(fieldStatus);
        }
      }
    },
    [error, validate]
  );

  return [error, { onBlur, onChange }];
};

export const useField = (
  name: string,
  options: { validate?: (value: string) => {
    valid: boolean;
    message?: string;
  }, required?: boolean } = {}
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
  validate?: (value: string) => {
    valid: boolean;
    message?: string;
  };
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
      {error && !error.valid ? (
        <div id={`${name}_error`} role="alert">
          {error.message}
        </div>
      ) : null}
    </>
  );
};

type FieldControllerProps = {
  name: string;
  validate?: (value: string) => {
    valid: boolean;
    message?: string;
  };
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
  console.log("props");
  const magicForm = useMagicForm();
  registerRender("MagicForm");
  return (
    <MagicFormContext.Provider value={magicForm}>
      <form>{props.children}</form>
    </MagicFormContext.Provider>
  );
};
