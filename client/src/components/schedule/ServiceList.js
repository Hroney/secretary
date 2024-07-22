import React from 'react';
import ScheduleServiceCard from './ScheduleServiceCard';

const ServiceList = ({ onChangeServices, setActiveService, setCreateInvoiceBool }) => {

    return (
        <div className='services_box'>
            {onChangeServices.map((service) => (
                <ScheduleServiceCard
                    key={service.invoice_service_id}
                    service={service}
                    setActiveService={setActiveService}
                    setCreateInvoiceBool={setCreateInvoiceBool}
                />
            ))}
            <button className='services_box_button' onClick={() => setCreateInvoiceBool(true)}>+</button>
        </div>
    );
};

export default ServiceList;
