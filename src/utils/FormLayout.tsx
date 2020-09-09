import React from "react";

export const FormLayout: React.FC = ({ children }) => {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        margin: 100,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        display: "flex",
        width: 500,
        borderColor: "#333",
        borderStyle: "solid",
        borderWidth: 1,
        alignSelf: "center",
      }}
    >
      {children}
    </div>
  );
};
