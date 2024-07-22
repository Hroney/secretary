import React from 'react';
import { Formik, Form, Field } from 'formik';

const ActiveService = ({ activeService, onChangeServices, handlesubmit, createInvoiceBool }) => {

    return (
        <div className={(activeService && onChangeServices.length > 0 && !createInvoiceBool) ? 'active_service_box' : 'active_service_box_empty'}>
            {activeService && onChangeServices.length > 0 && !createInvoiceBool
                &&
                <>
                    <div className='active_service_box_service'>
                        {activeService[0].name}
                    </div>
                    <div className='active_service_box_client'>
                        {activeService[1].client.name}
                    </div>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            price: activeService[0].price,
                            paid_status: activeService[0].paid_status
                        }}
                        onSubmit={handlesubmit}
                    >
                        {({ values, setFieldValue }) => (
                            <Form>
                                <div className='active_service_box_price'>
                                    <p>
                                        Price:
                                        <Field
                                            type="number"
                                            name="price"
                                            placeholder={activeService[0].price}
                                            onWheel={(e) => {
                                                const newValue = values.price + (e.deltaY < 0 ? 1 : -1);
                                                setFieldValue('price', newValue);
                                            }}
                                        />
                                    </p>
                                    <p>
                                        Paid?
                                        <Field
                                            type="checkbox"
                                            name="paid_status"
                                            checked={values.paid_status}
                                            onChange={() => setFieldValue("paid_status", !values.paid_status)}
                                        />
                                    </p>
                                </div>
                                <div className='active_service_box_button_container'>
                                    <button type="submit" className='active_service_box_button'>
                                        Submit
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            }
        </div>
    );
};

export default ActiveService;
