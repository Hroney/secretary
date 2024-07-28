import App from './components/main/App';
import Login from './components/main/Login'
import Home from './components/Home'
import Schedule from './components/schedule/Schedule'
import Invoices from './components/invoice/Invoices'
import { Navigate } from 'react-router-dom';
import Logout from './components/main/Logout';
import Customize from './components/customize/Customize';

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
                path: 'customize',
                element: <Customize />,
            },
            {
                path: 'logout',
                element: <Logout />,
            },
        ],
    },
];


export default routes;