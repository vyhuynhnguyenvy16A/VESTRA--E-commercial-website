import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div>{children}</div>
    </div>
  );
}
