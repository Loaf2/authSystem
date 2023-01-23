import React, { useEffect, useRef } from "react";

import "./App.css";

export default function Login() {
  const usernameRef = useRef("");
  const passwordRef = useRef("");

  function handleLogin() {
    if (usernameRef.current.value === "" || passwordRef.current.value === "")
      return;
      
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((response) => console.log(response))
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="App">
      <div className="loginDiv">
        <span id="registerSpan">Login</span>
        <input
          type="text"
          placeholder="Username"
          className="input"
          ref={usernameRef}
        />
        <input
          type="text"
          placeholder="Password"
          className="input"
          ref={passwordRef}
        />
        <button className="btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}