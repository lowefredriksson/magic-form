import React from "react";
import { Value } from "./types";
import { Field } from "./API/Field";
import { Form } from "./API/Form";
import { FieldProps } from "./API/Field";
import { FormStatusError, FormStatusSuccess } from "./API/FormStatus";

function CustomField(props: FieldProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", paddingBottom: 15 }}
    >
      <Field {...props} />
    </div>
  );
}

function CustomFieldRow(props: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "row", paddingBottom: 15 }}>
      <Field {...props} />
    </div>
  );
}

function SubmitButton() {
  return (
    <button
      type="submit"
      style={{
        maxWidth: 100,
        alignSelf: "flex-end",
        color: "white",
        background: "black",
        border: "none",
        padding: 10,
        fontWeight: "bold",
      }}
    >
      Submit
    </button>
  );
}

function validatePassword(password: Value) {
  const p = password as string;
  if (p.length < 8) {
    return "Password should contain at least 8 character";
  }
  return undefined;
}

function validateRepeatPassword(
  repeatPassword: Value,
  values: Map<String, Value>
) {
  if (repeatPassword !== values.get("password")) {
    return "Passwords does not match";
  }
  return undefined;
}

function validateTermsAndServices(tas: Value) {
  console.log("tas", tas);
  if (tas) {
    return undefined;
  }
  return "Terms and services needs to be accepted before you register";
}

async function register(credentials: { username: string; password: string }) {
  throw new Error("");
}

async function onSubmit(values: { username: string; password: string }) {
  try {
    await register(values);
    return {
      message: "Successfully logged in",
      status: "success",
    } as const;
  } catch (e) {
    return {
      message: "Server could not be reached",
      status: "error",
    } as const;
  }
}

export function Presentation() {
  return (
    <div>
      <Form
        onSubmit={(values: Map<string, Value>) => {
          const username = (values.get("username") as string | undefined) ?? "";
          const password = (values.get("password") as string | undefined) ?? "";
          return onSubmit({ username, password });
        }}
        style={{
          flexDirection: "column",
          display: "flex",
          margin: 20,
          maxWidth: "400px",
        }}
      >
        <h1>Registration</h1>
        <FormStatusError
          element={<div style={{ color: "red", marginBottom: 20 }} />}
        />
        <FormStatusSuccess />
        <CustomField
          label="Username"
          name="username"
          type="username"
          required
        />
        <CustomField
          label="Password"
          name="password"
          type="password"
          validate={validatePassword}
        />
        <CustomField
          label="Confirm Password"
          name="password_confirm"
          type="password"
          validate={validateRepeatPassword}
        />
        <CustomField name="country" label="Country" as="select" required>
          <option value="Sweden" label="Sweden" />
          <option value="Denmark" label="Denmark" />
          <option value="Netherlands" label="Neatherlands" />
        </CustomField>
        <CustomFieldRow name="Subsribe to newsletter" type="checkbox" />
        <CustomFieldRow
          name="Terms and services"
          type="checkbox"
          validate={validateTermsAndServices}
        />
        <SubmitButton />
      </Form>
    </div>
  );
}

// const CustomLabel = ({
//   htmlFor,
//   labelText,
// }: {
//   htmlFor: string;
//   labelText: string;
// }) => {
//   return <div style={{ color: "red" }}>{labelText}</div>;
// };

// const RadioGroup = () => {
//   const value = useValue("volvo");
//   const saabValue = useValue("saab");
//   useEffect(() => {
//     console.log("radiogroup volvo:", value, "saabValue: ", saabValue);
//   }, [value, saabValue]);
//   return (
//     <fieldset>
//       <legend>Cars</legend>
//       <Field name="volvo" type="checkbox" />
//       <Field name="saab" type="checkbox" />
//     </fieldset>
//   );
// };

// export const Lowely2 = () => {
//   const [error, setError] = useState<string | null>(null);
//   return (
//     <form style={{ flexDirection: "column", display: "flex" }}>
//       <fieldset>
//         <legend>Cars</legend>
//         <input
//           id="checkbox-volvo"
//           type="checkbox"
//           name="car"
//           onChange={(e) => {
//             console.log(
//               "checkbox-volvo: onChange",
//               e.target.value,
//               e.target.checked
//             );
//           }}
//         />
//         <label htmlFor="checkbox-volvo">Volvo</label>
//         <input
//           id="checkbox-saab"
//           type="checkbox"
//           name="car"
//           onChange={(e) => {
//             console.log(
//               "checkbox-saab: onChange",
//               e.target.value,
//               e.target.checked
//             );
//           }}
//         />
//         <label htmlFor="checkbox-saab">Saab</label>
//       </fieldset>
//       <fieldset>
//         <legend>Colors</legend>
//         <input
//           multiple
//           id="radio-color-blue"
//           name="radio-color"
//           type="radio"
//           value="blue"
//           onChange={(e) => {
//             console.log(
//               "radio-color-blue: onChange",
//               e.target.value,
//               e.target.checked
//             );
//           }}
//         />
//         <label htmlFor="radio-color-blue">Blue</label>
//         <input
//           multiple
//           id="radio-color-red"
//           name="radio-color"
//           type="radio"
//           value="red"
//           onChange={(e) => {
//             console.log(
//               "radio-color-red: onChange",
//               e.target.value,
//               e.target.checked
//             );
//           }}
//         />
//         <label htmlFor="radio-color-red">Blue</label>
//       </fieldset>
//       <label htmlFor="name">
//         Name
//         <span id="name-error" aria-live="assertive">
//           {error}
//         </span>
//       </label>
//       <input
//         id="name"
//         aria-describedby="name-error"
//         aria-invalid={error !== null}
//         onBlur={() => {
//           setError("Fel namn");
//         }}
//       />
//       <label htmlFor="password">Lösenord</label>
//       <input id="password" />
//     </form>
//   );
// };

// const LowelyInner: () => JSX.Element = () => {
//   const [emailField] = useField({
//     label: "Email",
//     name: "email",
//     inputControlProps: {
//       type: "email",
//     },
//   });
//   const [passwordField] = useField({
//     label: "Lösenord",
//     name: "password",
//     validate: (value: Value) =>
//       (value as string).length < 4
//         ? "Should be at least 4 characters"
//         : undefined,
//     inputControlProps: {
//       type: "password",
//     },
//   });
//   const [repeatPasswordField] = useField({
//     inputControlProps: {
//       type: "password",
//     },
//     name: "confirm password",
//     label: "Repetera Lösenord",
//     validate: (value: Value, values) => {
//       if ((value as string).length < 4) {
//         return "Should be at least 4 characters";
//       }
//       if (value !== values.get("password")) {
//         return "Should match password";
//       }
//       return undefined;
//     },
//   });
//   const [_, { InputControl, labelElement }] = useField({
//     name: "color",
//     label: "Color",
//     as: "select",
//   });
//   const [isCompanyField] = useField({
//     name: "isCompany",
//     label: "Company",
//     as: "input",
//     inputControlProps: {
//       type: "checkbox",
//     },
//   });
//   const [messageField] = useField({
//     name: "message",
//     label: "Message",
//     as: "textarea",
//   });

//   return (
//     <>
//       {emailField}
//       <fieldset>
//         <legend>Create Password</legend>
//         {passwordField}
//         {repeatPasswordField}
//       </fieldset>
//       {labelElement}
//       <InputControl>
//         <option id="hej" value="hej" label="hej"></option>
//         <option id="hej2" value="hej2" label="hej2"></option>
//       </InputControl>
//       {isCompanyField}
//       {messageField}
//       <input type="submit" value="Sign up" />
//     </>
//   );
// };

// export const Lowely6 = () => {
//   const count = useRenderCounter();
//   return (
//     <div
//       style={{
//         display: "flex",
//         width: "100vw",
//         height: "100vh",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//       }}
//     >
//       <Form
//         style={{
//           width: "400px",
//           display: "flex",
//           alignItems: "stretch",
//           flexDirection: "column",
//         }}
//         onSubmit={(values) => {
//           console.log("values", values);
//           return;
//         }}
//       >
//         <FieldLabel name="email">Email</FieldLabel>
//         <FieldDescription name="email">* Obligatorisk</FieldDescription>
//         <FieldError
//           name="email"
//           Component={(props) => (
//             <div
//               style={{ color: "red", backgroundColor: "green" }}
//               {...props}
//             />
//           )}
//         />
//         <FieldInputControl
//           name="email"
//           type="email"
//           validate={(value) => {
//             console.log("Validate value:", value);
//             if ((value as string).length > 4) {
//               return "Max 4 chars allowed";
//             }
//             return undefined;
//           }}
//         />
//         <fieldset>
//           <legend>Create Password</legend>
//           <Field
//             type="password"
//             name="password"
//             label="Lösenord"
//             required
//             validate={(value: Value) =>
//               (value as string).length < 4
//                 ? "Should be at least 4 characters"
//                 : undefined
//             }
//           />
//           <Field
//             type="password"
//             name="confirm password"
//             label="Repetera Lösenord"
//             required
//             validate={(value: Value, values) => {
//               if ((value as string).length < 4) {
//                 return "Should be at least 4 characters";
//               }
//               if (value !== values.get("password")) {
//                 return "Should match password";
//               }
//               return undefined;
//             }}
//           />
//         </fieldset>
//         <Field as="select" name="colour">
//           <option value="red" label="red" />
//           <option value="blue" label="blue" />
//         </Field>
//         <Field
//           type="checkbox"
//           name="isCompany"
//           description="Handlar du med ditt företag?"
//         />
//         <input type="submit" value="Sign up" />
//       </Form>
//       Renders {count}
//     </div>
//   );
// };

// export function Lowely() {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "flex-start",
//       }}
//     >
//       <Lowely1></Lowely1>
//       <div style={{ width: 20 }}></div>
//       <Lowely22></Lowely22>
//     </div>
//   );
// }

// export const Lowely22 = () => {
//   return (
//     <Form
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         position: "relative",
//         margin: "40px",
//         maxWidth: "400px",
//       }}
//     >
//       <div style={{ position: "absolute", right: 0, top: 0 }}>( 1 )</div>
//       <h1>Register</h1>
//       <div
//         style={{
//           marginBottom: "15px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Field
//           label="Username"
//           description="Your username is visible to everyone and can only be set once"
//           required
//           name="username"
//         />
//       </div>
//       <Field
//         label="Password"
//         name="password"
//         type="password"
//         validate={() => "Password should contain at least 8 characters"}
//       />
//       <button
//         type="submit"
//         style={{
//           fontSize: 15,
//           backgroundColor: "black",
//           color: "white",
//           borderWidth: 0,
//           marginTop: 20,
//           padding: 10,
//         }}
//       >
//         Submit
//       </button>
//     </Form>
//   );
// };

// export const Lowely1 = () => {
//   return (
//     <Form
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         position: "relative",
//         margin: "40px",
//         maxWidth: "400px",
//       }}
//     >
//       <div style={{ position: "absolute", right: 0, top: 0 }}>( 1 )</div>
//       <h1>Register</h1>
//       <div
//         style={{
//           flexDirection: "row",
//           display: "flex",
//           position: "relative",
//           marginBottom: 20,
//         }}
//       >
//         <div style={{ position: "absolute", right: -40, top: 10 }}>( 6 )</div>
//         <AlertCircle size={30} color="red" />
//         <h4 style={{ margin: 0, marginLeft: 10 }}>
//           Registration failed. There seems to be a problem with your internet
//           connection.
//         </h4>
//       </div>
//       <div
//         style={{
//           marginBottom: "15px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Field
//           label="Username"
//           description="Your username is visible to everyone and can only be set once"
//           required
//           name="username"
//         />
//       </div>
//       <Field label="Password" name="password" type="password" />
//       <button
//         type="submit"
//         style={{
//           fontSize: 15,
//           backgroundColor: "black",
//           color: "white",
//           borderWidth: 0,
//           marginTop: 20,
//           padding: 10,
//         }}
//       >
//         Submit
//       </button>
//     </Form>
//   );
// };

// export const HTMLExample = () => {
//   return (
//     <form
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         width: "300px",
//         margin: "80px",
//       }}
//       onSubmit={() => {}}
//     >
//       <div
//         style={{
//           marginBottom: "8px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <label htmlFor="name" style={{ marginBottom: "2px" }}>
//           Name:
//         </label>
//         <input type="text" id="name" />
//       </div>
//       <div
//         style={{
//           marginBottom: "8px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <label htmlFor="name" style={{ marginBottom: "2px" }}>
//           Email:
//         </label>
//         <input type="email" id="email" />
//       </div>
//       <div
//         style={{
//           marginBottom: "8px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <label htmlFor="resume" style={{ marginBottom: "2px" }}>
//           Resume:
//         </label>
//         <input type="file" id="resume" />
//       </div>
//       <input style={{ marginTop: "8px" }} type="submit" value="Send" />
//     </form>
//   );
// };
