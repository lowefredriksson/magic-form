import { useContext, useState, useCallback, ChangeEvent } from "react";
import { FieldSpreadProps, MagicFormContext } from "./MagicForm";
import { Error, errorEquals } from "./Error";

export const useError = (
  name: string,
  options: {
    validate?: (
      value: string,
      fields: {
        [Key: string]: HTMLInputElement;
      }
    ) => Promise<Error>;
    required?: boolean;
  } = {}
): [Error | null, FieldSpreadProps] => {
  const { fields } = useContext(MagicFormContext);
  const { validate } = options;

  const [error, setError] = useState<Error | null>(null);

  const onBlur = useCallback(async () => {
    const field = fields[name];
    if (validate && field) {
      const valid = await validate(field.value, fields);
      if (!errorEquals(error, valid)) {
        setError(valid);
      }
    }
  }, [fields, validate, error, name]);

  const onChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (error !== null && validate) {
        const valid = await validate(event.target.value, fields);
        if (!errorEquals(error, valid)) {
          setError(valid);
        }
      }
    },
    [error, fields, validate]
  );

  return [error, { onBlur, onChange }];
};
