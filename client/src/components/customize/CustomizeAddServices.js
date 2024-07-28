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
                console.log('Success:', data);
                handleRemove(id);
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
            <Formik
                initialValues={{ name: '' }}
                validationSchema={validationSchema}
                onSubmit={values => handleSubmit(values)}
            >
                {({ errors, touched }) => (
                    <Form>
                        <label>name</label>
                        <Field id='name' name='name' placeholder='name' />
                        <button type="submit">Add</button>
                        {errors.name && touched.name ? (
                            <div className="error">{errors.name}</div>
                        ) : null}
                    </Form>
                )}
            </Formik>
            <button type="button" onClick={handleCancel}>cancel</button>
        </div>
    );
}

export default CustomizeAddServices;
