export type Error = string;
export type Value = number | string;
export type ValidationResolver =
  | ((value: Value, values: Map<string, Value>) => string | undefined)
  | ((value: Value, values: Map<string, Value>) => Promise<string | undefined>);
export type FieldConfig = {
  validate?: ValidationResolver;
};
export type FieldEntry = { ref?: FieldRef | null; config: FieldConfig };
export type FieldRef = HTMLInputElement | HTMLSelectElement;
export type Listener<T> = {
  id: string;
  callback: (value: T) => void;
  listenTo: string;
};

export type RegisterListener<T> = (
  name: string,
  id: string,
  callback: (value: T) => void
) => void;

export type UnregisterListener = (id: string) => void;
export type ContextType = {
  registerValueListener: RegisterListener<Value>;
  unregisterValueListener: UnregisterListener;
  registerErrorListener: RegisterListener<Error>;
  unregisterErrorListener: UnregisterListener;
  registerTouchedListener: RegisterListener<boolean>;
  unregisterTouchedListener: UnregisterListener;
  registerField: (
    ref: FieldRef | null,
    key: string,
    config: FieldConfig
  ) => void;
  getError: (name: string) => string | undefined;
  setTouched: (key: string, isTouched?: boolean) => void;
  getTouched: (key: string) => boolean | undefined;
  setValue: (key: string, value: Value) => void;
  getValue: (key: string) => Value | undefined;
};
