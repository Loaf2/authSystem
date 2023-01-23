import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const usernameRef = useRef("");
  const passwordRef = useRef("");

  function handleRegister() {
    if (usernameRef.current.value === "" || passwordRef.current.value === "")
      return;
    const username = usernameRef.current.value;
    const password = usernameRef.current.value;

    

    fetch("/register", {
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
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    navigate("/login");
  }

  return (
    <div className="App">
      <div className="registerDiv">
        <span id="registerSpan">Register</span>
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
        <button className="btn" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default App;
