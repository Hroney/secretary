import React from "react"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"

function CustomizeAddClient({ id, handleRemove }) {
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "Name must be at least 2 characters long")
            .required("Name is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
    });

    const handleSubmit = (values) => {
        console.log('values', values)
        fetch(`http://localhost:5555/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(response => response.json())
            .then(data => {
                let relation_data = { 'user_id': localStorage.getItem('userId'), 'client_id': data.id }
                fetch(`http://localhost:5555/post_client_user_relation/${relation_data.user_id}_${relation_data.client_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(relation_data),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('success', data)
                    })
                handleRemove(id);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleCancel = () => {
        handleRemove(id);
    };

    return (
        <div className="add_client_container">
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                }}
                validationSchema={validationSchema}
                onSubmit={values => handleSubmit(values)}
            >
                {({ errors, touched }) => (
                    <Form>
                        <label>name</label>
                        <Field id='name' name='name' placeholder='name' />
                        <label>email</label>
                        <Field id='email' name='email' placeholder='email' />
                        <button type="submit">Add</button>
                        {errors.name && touched.name ? (
                            <div className="error">{errors.name}</div>
                        ) : null}
                        {errors.email && touched.email ? (
                            <div className="error">{errors.email}</div>
                        ) : null}
                    </Form>
                )}
            </Formik>
            <button onClick={() => handleCancel()}>cancel</button>
        </div >
    )
}

export default CustomizeAddClient