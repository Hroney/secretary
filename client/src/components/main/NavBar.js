import React from 'react';
import { NavLink } from 'react-router-dom';



function NavBar({ isLoggedIn }) {

    return (
        <nav className="nav-bar">
            {!isLoggedIn && (
                <>
                    <NavLink to="/home" className="nav-link" > Home </NavLink>
                    <NavLink to="/login" className="nav-link" > Login </NavLink>
                </>
            )}
            {isLoggedIn && (
                <>
                    <NavLink to='/schedule' className='nav-link'>Schedule</NavLink>
                    <NavLink to='/invoice' className='nav-link'>Invoices</NavLink>
                    <NavLink to='/logout' className='nav-link'>Logout</NavLink>
                </>
            )}
        </nav>
    )
}

export default NavBar