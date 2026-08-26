import React, { useState } from "react";
import Header from "../components/common/Header/index.js";
import SignupForm from "../components/SignupComponents/SignupForm/index.js";
import LoginForm from "../components/SignupComponents/LoginForm/index.js";

function SignUpPage() {
  const [flag, setFlag] = useState(false);

  return (
    <>
      <Header />
     <div className="page">
        <div className="page-card">
        {!flag ? <h1>Signup</h1> : <h1>Login</h1>}
        {!flag ? <SignupForm setFlag={setFlag} /> : <LoginForm />}
        {!flag ? (
          <p style={{ cursor: "pointer" }} onClick={() => setFlag(!flag)}>
            Already have an Account? Click here to Login.
          </p>
        ) : (
          <p style={{ cursor: "pointer" }} onClick={() => setFlag(!flag)}>
            Don't have an account? Click here to signup.
          </p>
        )}
      </div>
    </div>
        </>

  );
}

export default SignUpPage;
