import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import redirectCheck from '../helpers/redirectCheck';
import Calendar from 'react-calendar';
import { startOfDay, differenceInCalendarDays, addMonths, subYears } from 'date-fns';
import '../styles/calendar.css'
import '../styles/schedule_box.css'
import ScheduleServiceCard from './ScheduleServiceCard';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const isSameDay = (a, b) => {
    return differenceInCalendarDays(startOfDay(a), startOfDay(b)) === 0;
};

function Schedule() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [schedule, setSchedule] = useState([]);
    const [value, setValue] = useState(new Date());
    const [onChangeServices, setOnChangeServices] = useState([]);
    const [activeService, setActiveService] = useState(null);
    const [forceRender, setForceRender] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            const userId = localStorage.getItem('userId');
            fetch(`http://localhost:5555/schedule/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setSchedule(data);
                })
                .catch(error => console.error('Error fetching schedule:', error));
        }
    }, [isLoggedIn]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const scheduledItems = schedule.filter(item =>
                isSameDay(new Date(item.scheduled_date), date)
            );
            if (scheduledItems.length > 0) {
                return (
                    <div style={{ color: "green" }}>
                        ✓
                    </div>
                );
            } else {
                return (
                    <div style={{ color: "transparent" }}>
                        x
                    </div>
                );
            }
        }
    };

    const onChange = (nextValue) => {
        setValue(nextValue);
        const scheduledItems = schedule.filter(item =>
            isSameDay(new Date(item.scheduled_date), nextValue)
        );
        setOnChangeServices(scheduledItems);
    };

    const minDate = subYears(new Date(), 1);
    const maxDate = addMonths(new Date(), 1);

    const handlesubmit = (values) => {
        const serviceId = activeService[0].invoice_service_id;
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
                                csl.price = data.price
                                csl.paid_status = data.paid_status
                                activeService[1][0].price = data.price
                                activeService[1][0].paid_status = data.paid_status
                            }
                        })
                    }
                })
                setForceRender(prev => !prev);
                console.log('Success:', data);
                console.log('onChangeServices', onChangeServices)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            {!isLoggedIn ? redirectCheck(isLoggedIn) :
                <div className='schedule_box'>
                    <div className='calendar_box'>
                        <Calendar
                            onChange={onChange}
                            value={value}
                            tileContent={tileContent}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </div>
                    <div className='services_box'>
                        {onChangeServices.map((service, index) => (
                            <ScheduleServiceCard
                                service={service}
                                key={index}
                                setActiveService={setActiveService}
                            />
                        ))}
                        <button className='services_box_button' onClick={() => console.log("hello")}>Create Invoice</button>
                    </div>
                    <div className='active_service_box'>
                        {activeService && onChangeServices.length > 0 &&
                            <>
                                <div>
                                    {activeService[0].service}
                                </div>
                                <div>
                                    {activeService[0].client.name}
                                </div>
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        price: activeService[1][0].price,
                                        paid_status: activeService[1][0].paid_status
                                    }}
                                    onSubmit={handlesubmit}
                                >
                                    {({ values, setFieldValue }) => (
                                        <Form>
                                            <div>
                                                Price:
                                                <Field
                                                    type="number"
                                                    name="price"
                                                    placeholder={activeService[1][0].price}
                                                    style={{ width: '60px', textAlign: 'right' }}
                                                    onWheel={(e) => {
                                                        const newValue = values.price + (e.deltaY < 0 ? 1 : -1);
                                                        setFieldValue('price', newValue);
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                Paid?
                                                <Field
                                                    type="checkbox"
                                                    name="paid_status"
                                                    checked={values.paid_status}
                                                    onChange={() => setFieldValue("paid_status", !values.paid_status)}
                                                />
                                            </div>
                                            <button type="submit">
                                                submit
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Schedule;
