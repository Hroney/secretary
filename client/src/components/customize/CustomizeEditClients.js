import { Formik, Form, Field } from "formik"
import { useState } from "react"

const CustomizeEditClients = ({ client, setUpdate, update }) => {
  const [expand, setExpand] = useState(false)
  console.log("client: ", client)

  const handleSubmit = (values, client) => {
    console.log("values", values)
    fetch(`http://localhost:5555/client_by_id/${client[0].client_id}`, {
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
    fetch(`http://localhost:5555/clients_by_user_id/${client[0].user_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client[0]),
    })
      .then(response => response.json())
      .then(data => {
        setUpdate(!update)
        console.log('Success - deleted: ', data);
      });
  }

  return (
    <div key={client[0].client_id} className="service_list_item">
      <div className="client_list_item_name">
        <div className="client_list_name_email">
          <div className="client_list_name">
            {client[1].name}
          </div>
          <div className="client_list_email">
            {client[1].email}
          </div>
        </div>
        <div className="client_list_delete" onClick={() => handleDelete()}>X</div>
      </div>
      <div className="service_list_expand">
        <div className={`service_list_item_form ${expand ? "expand" : null}`}>
          <Formik
            initialValues={{ name: client[1].name, email: client[1].email }}
            onSubmit={values => handleSubmit(values, client)}
          >
            {({ errors, touched }) => (
              <Form>
                <Field id='name' name='name' placeholder={client[1].name} />
                <Field id='email' name='email' placeholder={client[1].email} />
                <button type="submit" className="service_container_button">Update</button>
                {errors.name && touched.name ? (
                  <div className="error">{errors.name}</div>
                ) : null}
              </Form>
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

export default CustomizeEditClients