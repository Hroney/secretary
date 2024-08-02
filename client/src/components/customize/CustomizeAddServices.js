import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

function CustomizeAddServices({ id, handleRemove }) {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "Name must be at least 2 characters long")
            .required("Name is required"),
    })


    const handleSubmit = (values) => {
        fetch(`http://localhost:5555/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(response => response.json())
            .then(data => {
                let service_id = { 'service_id': data.id }
                fetch(`http://localhost:5555/services_by_user_id/${localStorage.getItem('userId')}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(service_id),
                })
                    .then(response => response.json())
                    .then(data => handleRemove(id))
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleCancel = () => {
        handleRemove(id);
    };

    return (
        <div className="add_service_container">
            <button type="button" onClick={handleCancel} className="service_container_button">Cancel</button>
            <Formik
                initialValues={{ name: '' }}
                validationSchema={validationSchema}
                onSubmit={values => handleSubmit(values)}
            >
                {({ errors, touched }) => (
                    <>
                        <Form>
                            <Field id='name' name='name' placeholder='name' />
                            <button type="submit" className="service_container_button">Add</button>
                        </Form>
                        {errors.name && touched.name ? (
                            <div className="error">{errors.name}</div>
                        ) : null}
                    </>
                )}
            </Formik>
        </div>
    );
}

export default CustomizeAddServices;
