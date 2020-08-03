export const MagicForm = "";

// import React, { useRef, useState } from "react";
// import "./App.css";
// import { registerRender } from "./renders";
// import { getFormStateFromFields } from "./getFormStateFromFields";
// import { FormContextType, FieldRef, FieldOptions, FieldsRefValue } from "./types";
// import { ErrorType } from "./Error";

// export const MagicFormContext = React.createContext<FormContextType>({
//   register: (ref, options) => {},
//   fields: {},
//   setTouched: (name) => {},
// });



// export const useMagicForm = () => {

//   const fields = useRef<FieldsRefValue>({});
//   const [touched, _setTouched] = useState<{ [Key in string]: boolean}>({});
//   const [errors, setErrors] = useState<{[Key in string]: string}>({});

//   const register = (ref: FieldRef, options: FieldOptions = {}) => {
//     if (ref && ref.name) {
//       fields.current = {
//         ...fields.current,
//         [ref.name]: {
//           ...(fields.current[ref.name] ?? {}),
//           ref,
//           options
//         }
//       }
//     }
//   };

//   // const unregister = (name: string) => {
//   //   return fields.current = fields.current.fil4ter(r => r.ref.name !== name)
//   // }

//   const getFormValues = () => getFormStateFromFields(fields.current);

//   const validateForm = async () => {
//     // TODO: recive fields in order
//     const _fields = Object.keys(fields.current).map(key => {
//       const field = fields.current[key];
//       return field;
//     })
//     for (var a = 0; a < _fields.length; a++) {
//       const fieldEntry = _fields[a]
//       if (!fieldEntry.options.validate) {
//         return false;
//       }
//       const value = fieldEntry.ref.value;
//       const error = await fieldEntry.options.validate(value, getFormValues());
//       if (error) {
//         fieldEntry.ref.focus();
//         return false;
//       }
//     }
//     return true
//   }

//   const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const valid = await validateForm();
//     console.log("FORM VALID: ", valid);
//   }
//   const setError = (name: string, error: string) => {
//     setErrors(e => ({ ...e, [name]: error}))
//   }
//   const setTouched = (name: string) => {
//     console.log("touched");
//     _setTouched(t => ({ ...t, [name]: true }))
//     // fields.current = {
//     //   ...fields.current,
//     //   [name]: {
//     //     ...fields.current[name],
//     //     meta: {
//     //       ...fields.current[name].meta,
//     //       touched: true
//     //     }
//     //   }
//     // }
//   }
//   // const getTouched = (name: string) => {
//   //   return !!fields.current[name]?.meta.touched
//   // }
//   // const setError = (name: string) => (error: ErrorType) => {
//   //   fields.current = {
//   //     ...fields.current,
//   //     [name]: {
//   //       ...fields.current[name],
//   //       meta: {
//   //         ...fields.current[name].meta,
//   //         error
//   //       }
//   //     }
//   //   }
//   // }
  

//   return { fields: fields.current, register, getFormValues, onSubmit, setTouched, setError, touched, errors };
// };

// type MagicFormProps = { magicForm: ReturnType<typeof useMagicForm> } & React.HTMLProps<HTMLFormElement>;

// export const MagicForm: React.FC<MagicFormProps> = ({ magicForm, children }: MagicFormProps) => {
//   registerRender("MagicForm");
//   const formRef = useRef<HTMLFormElement>();
//   const onClick = () => { 

//   }
//   return (
//     <MagicFormContext.Provider value={magicForm}>
//       <form ref={formRef as any} onSubmit={magicForm.onSubmit}>{children}</form>
//       <button 
//         type="button" 
//         onClick={onClick}>Log form</button>
//     </MagicFormContext.Provider>
//   );
// };

// export type FieldSpreadProps = {
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
// };
