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
} from "../types";
import { focusFirstError } from "../utils/focusFirstError";

export type UseFormProps = {
  onSubmit: (
    values: Map<string, Value>
  ) => Promise<{ message: string; status: "success" | "error" }>;
  removeStateOnUnregister?: boolean;
};

export function useForm({
  onSubmit,
  removeStateOnUnregister = true,
}: UseFormProps) {
  const fields = useRef<Map<string, FieldEntry>>(new Map());
  const errorSubject = useMapSubject<Error | undefined>({});
  const descriptionSubject = useMapSubject<string[]>({});
  const valueSubject = useMapSubject<Value>({
    onChange: () => {
      validateForm();
    },
  });
  const touchedSubject = useMapSubject<boolean>({});
  const formStatusSubject = useMapSubject<string>({});
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
        formStatusSubject.state.current.delete(key);
      }
    },
    [
      errorSubject.state,
      formStatusSubject.state,
      removeStateOnUnregister,
      touchedSubject.state,
      valueSubject.state,
    ]
  );

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

  const validateForm = useCallback(async () => {
    valueSubject.state.current.forEach(async (value, key, map) => {
      const resolver = fields.current.get(key)?.config.validate;
      if (resolver) {
        await validateValue(key, value, map, resolver);
      }
    });
  }, [validateValue, valueSubject.state]);

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

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (event && event.preventDefault) {
        event.preventDefault();
        event.persist();
      }
      // set all fields touched
      fields.current.forEach((_, key) => {
        touchedSubject.state.current.set(key, true);
      });
      // run validation
      await validateForm();
      if (errorSubject.state.current.size > 0) {
        focusFirstError(fields.current, errorSubject.state.current);
        return;
      } else {
        const res = await onSubmit(valueSubject.state.current);
        console.log("res", res);
        formStatusSubject.state.current.clear();
        formStatusSubject.setState(res.status, res.message);
        console.log("formStatus state", formStatusSubject.state.current);
        touchedSubject.state.current.clear();
        touchedSubject.observers.current.forEach((value, index, array) => {
          value.update(false);
        });
        if (res.status === "success") {
          return;
        }
      }
    },
    [
      errorSubject.state,
      formStatusSubject,
      onSubmit,
      touchedSubject.observers,
      touchedSubject.state,
      validateForm,
      valueSubject.state,
    ]
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
  const getFormStatus = useCallback(
    (key: string) => formStatusSubject.state.current.get(key),
    [formStatusSubject.state]
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
    registerFormStatusObserver: formStatusSubject.registerObserver,
    getValue,
    getError,
    getTouched,
    getFormStatus,
    handleSubmit,
  } as const;
}
