export const getFormStateFromFields = (fields: { [Key: string]: HTMLInputElement; }) => {
  return Object.keys(fields).reduce((formState, fieldKey) => ({ ...formState, [fieldKey]: fields[fieldKey].value }), {});
};
