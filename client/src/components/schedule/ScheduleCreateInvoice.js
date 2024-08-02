import '../../styles/schedule_box.css';
import { Formik, Form, Field, FieldArray } from 'formik';
import { useEffect, useState } from 'react';
import '../../styles/schedule_invoice.css'

function ScheduleCreateInvoice({ value, setForceRender, forceRender }) {
    const [serviceList, setServiceList] = useState([])
    const [clientList, setClientList] = useState([])
    const [initialValue, setInitialValue] = useState(1)

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        fetch(`http://localhost:5555/clients_by_user_id/${userId}`)
            .then(response => response.json())
            .then(client_by_user_data => {
                setClientList(client_by_user_data)
                setInitialValue(client_by_user_data[0][0].client_id)
            })
            .catch(error => console.error('Error fetching schedule:', error));
        fetch(`http://localhost:5555/services_by_user_id/${localStorage.getItem('userId')}`)
            .then(response => response.json())
            .then(data => {
                setServiceList(data)
            })
            .catch(error => console.error('Error fetching schedule:', error));
    }, [forceRender])



    const handleSubmit = async (values) => {
        console.log('client_id', values.client_id)
        try {
            let clientIdNum = Number(values.client_id)
            const invoiceResponse = await fetch(`http://localhost:5555/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ client_id: clientIdNum }),
            });
            const invoiceData = await invoiceResponse.json();
            const invoice_id = invoiceData.id;
            for (const service in values.services) {
                try {
                    let pricenum = Number(values.services[service].price) || 1
                    let serviceid = Number(values.services[service].service_id) || 1
                    const formData = {
                        scheduled_date: value.toISOString(),
                        paid_status: false,
                        price: pricenum,
                        service_id: serviceid,
                        invoice_id: invoice_id,
                    };
                    const postResponse = await fetch(`http://localhost:5555/invoice_services`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    const formResult = await postResponse.json()
                    console.log('Invoice_service submitted successfully', formResult)
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error('Error:', error);
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
        setForceRender(prev => !prev)
    };

    return (
        <div className="schedule_create_invoice_box" >
            <Formik
                enableReinitialize
                initialValues={{ services: [{ service_id: 1, price: 1 }], client_id: initialValue }}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form>
                        <div className='schedule_create_invoice_select_client'>
                            Client:
                            <Field
                                as="select"
                                name="client_id"
                            >
                                {clientList.map((client) => (
                                    <option key={client[1].id} value={client[1].id}>
                                        {client[1].name}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        <FieldArray name="services" >
                            {({ insert, remove, push }) => (
                                <>
                                    {values.services.length > 0 &&
                                        values.services.map((service, index) => (
                                            <div key={index}>
                                                <div className='schedule_create_invoice_select_service'>
                                                    Service:
                                                    <Field
                                                        as="select"
                                                        name={`services.${index}.service_id`}
                                                    >
                                                        {serviceList.map((service) => (
                                                            <option key={service.id} value={service.id}>
                                                                {service.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                </div>
                                                <div className='schedule_create_invoice_set_price'>
                                                    Price:
                                                    <Field
                                                        type="number"
                                                        name={`services.${index}.price`}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className='schedule_create_invoice_remove_service'
                                                >
                                                    Remove Service
                                                </button>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        onClick={() => push({ service_id: '', price: '' })}
                                        className='schedule_create_invoice_add_service'
                                    >
                                        Add Service
                                    </button>
                                </>
                            )}
                        </FieldArray>
                        <button type="submit" className='schedule_create_invoice_submit'>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ScheduleCreateInvoice