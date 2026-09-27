import React from "react";
import "../App.css";

export default function Landing() {
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Anil Video Meet</h2>
        </div>
        <div className="navlist">
          <p>Join as Guest</p>
          <p>Register</p>
          <p role="button">Login</p>
        </div>
      </nav>
      <div className="landingMainContainer">
        <div>
          <h1>Connect with your loved once</h1>
          <p>Cover a distance by Anil Video Meet </p>
          <div role="button"> Get Started</div>
        </div>
        <div>
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  );
}
