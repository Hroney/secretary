import React, { useEffect, useState } from "react";
import { useOutletContext } from 'react-router-dom';
import CustomizeAddServices from "./CustomizeAddServices";
import { v4 as uuidv4 } from 'uuid';

function CustomizeServices() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [buttonActivated, setButtonActivated] = useState(false);
    const [services, setServices] = useState([]);
    const [newServices, setNewServices] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetch(`http://localhost:5555/services`)
                .then(response => response.json())
                .then(data => {
                    setServices(data);
                })
                .catch(error => console.error('Error fetching services:', error));
        }
    }, [isLoggedIn, newServices]);

    const handleClick = () => {
        setButtonActivated(!buttonActivated);
        const id = uuidv4();
        setNewServices([...newServices, { id }]);
    };

    const handleRemove = (id) => {
        setNewServices(newServices.filter(service => service.id !== id));
    };

    return (
        <div className="service_container">
            <div className="service_list">
                {services.map(service => (
                    <div key={service.id} className="service_list_item">
                        {service.name}
                        {service.email}
                    </div>
                ))}
            </div>
            {newServices.map(service => (
                <CustomizeAddServices
                    key={service.id}
                    id={service.id}
                    handleRemove={handleRemove}
                />
            ))}
            <button onClick={handleClick}>
                add service
            </button>
        </div>
    );
}

export default CustomizeServices;
