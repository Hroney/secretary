import App from './components/App';
import Login from './components/Login'
import Home from './components/Home'
import Schedule from './components/Schedule'
import Invoices from './components/Invoices'
import { Navigate } from 'react-router-dom';
import Logout from './components/Logout';

const routes = [

    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Navigate to="/home" replace />
            },
            {
                path: 'home',
                element: <Home />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'schedule',
                element: <Schedule />,
            },
            {
                path: 'invoice',
                element: <Invoices />,
            },
            {
                path: 'logout',
                element: <Logout />,
            },
        ],
    },
];


export default routes;