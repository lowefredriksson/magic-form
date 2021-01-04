import React, { useRef, useCallback } from "react";
import { useMapSubject } from "./useSubject";
import { notifyObservers } from "../utils/notifyObservers";
import {
  ErrorResolver,
  FieldRef,
  Value,
  FieldEntry,
  Error,
  FieldConfig,
  Observer,
} from "../types";
import { focusFirstError } from "../utils/focusFirstError";

export function useForm({
  onSubmit,
  removeStateOnUnregister = true,
}: {
  onSubmit: (values: Map<string, Value>) => Promise<any>;
  removeStateOnUnregister?: boolean;
}) {
  // The fields that currently are mounted in the form context.
  const fields = useRef<Map<string, FieldEntry>>(new Map());
  const errorSubject = useMapSubject<Error | undefined>({});
  const descriptionSubject = useMapSubject<string[]>({});
  const valueSubject = useMapSubject<Value>({
    onChange: () => {
      validateForm();
    },
  });
  const touchedSubject = useMapSubject<boolean>({});
  const registerField = useCallback(
    (ref: FieldRef | null, key: string, config: FieldConfig = {}) => {
      fields.current.set(key, { ref, config });
    },
    [fields]
  );
  const unregisterField = useCallback(
    (key: string) => {
      fields.current.delete(key);
      if (removeStateOnUnregister) {
        valueSubject.state.current.delete(key);
        touchedSubject.state.current.delete(key);
        errorSubject.state.current.delete(key);
      }
    },
    [
      errorSubject.state,
      removeStateOnUnregister,
      touchedSubject.state,
      valueSubject.state,
    ]
  );
  //  const submitStatusRef = useRef<{ status: boolean; message: string }>(null);

  const validateValue = useCallback(
    async (
      key: string,
      value: Value,
      values: Map<string, Value>,
      validate: ErrorResolver
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
    },
    [errorSubject.observers, errorSubject.state]
  );

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
    [touchedSubject]
  );

  const addDescription = useCallback(
    (field: string, descriptionId: string) => {
      descriptionSubject.setState(field, [
        ...(descriptionSubject.state.current.get(field) ?? []),
        descriptionId,
      ]);
    },
    [descriptionSubject]
  );

  const removeDescription = useCallback(
    (field: string, descriptionId: string) => {
      descriptionSubject.setState(field, [
        ...(descriptionSubject.state.current
          .get(field)
          ?.filter((d) => d !== descriptionId) ?? []),
      ]);
    },
    [descriptionSubject]
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

  const getValue = useCallback(
    (key: string) => valueSubject.state.current.get(key),
    [valueSubject.state]
  );
  const getError = useCallback(
    (key: string) => errorSubject.state.current.get(key),
    [errorSubject.state]
  );
  const getTouched = useCallback(
    (key: string) => touchedSubject.state.current.has(key),
    [touchedSubject.state]
  );
  return {
    registerField,
    unregisterField,
    registerDescriptionObserver: descriptionSubject.registerObserver,
    addDescription,
    removeDescription,
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
    console.log("handle submit", values);
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
      const res = await onSubmit(values.current);
      touched.current.clear();
      touchedObservers.current.forEach((value, index, array) => {
        value.update(false);
      });
      // if (res.status === 200) {
      // submitStatus
      // }
    }
  };
}
