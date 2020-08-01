import {
  useContext,
  useState,
  useCallback,
  ChangeEvent,
  FocusEvent,
} from "react";
import { FieldSpreadProps, MagicFormContext } from "./MagicForm";
import { ErrorType, errorEquals } from "./Error";
import { getFormStateFromFields } from "./getFormStateFromFields";
import { ErrorResolver } from "./types";

export const useError = (
  name: string,
  options: {
    validate?: ErrorResolver;
    required?: boolean;
  } = {}
): [ErrorType | null, FieldSpreadProps] => {
  const { fields } = useContext(MagicFormContext);
  const { validate } = options;

  const [error, setError] = useState<ErrorType | null>(null);

  const onBlur = useCallback(
    async (event: FocusEvent<HTMLInputElement>) => {
      // const field = fields.find(f => f.name === name);
      if (validate) {
        const valid = await validate(
          event.target.value,
          getFormStateFromFields(fields)
        );
        // trigger aria-live on error to annonce
        // setError(null);
        // setError(valid);
        if (!errorEquals(error, valid)) {
          setError(valid);
        }
      }
    },
    [fields, validate, error]
  );

  const onChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (error !== null && validate) {
        const valid = await validate(
          event.target.value,
          getFormStateFromFields(fields)
        );
        if (!errorEquals(error, valid)) {
          setError(valid);
        }
      }
    },
    [error, fields, validate]
  );

  return [error, { onBlur, onChange }];
};
