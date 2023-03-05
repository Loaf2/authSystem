import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function Login() {
  const navigate = useNavigate();

  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const [loginStatus, setLoginStatus] = useState(false);

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
      .then((response) => {
        if (response[0] === "Success") {
          setLoginStatus(true);
          console.log(response[2]);
          localStorage.setItem("token", response[2].token);
          navigate("/dashboard", { state: [response[1], response[2]] });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const userAuthenticated = () => {
    fetch("/isUserAuth", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res) => res.json())
      .then((res) => console.log(res))
      
  
  };

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
      {loginStatus && (
        <button onClick={userAuthenticated}>Check If authenticated</button>
      )}
    </div>
  );
}
