import React, { useEffect, useState } from "react";
import NavBar from "./NavBar"
import { Outlet, useLocation, useNavigate, useRoutes } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   console.log(user)
  //   if (user) {
  //     setIsLoggedIn(true)
  //   } else {
  //     navigate('/login')
  //   }
  // }, [navigate])

  return (
    <div>
      <header><NavBar isLoggedIn={isLoggedIn} /></header>
      <main className="content">
        <Outlet context={[isLoggedIn, setIsLoggedIn]} />
      </main>
    </div>
  );
}

export default App;
