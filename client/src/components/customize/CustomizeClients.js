import React, { useEffect, useState } from "react"
import { useOutletContext } from 'react-router-dom';
import CustomizeAddClient from "./CustomizeAddClient";
import { v4 as uuidv4 } from 'uuid';
import CustomizeEditClients from "./CustomizeEditClients"
import "../../styles/customizeclients.css"

function CustomizeClient() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [buttonActivated, setButtonActivated] = useState(false);
    const [clients, setClients] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [newClients, setNewClients] = useState([])
    const [showExistingClients, setShowExistingClients] = useState(false);
    const [update, setUpdate] = useState(false)
    const [expand, setExpand] = useState(false)

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

            const fetchAllClients = async () => {
                try {
                    const response = await fetch(`http://localhost:5555/clients`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setAllClients(data);
                    } else {
                        console.error('Error:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            fetchClients();
            fetchAllClients();
        }
    }, [isLoggedIn, newClients, update]);

    const handleClick = () => {
        setButtonActivated(!buttonActivated);
        const id = uuidv4();
        setNewClients([...newClients, { id }]);
    };

    const handleRemove = (id) => {
        setNewClients(newClients.filter(client => client.id !== id));
    };

    const handleExistingClick = () => {
        setShowExistingClients(!showExistingClients);
    };

    const handleAddExistingClient = (clientId) => {
        fetch(`http://localhost:5555/clients_by_user_id/${localStorage.getItem('userId')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientId)
        })
            .then(response => response.json())
            .then(data => {
                setUpdate(!update);
                setShowExistingClients(false);
            })
            .catch(error => console.error('Error adding service:', error));
    };

    return (
        <div className="client_box">
            <div className="client_expander" onClick={() => setExpand(!expand)}>
                {expand ? "Clients (Collapse)" : "Clients (Click to expand)"}
            </div>
            <div className={`client_container ${expand ? "expand" : null}`}>
                <div className="client_list">
                    {clients.map(client => (
                        <>
                            <CustomizeEditClients
                                key={client[0].id}
                                client={client}
                                setUpdate={setUpdate}
                                update={update}
                            />
                            {/* <div key={client[1].id} className="client_list_item">
                                {client[1].name}
                                {client[1].email}
                            </div> */}
                        </>
                    ))}
                </div>
                {newClients.map(service => (
                    <CustomizeAddClient
                        key={service.id}
                        id={service.id}
                        handleRemove={handleRemove}
                    />
                ))}
                <button onClick={handleClick}>
                    Add New Client
                </button>
                <button onClick={handleExistingClick}>
                    Add Existing Client
                </button>
                {showExistingClients && (
                    <div className="existing_services_list">
                        {allClients.map(client => (
                            <div key={client.id} className="existing_service_item">
                                <span>{client.name}</span>
                                <button
                                    onClick={() => handleAddExistingClient(client.id)}
                                    className="service_container_button"
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div >
        </div>
    )
}

export default CustomizeClient