import App from './components/App';
import Login from './components/Login'
import Home from './components/Home'
import Schedule from './components/Schedule'
import Invoice from './components/Invoice'
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
                element: <Invoice />,
            },
            {
                path: 'logout',
                element: <Logout />,
            },
        ],
    },
];


export default routes;