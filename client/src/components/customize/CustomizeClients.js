import React, { useEffect, useState } from "react"
import { useOutletContext } from 'react-router-dom';
import CustomizeAddClient from "./CustomizeAddClient";
import { v4 as uuidv4 } from 'uuid';

function CustomizeClient() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [buttonActivated, setButtonActivated] = useState(false);
    const [clients, setClients] = useState([]);
    const [newClients, setNewClients] = useState([])

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
                        setClients(data);
                    } else {
                        console.error('Error:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            fetchClients();

        }
    }, [isLoggedIn, newClients]);

    const handleClick = () => {
        setButtonActivated(!buttonActivated);
        const id = uuidv4();
        setNewClients([...newClients, { id }]);
    };

    const handleRemove = (id) => {
        setNewClients(newClients.filter(client => client.id !== id));
    };

    return (
        <div className="client_container">
            <div className="client_list">
                {clients.map(client => (
                    <div key={client[1].id} className="client_list_item">
                        {client[1].name}
                        {client[1].email}
                    </div>
                ))}
            </div>
            {newClients.map(service => (
                <CustomizeAddClient
                    key={service.id}
                    id={service.id}
                    handleRemove={handleRemove}
                />
            ))}
            <button onClick={() => handleClick()}>
                add client
            </button>
        </div >
    )
}

export default CustomizeClient