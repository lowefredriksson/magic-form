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
    validate?: (value: string) => boolean;
  } = {}
): [boolean | null, FieldSpreadProps] => {
  const { fields } = useContext(MagicFormContext);
  const { validate } = options;

  const [error, setError] = useState<boolean | null>(null);

  const onBlur = useCallback(() => {
    const field = fields[name];
    if (validate && field) {
      const valid = validate(field.value);
      if (!valid !== error) {
        setError(!valid);
      }
    }
  }, [fields, validate, error]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (error !== null && validate) {
        const valid = validate(event.target.value);
        if (!valid !== error) {
          setError(!valid);
        }
      }
    },
    [error, validate]
  );

  return [error, { onBlur, onChange }];
};

export const useField = (
  name: string,
  options: { validate?: (value: string) => boolean } = {}
) => {
  const { register } = useContext(MagicFormContext);
  const [error, fieldProps] = useError(name, {
    validate: options.validate,
  });
  registerRender(name);
  return [
    error,
    {
      ...fieldProps,
      ref: register,
      name,
    },
  ];
};

type FieldProps = {
  name: string;
  validate?: (value: string) => boolean;
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
        required
        aria-required
        aria-invalid={error ? "true" : "false"}
        aria-describedBy={`${name}_error`}
        id={name}
        {...inputProps}
        {...fieldProps}
      />
      {error ? (
        <div id={`${name}_error`} aria-role="alert">
          ERROR
        </div>
      ) : null}
    </>
  );
};

type FieldControllerProps = {
  name: string;
  validate?: (value: string) => boolean;
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
