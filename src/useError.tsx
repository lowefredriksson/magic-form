import { useContext, useState, useCallback, ChangeEvent } from "react";
import { FieldSpreadProps, MagicFormContext } from "./MagicForm";
import { Error, errorEquals } from "./Error";
export const useError = (
  name: string,
  options: {
    validate?: (value: string) => Error;
  } = {}
): [Error | null, FieldSpreadProps] => {
  const { fields } = useContext(MagicFormContext);
  const { validate } = options;

  const [error, setError] = useState<Error | null>(null);

  const onBlur = useCallback(() => {
    const field = fields[name];
    if (validate && field) {
      const valid = validate(field.value);
      if (!errorEquals(error, valid)) {
        setError(valid);
      }
    }
  }, [fields, validate, error, name]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (error !== null && validate) {
        const valid = validate(event.target.value);
        if (!errorEquals(error, valid)) {
          setError(valid);
        }
      }
    },
    [error, validate]
  );

  return [error, { onBlur, onChange }];
};
