import { FieldEntry, Error } from "./types";
export function focusFirstError(
  fields: Map<string, FieldEntry>,
  errors: Map<string, Error | undefined>
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
