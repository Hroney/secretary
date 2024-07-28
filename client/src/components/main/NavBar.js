import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/navbar.css'



function NavBar({ isLoggedIn }) {

    return (
        <nav className="nav-bar">
            {!isLoggedIn && (
                <ul>
                    <li>
                        <NavLink to="/home" className="nav-link" > Home </NavLink>
                    </li>
                    <li>
                        <NavLink to="/login" className="nav-link" > Login </NavLink>
                    </li>
                </ul>
            )}
            {isLoggedIn && (
                <ul>
                    <li>
                        <NavLink to='/schedule' className='nav-link'>Schedule</NavLink>
                    </li>
                    <li>
                        <NavLink to='/invoice' className='nav-link'>Invoices</NavLink>
                    </li>
                    <li>
                        <NavLink to='/customize' className='nav-link'>Customize</NavLink>
                    </li>
                    <li>
                        <NavLink to='/logout' className='nav-link'>Logout</NavLink>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default NavBar