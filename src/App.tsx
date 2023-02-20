import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { FrontendApi, Configuration, Session, Identity } from "@ory/client";

// Get your Ory url from .env
// Or localhost for local development
const basePath = process.env.REACT_APP_ORY_URL || "http://localhost:4000";
const ory = new FrontendApi(
  new Configuration({
    basePath,
    baseOptions: {
      withCredentials: true,
    },
  })
);

function App() {
  const [session, setSession] = useState<Session | undefined>();
  const [logoutUrl, setLogoutUrl] = useState<string | undefined>();

  // Returns either the email or the username depending on the user's Identity Schema
  const getUserName = (identity: Identity | undefined) =>
    identity?.traits.email || identity?.traits.username;

  // Second, gather session data, if the user is not logged in, redirect to login
  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        // User has a session!
        console.log(data);
        setSession(data);
        ory.createBrowserLogoutFlow().then(({ data }) => {
          // Get also the logout url
          setLogoutUrl(data.logout_url);
        });
      })
      .catch((err) => {
        console.error(err);
        // Redirect to login page
        window.location.replace(`${basePath}/ui/login`);
      });
  }, []);

  if (!session) {
    // Still loading
    return <h1>Loading...</h1>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to Ory, {getUserName(session?.identity)}.</p>

        <a className="App-link" href={logoutUrl} rel="noopener noreferrer">
          Logout
        </a>
      </header>
    </div>
  );
}

export default App;
