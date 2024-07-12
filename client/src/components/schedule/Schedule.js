import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import redirectCheck from '../../helpers/redirectCheck';
import CalendarComponent from './CalendarComponent';
import ServiceList from './ServiceList';
import ActiveService from './ActiveService';
import isSameDay from '../../helpers/isSameDay';
import ScheduleCreateInvoice from '../schedule/ScheduleCreateInvoice'
import '../../styles/calendar.css';
import '../../styles/schedule_box.css';

function Schedule() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [schedule, setSchedule] = useState([]);
    const [value, setValue] = useState(new Date());
    const [onChangeServices, setOnChangeServices] = useState([]);
    const [activeService, setActiveService] = useState(null);
    const [forceRender, setForceRender] = useState(false);
    const [createInvoiceBool, setCreateInvoiceBool] = useState(false)

    useEffect(() => {
        if (isLoggedIn) {
            const userId = localStorage.getItem('userId');
            fetch(`http://localhost:5555/schedule/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setSchedule(data);
                    const filtereditems = data.filter(item =>
                        isSameDay(new Date(item.scheduled_date), value)
                    );
                    setOnChangeServices([...filtereditems])
                })
                .catch(error => console.error('Error fetching schedule:', error));
        }
    }, [isLoggedIn, forceRender, value]);

    const onChange = (nextValue) => {
        setValue(nextValue);
        const filtereditems = schedule.filter(item =>
            isSameDay(new Date(item.scheduled_date), nextValue)
        );
        setOnChangeServices([...filtereditems]);
        setCreateInvoiceBool(false)
        setActiveService(null)
    };

    const handlesubmit = (values) => {
        const serviceId = activeService[1].invoice_service_id;

        fetch(`http://localhost:5555/invoice_service/${serviceId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(response => response.json())
            .then(data => {
                onChangeServices.forEach((ocs) => {
                    if (ocs.invoice_service_id === data.id) {
                        ocs.client_service_list.forEach((csl) => {
                            if (csl.id === data.id) {
                                csl.price = data.price;
                                csl.paid_status = data.paid_status;
                                activeService[1].price = data.price;
                                activeService[1].paid_status = data.paid_status;
                            }
                        });
                    }
                });
                setForceRender(prev => !prev);
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            {!isLoggedIn ? redirectCheck(isLoggedIn) :
                <div className='schedule_box'>
                    <CalendarComponent
                        value={value}
                        onChange={onChange}
                        schedule={schedule}
                    />
                    <ServiceList
                        onChangeServices={onChangeServices}
                        setActiveService={setActiveService}
                        setCreateInvoiceBool={setCreateInvoiceBool}
                    />

                    {createInvoiceBool ?
                        <ScheduleCreateInvoice
                            value={value}
                            forceRender={forceRender}
                            setForceRender={setForceRender}
                            onChange={onChange}
                        /> :
                        <ActiveService
                            activeService={activeService}
                            onChangeServices={onChangeServices}
                            handlesubmit={handlesubmit}
                            createInvoiceBool={createInvoiceBool}
                        />}
                </div>
            }
        </div>
    );
}

export default Schedule;
