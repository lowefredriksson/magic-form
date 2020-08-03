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
      validate: (value: Value, values: Map<string, Value>) => {
        return value < 0 ? "Should be positive" : undefined;
      },
    });
  }, [registerField, name]);
  const wVal = useValue(name);
  const counter = useRenderCounter();
  const increase = () => {
    const prev = getValue(name);
    setValue(name, ((prev as number) ?? 0) - 1);
  };
  const decrease = () => {
    const prev = getValue(name);
    setValue(name, ((prev as number) ?? 0) + 1);
  };
  return (
    <>
      <div>
        {name} {counter}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button type="button" onClick={increase}>
          Minus
        </button>
        The watch {wVal}
        <button type="button" onClick={decrease}>
          Plus
        </button>
      </div>
    </>
  );
};

const useField = (name: string, config: FieldConfig) => {
  const { setValue, setTouched, registerField } = useContext(Context);
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(name, event.target.value);
    },
    [setValue, name]
  );
  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setTouched(name);
    },
    [setTouched, name]
  );
  const register = useCallback(
    (ref: HTMLInputElement) => {
      registerField(ref, name, config);
    },
    [name, config, registerField]
  );
  return {
    name,
    id: `${name}_input`,
    onChange,
    onBlur,
    ref: register,
  };
};

const Field = ({
  name,
  validate,
}: {
  name: string;
  validate?: ValidationResolver;
}) => {
  const counter = useRenderCounter();
  const fieldProps = useField(name, {
    validate,
  });
  return <input {...fieldProps} />;
};

const ErrorComponent = ({ name }: { name: string }) => {
  const count = useRenderCounter();
  const error = useError(name);
  const touched = useTouched(name);
  return (
    <div
      style={{
        padding: "5px",
        borderRadius: "10px",
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <p>Renders {count}</p>
      {error && touched ? <p>{error}</p> : null}
    </div>
  );
};

type Error = string;
type Value = number | string;
type ValidationResolver = (
  value: Value,
  values: Map<string, Value>
) => string | undefined;
type FieldConfig = {
  validate?: ValidationResolver;
};
type Field = { ref?: HTMLInputElement | null; config: FieldConfig };
type Listener = {
  id: string;
  callback: (value: Value) => void;
  listenTo: string;
};

type RegisterListener<T> = (
  name: string,
  id: string,
  callback: (value: T) => void
) => void;

type UnregisterListener = (id: string) => void;

type ContextType = {
  registerValueListener: RegisterListener<Value>;
  unregisterValueListener: UnregisterListener;
  registerErrorListener: RegisterListener<Error>;
  unregisterErrorListener: UnregisterListener;
  registerTouchedListener: RegisterListener<boolean>;
  unregisterTouchedListener: UnregisterListener;
  registerField: (
    ref: HTMLInputElement | null,
    key: string,
    config: FieldConfig
  ) => void;
  getError: (name: string) => string | undefined;
  setTouched: (key: string, isTouched?: boolean) => void;
  getTouched: (key: string) => boolean | undefined;
  setValue: (key: string, value: Value) => void;
  getValue: (key: string) => Value | undefined;
};

function useListener<T>(
  key: string,
  id: string,
  register: RegisterListener<T>,
  unregister: UnregisterListener
) {
  const [value, setValue] = useState<T | undefined>(undefined);
  const idRef = useRef(id);
  useEffect(() => {
    register(key, idRef.current, setValue);
    return () => {
      unregister(idRef.current);
    };
  }, [register, unregister, idRef, setValue, key]);
  return value;
}

const useValue = (key: string) => {
  const { registerValueListener, unregisterValueListener } = useContext(
    Context
  );
  return useListener<Value>(
    key,
    `${key}_subscription`,
    registerValueListener,
    unregisterValueListener
  );
};

const useError = (key: string) => {
  const { registerErrorListener, unregisterErrorListener } = useContext(
    Context
  );
  return useListener<Error>(
    key,
    `${key}_error_subscription`,
    registerErrorListener,
    unregisterErrorListener
  );
};

const useTouched = (key: string) => {
  const { registerTouchedListener, unregisterTouchedListener } = useContext(
    Context
  );
  return useListener<boolean>(
    key,
    `${key}_touched_subscription`,
    registerTouchedListener,
    unregisterTouchedListener
  );
};

const useListeners = () => {
  const listeners = useRef<Listener[]>([]);
  const registerCallback = useCallback(
    (listenTo: string, id: string, callback: (value: any) => void) => {
      listeners.current = [
        ...listeners.current.filter(({ id: _id }) => _id !== id),
        { listenTo, id, callback },
      ];
    },
    [listeners]
  );
  const unregisterCallback = useCallback(
    (id: string) => {
      listeners.current = listeners.current.filter(({ id: _id }) => _id !== id);
    },
    [listeners.current]
  );
  return [listeners, registerCallback, unregisterCallback] as const;
};

const notifyListeners = (
  listners: React.MutableRefObject<Listener[]>,
  name: string,
  value: any
) => {
  listners.current.forEach((listner) => {
    if (listner.listenTo === name) {
      listner.callback(value);
    }
  });
};

function useForm({
  onSubmit,
}: {
  onSubmit: (values: Map<string, Value>) => Promise<any>;
}) {
  const [_, reRender] = useState("");
  const values = useRef<Map<string, Value>>(new Map());
  const fields = useRef<Map<string, Field>>(new Map());
  const errors = useRef<Map<string, Error>>(new Map());
  const touched = useRef<Set<string>>(new Set());
  const registerField = useCallback(
    (ref: HTMLInputElement | null, key: string, config: FieldConfig = {}) => {
      fields.current.set(key, { ref, config });
    },
    [fields]
  );
  const unregisterField = (key: string) => {
    fields.current.delete(key);
    values.current.delete(key);
    touched.current.delete(key);
    errors.current.delete(key);
  };
  const [
    errorListeners,
    registerErrorListener,
    unregisterErrorListener,
  ] = useListeners();
  const [
    valueListeners,
    registerValueListener,
    unregisterValueListener,
  ] = useListeners();
  const [
    touchedListeners,
    registerTouchedListener,
    unregisterTouchedListener,
  ] = useListeners();

  const validateValue = (
    key: string,
    value: Value,
    validate: ValidationResolver
  ) => {
    const prev = errors.current.get(key);
    const next = validate(value, values.current);
    if (next === undefined) {
      errors.current.delete(key);
    } else {
      errors.current.set(key, next);
    }
    if (prev !== next) {
      notifyListeners(errorListeners, key, next);
    }
  };

  const validateForm = () => {
    return values.current.forEach((value, key, map) => {
      const resolver = fields.current.get(key)?.config.validate;
      if (resolver) {
        validateValue(key, value, resolver);
      }
    });
  };

  const setValue = useCallback(
    (key: string, value: Value) => {
      const prev = values.current.get(key);
      values.current.set(key, value);
      if (prev !== value) {
        notifyListeners(valueListeners, key, value);
        validateForm();
      }
    },
    [values, notifyListeners, valueListeners, validateValue]
  );

  const setTouched = useCallback(
    (key: string) => {
      if (!touched.current.has(key)) {
        notifyListeners(touchedListeners, key, true);
      }
      touched.current.add(key);
    },
    [touched, notifyListeners, touchedListeners]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // set all fields touched
    fields.current.forEach((_, key) => {
      touched.current.add(key);
    });
    // run validation
    validateForm();
    onSubmit(values.current).then(() => {
      console.log("submitted");
      touched.current.clear();
      errors.current.clear();
      values.current.clear();
      reRender("");
    }).catch;

    // : if error :

    // focus first error field

    // : else :

    // set is validating ref false
    // set is submiting ref true
    // call user onSumbit
    // set is submitting ref false

    // : if error :
    // set submitError ref

    // : else :

    console.log("onSubmit");
  };

  const getValue = (key: string) => values.current.get(key);
  const getError = (key: string) => errors.current.get(key);
  const getTouched = (key: string) => touched.current.has(key);
  return {
    registerField,
    unregisterField,
    setValue,
    registerValueListener,
    unregisterValueListener,
    registerErrorListener,
    unregisterErrorListener,
    setTouched,
    registerTouchedListener,
    unregisterTouchedListener,
    getValue,
    getError,
    getTouched,
    handleSubmit,
  } as const;
}

const Context = React.createContext<ContextType>({
  registerValueListener: () => {},
  unregisterValueListener: () => {},
  registerField: () => {},
  unregisterErrorListener: () => {},
  registerErrorListener: () => {},
  unregisterTouchedListener: () => {},
  registerTouchedListener: () => {},
  getError: () => undefined,
  setTouched: () => {},
  getTouched: () => false,
  setValue: () => {},
  getValue: () => undefined,
});

export const Lowely = () => {
  const { handleSubmit, ...formBag } = useForm({
    onSubmit: () => {
      return Promise.resolve(true);
    },
  });
  const count = useRenderCounter();
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Context.Provider value={formBag}>
        <form
          style={{
            width: "400px",
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit}
        >
          <Field
            name="password"
            validate={(value: Value) =>
              (value as string).length < 4
                ? "Should be at least 4 characters"
                : undefined
            }
          />
          <ErrorComponent name="password" />
          <Field
            name="confirm password"
            validate={(value: Value, values) =>
              (value as string).length < 4
                ? "Should be at least 4 characters"
                : value !== values.get("password")
                ? "Should match password"
                : undefined
            }
          />
          <ErrorComponent name="confirm password" />
          <input type="submit" value="Submit" />
        </form>
      </Context.Provider>
      Renders {count}
    </div>
  );
};
