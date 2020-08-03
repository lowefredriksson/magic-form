export const useError = "h";
// import { useContext, useCallback, ChangeEvent, FocusEvent } from "react";
// import { FieldSpreadProps, MagicFormContext } from "./MagicForm";
// import { ErrorType, errorEquals } from "./Error";
// import { getFormStateFromFields } from "./getFormStateFromFields";

// export const useError = (
//   name: string,
//   options: {
//     validate?: (
//       value: string,
//       fields: {
//         [Key: string]: string;
//       }
//     ) => Promise<ErrorType>;
//     required?: boolean;
//   } = {}
// ): [ErrorType | null, FieldSpreadProps] => {
//   const { fields, setError, errors } = useContext(MagicFormContext);
//   const { validate } = options;
//   const error = errors[name];
//   // const [error, setError] = useState<ErrorType | null>(null);

//   const onBlur = useCallback(async (event: FocusEvent<HTMLInputElement>) => {
//     // const field = fields.find(f => f.name === name);
//     if (validate) {
//       const valid = await validate(event.target.value, getFormStateFromFields(fields));
//       // trigger aria-live on error to annonce
//       // setError(null);
//       // setError(valid);
//       if (!errorEquals(error, valid.message)) {
//         setError(name, valid?.message ?? "");
//       }
//     }
//   }, [fields, validate, error]);

//   const onChange = useCallback(
//     async (event: ChangeEvent<HTMLInputElement>) => {
//       console.log("onChange target", event.target)
//       if (error !== null && validate) {
//         const valid = await validate(event.target.value,   getFormStateFromFields(fields.map(({ ref }) => ref)));
//         if (!errorEquals(error, valid)) {
//           setError(valid);
//         }
//       }
//     },
//     [error, fields, validate]
//   );

//   return [error, { onBlur, onChange }];
// };
