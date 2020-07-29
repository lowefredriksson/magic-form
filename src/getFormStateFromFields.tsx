import { FieldRef } from "./types";

export const getFormStateFromFields = (fields: FieldRef[]) => {
  return fields.reduce((formState, field) => ({ ...formState, [field.name]: field.value }), {});
};
