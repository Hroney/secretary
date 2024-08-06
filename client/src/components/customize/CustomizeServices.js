import React, { useEffect, useState } from "react";
import { useOutletContext } from 'react-router-dom';
import CustomizeAddServices from "./CustomizeAddServices";
import { v4 as uuidv4 } from 'uuid';
import "../../styles/customizeservices.css";
import CustomizeEditServices from "./CustomizeEditServices";

function CustomizeServices() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [buttonActivated, setButtonActivated] = useState(false);
    const [services, setServices] = useState([]);
    const [newServices, setNewServices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [showExistingServices, setShowExistingServices] = useState(false);
    const [update, setUpdate] = useState(true);
    const [expand, setExpand] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            fetch(`http://localhost:5555/services_by_user_id/${localStorage.getItem('userId')}`)
                .then(response => response.json())
                .then(data => {
                    setServices(data);
                })
                .catch(error => console.error('Error fetching services:', error));

            fetch(`http://localhost:5555/services`)
                .then(response => response.json())
                .then(data => {
                    setAllServices(data);
                })
                .catch(error => console.error('Error fetching all services:', error));
        }
    }, [isLoggedIn, newServices, update]);

    const handleClick = () => {
        setButtonActivated(!buttonActivated);
        const id = uuidv4();
        setNewServices([...newServices, { id }]);
    };

    const handleRemove = (id) => {
        setNewServices(newServices.filter(service => service.id !== id));
    };

    const handleExistingClick = () => {
        setShowExistingServices(!showExistingServices);
    };

    const handleAddExistingService = (serviceId) => {
        fetch(`http://localhost:5555/services_by_user_id/${localStorage.getItem('userId')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: serviceId
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Service added:', data);
                setUpdate(!update);
                setShowExistingServices(false);
            })
            .catch(error => console.error('Error adding service:', error));
    };

    return (
        <div className="service_box">
            <div className="service_expander" onClick={() => setExpand(!expand)}>
                {expand ? "Services (Collapse)" : "Services (Click to expand)"}
            </div>
            <div className={`service_container ${expand ? "expand" : null}`}>
                <div className="service_list">
                    {services.map(service => (
                        <CustomizeEditServices
                            key={service.id}
                            service={service}
                            setUpdate={setUpdate}
                            update={update}
                        />
                    ))}
                </div>
                {newServices.map(service => (
                    <CustomizeAddServices
                        key={service.id}
                        id={service.id}
                        handleRemove={handleRemove}
                    />
                ))}
                <button onClick={handleClick} className="service_container_button">
                    Add New Service
                </button>
                <button onClick={handleExistingClick} className="service_container_button">
                    Add Existing Service
                </button>
                {showExistingServices && (
                    <div className="existing_services_list">
                        {allServices.map(service => (
                            <div key={service.id} className="existing_service_item">
                                <span>{service.name}</span>
                                <button
                                    onClick={() => handleAddExistingService(service.id)}
                                    className="service_container_button"
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomizeServices;
