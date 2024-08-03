import { Formik, Form, Field } from "formik"
import { useState } from "react"

const CustomizeEditServices = ({ service, setUpdate, update }) => {
    const [expand, setExpand] = useState(false)

    const handleSubmit = (values, service) => {
        fetch(`http://localhost:5555/services_by_user_id/${service.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(response => response.json())
            .then(data => {
                setUpdate(!update)
                console.log('Success:', data);
            });
    }

    const handleDelete = () => {
        fetch(`http://localhost:5555/services_by_user_id/${localStorage.getItem('userId')}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        })
            .then(response => response.json())
            .then(data => {
                setUpdate(!update)
                console.log('Success - deleted: ', data);
            });
    }

    return (

        <div key={service.id} className="service_list_item">
            <div className="service_list_item_name">
                {service.name}
                <div className="service_list_delete" onClick={() => handleDelete()}>X</div>
            </div>
            <div className="service_list_expand">
                <div className={`service_list_item_form ${expand ? "expand" : null}`}>
                    <Formik
                        initialValues={{ name: service.name }}
                        onSubmit={values => handleSubmit(values, service)}
                    >
                        {({ errors, touched }) => (
                            <>
                                <Form>
                                    <Field id='name' name='name' placeholder={service.name} />
                                    <button type="submit" className="service_container_button">Update</button>
                                </Form>
                                {errors.name && touched.name ? (
                                    <div className="error">{errors.name}</div>
                                ) : null}
                            </>
                        )}
                    </Formik>
                </div>
                <div onClick={() => setExpand(!expand)}>
                    {expand ? "(Collapse)" : "(Click to Edit)"}
                </div>
            </div>
        </div >
    )
}

export default CustomizeEditServices