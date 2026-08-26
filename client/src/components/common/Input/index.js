// import React from "react";
// import "./styles.css";
// function InputComponent({ type, state, setState, placeholder, required }) {
//   return (
//     <input
//       type={type}
//       value={state}
//       onChange={(e) => setState(e.target.value)}
//       placeholder={placeholder}
//       required={required}
//       className="custom-input"
//     />
//   );
// }

// export default InputComponent;

import React, { useState } from "react";
import "./styles.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function InputComponent({
  type = "text",
  state,
  setState,
  placeholder,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-wrapper">
      <input
        type={inputType}
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="custom-input"
      />

      {type === "password" && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}
    </div>
  );
}

export default InputComponent;
