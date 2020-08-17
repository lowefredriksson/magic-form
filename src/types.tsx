export type Error = string;
export type Value = number | string;
export type ValidationResolver =
  | ((value: Value, values: Map<string, Value>) => string | undefined)
  | ((value: Value, values: Map<string, Value>) => Promise<string | undefined>);
export type FieldConfig = {
  validate?: ValidationResolver;
  removeStateOnUnregister?: boolean;
};
export type FieldEntry = { ref?: FieldRef | null; config: FieldConfig };
export type FieldRef =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type Observer<T> = {
  update: (state: T) => void;
  key: string;
};

export type UnregisterObserver = () => void;
export type RegisterObserver<T> = (
  key: string,
  update: (state: T) => void
) => UnregisterObserver;

export type ContextType = {
  registerValueObserver: RegisterObserver<Value>;
  registerErrorObserver: RegisterObserver<Error>;
  registerTouchedObserver: RegisterObserver<boolean>;
  registerField: (
    ref: FieldRef | null,
    key: string,
    config: FieldConfig
  ) => void;
  getError: (key: string) => string | undefined;
  setTouched: (key: string, isTouched?: boolean) => void;
  getTouched: (key: string) => boolean | undefined;
  setValue: (key: string, value: Value) => void;
  getValue: (key: string) => Value | undefined;
};
