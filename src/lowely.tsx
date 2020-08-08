import React, { useRef, HTMLProps } from "react";
import { useFieldProps } from "./useFieldProps";
import { useError, useTouched } from "./useListener";
import { ValidationResolver, FieldRef, Value } from "./types";
import { useForm } from "./useForm";
import { Context } from "./Context";

export const useRenderCounter = () => {
  const counter = useRef(0);
  counter.current++;
  return counter.current;
};

export const Field: React.FC<
  {
    name: string;
    validate?: ValidationResolver;
    as?: string;
  } & HTMLProps<FieldRef>
> = ({ name, validate, as, ...inputProps }) => {
  const fieldProps = useFieldProps(name, {
    validate,
  });
  const props = { ...inputProps, ...fieldProps };
  if (as) {
    return React.isValidElement(as)
      ? React.cloneElement(as, props)
      : React.createElement(as, props);
  }
  return <input {...props} />;
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
      {error && touched ? (
        <p aria-live="assertive" role="alert" aria-atomic="true">
          {error}
        </p>
      ) : null}
    </div>
  );
};

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
          <Field name="email" type="email" />
          <fieldset>
            <Field
              type="password"
              name="password"
              //cleanup on unregister
              validate={(value: Value) =>
                (value as string).length < 4
                  ? "Should be at least 4 characters"
                  : undefined
              }
            />
            <ErrorComponent name="password" />
            <Field
              type="password"
              name="confirm password"
              validate={async (value: Value, values) =>
                Promise.resolve(
                  (value as string).length < 4
                    ? "Should be at least 4 characters"
                    : value !== values.get("password")
                    ? "Should match password"
                    : undefined
                )
              }
            />
            <ErrorComponent name="confirm password" />
          </fieldset>
          <Field as="select" name="colour">
            <option value="red" label="red" />
            <option value="blue" label="blue" />
          </Field>
          <Field type="checkbox" name="isCompany" />
          <input type="submit" value="Sign up" />
        </form>
      </Context.Provider>
      Renders {count}
    </div>
  );
};
