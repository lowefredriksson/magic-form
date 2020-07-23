import { useContext, useState, useCallback, ChangeEvent } from "react";
import { FieldSpreadProps, MagicFormContext } from "./MagicForm";
import { ErrorType, errorEquals } from "./Error";
import { getFormStateFromFields } from "./getFormStateFromFields";

export const useError = (
  name: string,
  options: {
    validate?: (
      value: string,
      fields: {
        [Key: string]: string;
      }
    ) => Promise<ErrorType>;
    required?: boolean;
  } = {}
): [ErrorType | null, FieldSpreadProps] => {
  const { fields } = useContext(MagicFormContext);
  const { validate } = options;

  const [error, setError] = useState<ErrorType | null>(null);

  const onBlur = useCallback(async () => {
    const field = fields[name];
    if (validate && field) {
      const valid = await validate(field.value, getFormStateFromFields(fields));
      // trigger aria-live on error to annonce
      setError(null);
      setError(valid);
    }
  }, [fields, validate, name]);

  const onChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (error !== null && validate) {
        const valid = await validate(event.target.value, getFormStateFromFields(fields));
        if (!errorEquals(error, valid)) {
          setError(valid);
        }
      }
    },
    [error, fields, validate]
  );

  return [error, { onBlur, onChange }];
};
