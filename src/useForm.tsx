import React, { useRef, useCallback } from "react";
import { useMapSubject } from "./useSubject";
import { notifyObservers } from "./notifyObservers";
import {
  ValidationResolver,
  FieldRef,
  Value,
  FieldEntry,
  Error,
  FieldConfig,
  Observer,
} from "./types";
import { focusFirstError } from "./focusFirstError";

export function useForm({
  onSubmit,
  removeStateOnUnregister = true,
}: {
  onSubmit: (values: Map<string, Value>) => Promise<any>;
  removeStateOnUnregister?: boolean;
}) {
  // The fields that currently are mounted in the form context.
  const fields = useRef<Map<string, FieldEntry>>(new Map());
  const registerField = useCallback(
    (ref: FieldRef | null, key: string, config: FieldConfig = {}) => {
      fields.current.set(key, { ref, config });
    },
    [fields]
  );
  const unregisterField = (key: string) => {
    fields.current.delete(key);
    if (removeStateOnUnregister) {
      valueSubject.state.current.delete(key);
      touchedSubject.state.current.delete(key);
      errorSubject.state.current.delete(key);
    }
  };
  const errorSubject = useMapSubject<Error | undefined>({});
  const valueSubject = useMapSubject<Value>({
    onChange: () => {
      validateForm();
    },
  });
  const touchedSubject = useMapSubject<boolean>({});

  const validateValue = async (
    key: string,
    value: Value,
    values: Map<string, Value>,
    validate: ValidationResolver
  ) => {
    const prev = errorSubject.state.current.get(key);
    const next = await validate(value, values);
    if (next === undefined) {
      errorSubject.state.current.delete(key);
    } else {
      errorSubject.state.current.set(key, next);
    }
    if (prev !== next) {
      notifyObservers<string | undefined>(errorSubject.observers, key, next);
    }
    return errorSubject.state;
  };

  const validateForm = async () => {
    valueSubject.state.current.forEach(async (value, key, map) => {
      const resolver = fields.current.get(key)?.config.validate;
      if (resolver) {
        await validateValue(key, value, map, resolver);
      }
    });
  };

  const setTouched = useCallback(
    (key: string) => {
      touchedSubject.setState(key, true);
    },
    [touchedSubject.state, touchedSubject.observers]
  );

  const handleSubmit = onHandleSubmit(
    fields,
    touchedSubject.state,
    validateForm,
    errorSubject.state,
    onSubmit,
    valueSubject.state,
    touchedSubject.observers
  );

  const getValue = (key: string) => valueSubject.state.current.get(key);
  const getError = (key: string) => errorSubject.state.current.get(key);
  const getTouched = (key: string) => touchedSubject.state.current.has(key);
  return {
    registerField,
    unregisterField,
    setValue: valueSubject.setState,
    registerValueObserver: valueSubject.registerObserver,
    registerErrorObserver: errorSubject.registerObserver,
    setTouched,
    registerTouchedObserver: touchedSubject.registerObserver,
    getValue,
    getError,
    getTouched,
    handleSubmit,
  } as const;
}

function onHandleSubmit(
  fields: React.MutableRefObject<Map<string, FieldEntry>>,
  touched: React.MutableRefObject<Map<string, boolean>>,
  validateForm: () => Promise<void>,
  errors: React.MutableRefObject<Map<string, Error | undefined>>,
  onSubmit: (values: Map<string, Value>) => Promise<any>,
  values: React.MutableRefObject<Map<string, Value>>,
  touchedObservers: React.MutableRefObject<Map<number, Observer<boolean>>>
) {
  return async (event: React.FormEvent<HTMLFormElement>) => {
    if (event && event.preventDefault) {
      event.preventDefault();
      event.persist();
    }
    // set all fields touched
    fields.current.forEach((_, key) => {
      touched.current.set(key, true);
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
        touchedObservers.current.forEach((value, index, array) => {
          value.update(false);
        });
      });
    }
  };
}
