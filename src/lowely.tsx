import React, {
  useRef,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

const useRenderCounter = () => {
  const counter = useRef(0);
  counter.current++;
  return counter.current;
};

export const Child: React.FC<{
  name: string;
}> = ({ name }) => {
  const { setValue, getValue, registerField } = useContext(Context);
  useEffect(() => {
    registerField(null, name, {
      validate: (value: Value) => {
        return value < 0 ? "Should be positive" : undefined;
      },
    });
  }, [registerField]);
  const wVal = useValue(name);
  const counter = useRenderCounter();
  return (
    <>
      <div>
        {name} {counter}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          type="button"
          onClick={() => {
            const prev = getValue(name);
            setValue(name, ((prev as number) ?? 0) - 1);
          }}
        >
          Minus
        </button>
        The watch {wVal}
        <button
          type="button"
          onClick={() => {
            const prev = getValue(name);
            setValue(name, ((prev as number) ?? 0) + 1);
          }}
        >
          Plus
        </button>
      </div>
    </>
  );
};

const Field = ({ name }: { name: string }) => {
  const { setValue, registerField } = useContext(Context);
  const wVal = useValue(name);
  const counter = useRenderCounter();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value);
  };
  const config = {
    validate: (value: any) => {
      return value.length < 4 ? "Should be atlest 4" : undefined;
    },
  };
  return (
    <>
      <p>Value: {wVal}</p>
      <input
        ref={(ref) => registerField(ref, name, config)}
        name={name}
        id={`${name}_input`}
        onChange={onChange}
      />
      <p>Renders: {counter}</p>
    </>
  );
};

const ErrorComponent = ({ name }: { name: string }) => {
  const count = useRenderCounter();
  const error = useError(name);
  return (
    <div
      style={{
        padding: "20px",
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <p>Renders {count}</p>
      {error ? <p>{error}</p> : null}
    </div>
  );
};

type Error = string | undefined;
type Value = number | string;
type FieldConfig = {
  validate?: (value: Value) => string | undefined;
};
type Field = { ref?: HTMLInputElement | null; config: FieldConfig };
type Listner = {
  id: string;
  callback: (value: Value) => void;
  listenTo: string;
};

type ContextType = {
  setValue: (name: string, value: Value) => void;
  getValue: (name: string) => Value | undefined;
  registerValueCallback: (
    name: string,
    id: string,
    callback: (value: Value) => void
  ) => void;
  unregisterValueCallback: (id: string) => void;
  registerErrorCallback: (
    name: string,
    id: string,
    callback: (value: Error) => void
  ) => void;
  unregisterErrorCallback: (id: string) => void;
  registerField: (
    ref: HTMLInputElement | null,
    key: string,
    config: FieldConfig
  ) => void;
  getError: (name: string) => string | undefined;
};

const Context = React.createContext<ContextType>({
  setValue: () => {},
  getValue: () => undefined,
  registerValueCallback: () => {},
  unregisterValueCallback: () => {},
  registerField: () => {},
  unregisterErrorCallback: () => {},
  registerErrorCallback: () => {},
  getError: () => undefined,
});

const useValue = (key: string) => {
  const { registerValueCallback, unregisterValueCallback } = useContext(
    Context
  );
  const [value, setValue] = useState<Value>(0);
  const idRef = useRef(`${key}_subscription`);
  useEffect(() => {
    registerValueCallback(key, idRef.current, setValue);
    return () => {
      unregisterValueCallback(idRef.current);
    };
  }, [registerValueCallback, unregisterValueCallback, idRef]);
  return value;
};

const useError = (key: string) => {
  const { registerErrorCallback, unregisterErrorCallback } = useContext(
    Context
  );
  const [error, setError] = useState<Error>(undefined);
  const idRef = useRef(`${key}_error_subscription`);
  useEffect(() => {
    registerErrorCallback(key, idRef.current, setError);
    return () => {
      unregisterErrorCallback(idRef.current);
    };
  }, [registerErrorCallback, unregisterErrorCallback, idRef]);
  return error;
};

const useListners = () => {
  const listners = useRef<Listner[]>([]);
  const registerCallback = useCallback(
    (listenTo: string, id: string, callback: (value: any) => void) => {
      listners.current = [
        ...listners.current.filter(({ id: _id }) => _id !== id),
        { listenTo, id, callback },
      ];
    },
    [listners]
  );
  const unregisterCallback = useCallback(
    (id: string) => {
      listners.current = listners.current.filter(({ id: _id }) => _id !== id);
    },
    [listners.current]
  );
  return [listners, registerCallback, unregisterCallback] as const;
};

export const Lowely = () => {
  const values = useRef<{ [key in string]: Value }>({});
  const fields = useRef<{ [key in string]: Field }>({});
  const errors = useRef<{ [key in string]: string | undefined }>({});
  const touched = useRef<{ [key in string]: boolean }>({});
  const [
    errorListners,
    registerErrorCallback,
    unregisterErrorCallback,
  ] = useListners();
  const [
    valueListners,
    registerValueCallback,
    unregisterValueCallback,
  ] = useListners();
  const registerField = (
    ref: HTMLInputElement | null,
    key: string,
    config: FieldConfig = {}
  ) => {
    fields.current = {
      ...fields.current,
      [key]: {
        ref,
        config,
      },
    };
  };
  const unregisterField = (key: string) => {
    // Todo
  };
  const notifyListners = (
    listners: React.MutableRefObject<Listner[]>,
    name: string,
    value: any
  ) => {
    // check if value has changed?
    listners.current.forEach((listner) => {
      if (listner.listenTo === name) {
        listner.callback(value);
      }
    });
  };
  //   const validateValues = () => {
  //     const newErrors = Object.keys(fields.current)
  //       .map((key) => ({ ...fields.current[key], key }))
  //       .reduce((acc, field) => {
  //         if (field.config.validate) {
  //           const error = field.config.validate(values.current[field.key]);
  //           return {
  //             ...acc,
  //             [field.key]: error,
  //           };
  //         }
  //         return acc;
  //       }, {});
  //     errors.current = newErrors;
  //   };

  const validateValue = (key: string, value: Value) => {
    console.log("validateValue", key, value);
    const field = fields.current[key];
    if (field.config.validate) {
      const prev = errors.current[key];
      const next = field.config.validate(value);
      errors.current = {
        ...errors.current,
        [key]: field.config.validate(value),
      };
      console.log("prev", prev, "next", next);
      if (prev !== next) {
        notifyListners(errorListners, key, next);
      }
    }
  };
  const setValue = useCallback(
    (key: string, value: Value) => {
      values.current = { ...values.current, [key]: value };
      notifyListners(valueListners, key, value);
      validateValue(key, value);
    },
    [values]
  );
  const getValue = useCallback(
    (key: string) => {
      return values.current[key];
    },
    [values]
  );
  const getError = useCallback(
    (key: string) => {
      return errors.current[key];
    },
    [errors]
  );
  const counter = useRef(0);
  counter.current++;
  return (
    <Context.Provider
      value={{
        setValue,
        getValue,
        registerValueCallback,
        unregisterValueCallback,
        registerField,
        registerErrorCallback,
        unregisterErrorCallback,
        getError,
      }}
    >
      <div>
        <Field name="firstname" />
        <ErrorComponent name="firstname" />
        <Child name={"First Child"} />
        <ErrorComponent name="First Child" />
        <Child name={"Second Child"} />
        <ErrorComponent name="Second Child" />
        Renders {counter.current}
      </div>
    </Context.Provider>
  );
};
