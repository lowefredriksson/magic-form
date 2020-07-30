import { FieldsRefValue } from "./types";

export const getFormStateFromFields = (fields: FieldsRefValue) => {
  return Object.keys(fields).map(key => fields[key].ref).reduce((formState, field) => ({ ...formState, [field.name]: field.value }), {});
};
