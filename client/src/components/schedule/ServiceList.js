import React, { useEffect } from 'react';
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
            <button className='services_box_button' onClick={() => setCreateInvoiceBool(true)}>Create Invoice</button>
        </div>
    );
};

export default ServiceList;
