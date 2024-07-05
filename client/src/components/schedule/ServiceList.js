import React from 'react';
import ScheduleServiceCard from './ScheduleServiceCard';

const ServiceList = ({ onChangeServices, setActiveService, setCreateInvoiceBool }) => {
    return (
        <div className='services_box'>
            {onChangeServices.map((service, index) => (
                <ScheduleServiceCard
                    service={service}
                    key={index}
                    setActiveService={setActiveService}
                    setCreateInvoiceBool={setCreateInvoiceBool}
                />
            ))}
            <button className='services_box_button' onClick={() => setCreateInvoiceBool(true)}>Create Invoice</button>
        </div>
    );
};

export default ServiceList;
