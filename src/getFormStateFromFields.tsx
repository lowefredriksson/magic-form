export const getFormStateFromFields = (fields: HTMLInputElement[]) => {
  return fields.reduce((formState, field) => ({ ...formState, [field.name]: field.value }), {});
};
