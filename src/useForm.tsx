import React, { useRef, useCallback } from "react";
import { useListeners, notifyListeners } from "./useListener";
import {
  ValidationResolver,
  FieldRef,
  Value,
  FieldEntry,
  Error,
  FieldConfig,
  Listener,
} from "./types";
export function useForm({
  onSubmit,
}: {
  onSubmit: (values: Map<string, Value>) => Promise<any>;
}) {
  const values = useRef<Map<string, Value>>(new Map());
  const fields = useRef<Map<string, FieldEntry>>(new Map());
  const errors = useRef<Map<string, Error>>(new Map());
  const touched = useRef<Set<string>>(new Set());
  const registerField = useCallback(
    (ref: FieldRef | null, key: string, config: FieldConfig = {}) => {
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

  const validateValue = async (
    key: string,
    value: Value,
    values: Map<string, Value>,
    validate: ValidationResolver
  ) => {
    const prev = errors.current.get(key);
    const next = await validate(value, values);
    if (next === undefined) {
      errors.current.delete(key);
    } else {
      errors.current.set(key, next);
    }
    if (prev !== next) {
      notifyListeners(errorListeners, key, next);
    }
    return errors;
  };

  const validateForm = async () => {
    values.current.forEach(async (value, key, map) => {
      const resolver = fields.current.get(key)?.config.validate;
      if (resolver) {
        await validateValue(key, value, map, resolver);
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
      console.log("values", values);
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

  const handleSubmit = onHandleSubmit(
    fields,
    touched,
    validateForm,
    errors,
    onSubmit,
    values,
    touchedListeners
  );

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

function onHandleSubmit(
  fields: React.MutableRefObject<Map<string, FieldEntry>>,
  touched: React.MutableRefObject<Set<string>>,
  validateForm: () => Promise<void>,
  errors: React.MutableRefObject<Map<string, string>>,
  onSubmit: (values: Map<string, Value>) => Promise<any>,
  values: React.MutableRefObject<Map<string, Value>>,
  touchedListeners: React.MutableRefObject<Listener<boolean>[]>
) {
  return async (event: React.FormEvent<HTMLFormElement>) => {
    if (event && event.preventDefault) {
      event.preventDefault();
      event.persist();
    }
    // set all fields touched
    fields.current.forEach((_, key) => {
      touched.current.add(key);
    });
    // run validation
    await validateForm();
    if (errors.current.size > 0) {
      focusFirstError(fields.current, errors.current);
      return;
    } else {
      onSubmit(values.current).then(() => {
        console.log("submitted");
        touched.current.clear();
        touchedListeners.current.forEach((value, index, array) => {
          value.callback(false);
        });
      });
    }
  };
}

function focusFirstError(
  fields: Map<string, FieldEntry>,
  errors: Map<string, Error>
) {
  let hasFocus = false;
  fields.forEach((value, key, map) => {
    if (hasFocus) {
      return;
    }
    if (errors.has(key)) {
      hasFocus = true;
      value.ref?.focus();
    }
  });
}
