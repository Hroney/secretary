import React, { useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom"
import redirectCheck from "../helpers/redirectCheck";
import loginRequest from '../helpers/loginRequest';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const handleLogIn = async (values, setIsLoggedIn, navigate, setInvalid) => {
    const { username, password } = values;

    const response = await loginRequest(username, password);

    if (response.success) {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userId', response.userId);
        setIsLoggedIn(true);
        navigate("/schedule");
    } else {
        setInvalid(true)
    }
}

function Login() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const navigate = useNavigate();
    const [invalid, setInvalid] = useState(false);

    const validationSchema = Yup.object({
        username: Yup.string().required('Required'),
        password: Yup.string().required('Required')
    });


    return (
        <div>
            {isLoggedIn ? (
                redirectCheck(isLoggedIn)
            ) : (
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleLogIn(values, setIsLoggedIn, navigate, setInvalid)}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div>
                                <label htmlFor="username">Username</label>
                                <Field type="text" name="username" />
                                <ErrorMessage name="username" component="div" />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <Field type="password" name="password" />
                                <ErrorMessage name="password" component="div" />
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                {invalid ? "Invalid Login" : "Login"}
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    )
}

export default Login