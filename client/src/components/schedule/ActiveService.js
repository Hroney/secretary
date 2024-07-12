import React from 'react';
import { Formik, Form, Field } from 'formik';

const ActiveService = ({ activeService, onChangeServices, handlesubmit, createInvoiceBool }) => {

    return (
        <div className='active_service_box'>
            {activeService && onChangeServices.length > 0 && !createInvoiceBool
                &&
                <>
                    <div>
                        {activeService[0].service}
                    </div>
                    <div>
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
                                <div>
                                    Price:
                                    <Field
                                        type="number"
                                        name="price"
                                        placeholder={activeService[0].price}
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
                                    Submit
                                </button>
                            </Form>
                        )}
                    </Formik>
                </>
            }
        </div>
    );
};

export default ActiveService;
