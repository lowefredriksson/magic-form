export type Error = string;
export type Value = number | string;
export type ErrorResolver =
  | ((value: Value, values: Map<string, Value>) => string | undefined)
  | ((value: Value, values: Map<string, Value>) => Promise<string | undefined>);
export type FieldConfig = {
  validate?: ErrorResolver;
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
  registerFormStatusObserver: RegisterObserver<string>;
  registerDescriptionObserver: RegisterObserver<string[]>;
  addDescription: (field: string, descriptionId: string) => void;
  removeDescription: (field: string, descriptionId: string) => void;
  registerField: (
    ref: FieldRef | null,
    key: string,
    config: FieldConfig
  ) => void;
  getError: (key: string) => string | undefined;
  setTouched: (key: string, isTouched?: boolean) => void;
  getTouched: (key: string) => boolean | undefined;
  getFormStatus: (key: string) => string | undefined;
  setValue: (key: string, value: Value) => void;
  getValue: (key: string) => Value | undefined;
};
