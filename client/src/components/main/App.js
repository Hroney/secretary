import React, { useEffect, useState } from "react";
import NavBar from "./NavBar"
import { Outlet, useLocation, useNavigate, useRoutes } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <header><NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></header>
      <main className="content">
        <Outlet context={[isLoggedIn, setIsLoggedIn]} />
      </main>
    </div>
  );
}

export default App;
