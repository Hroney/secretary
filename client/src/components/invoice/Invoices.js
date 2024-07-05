import { useOutletContext } from "react-router-dom";
import redirectCheck from "../../helpers/redirectCheck";
import { useEffect, useState } from "react";
import ClientCard from './ClientCard';

function Invoices() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [clientList, setClientList] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            const fetchClients = async () => {
                try {
                    const response = await fetch(`http://localhost:5555/clients_by_user_id/${localStorage.getItem('userId')}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setClientList(data);
                    } else {
                        console.error('Error:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            fetchClients();
        }
    }, [isLoggedIn]);

    return (
        <div>
            {!isLoggedIn ? redirectCheck(isLoggedIn) :
                <div>
                    {clientList.map(client => (
                        <ClientCard key={client.id} client={client} />
                    ))}
                </div>
            }
        </div>
    );
}

export default Invoices;
