import React, { useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom"
import redirectCheck from "../../helpers/redirectCheck";
import loginRequest from '../../helpers/loginRequest';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "../../styles/login.css"

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

const handleSignUp = async (values, setIsLoggedIn, navigate, setInvalid) => {
    const { username, password } = values;

    try {
        const response = await fetch('http://localhost:5555/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('userId', data.id);
            setIsLoggedIn(true);
            navigate("/schedule");
        } else {
            setInvalid(true);
        }
    } catch (error) {
        console.error("Error during signup:", error);
        setInvalid(true);
    }
};



function Login() {
    const [hidden, setHidden] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const navigate = useNavigate();
    const [invalid, setInvalid] = useState(false);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(2, "Username must be at least 2 characters long")
            .required("Username is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters long")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords must match")
            .required("Confirm Password is required"),
    });


    return (
        <div className='login_box'>
            {isLoggedIn ? (
                redirectCheck(isLoggedIn)
            ) : (
                <div className='login_container'>
                    <div className={`login_form ${hidden ? null : "expand"}`}>
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
                        <button onClick={() => setHidden(!hidden)}>Sign up</button>
                    </div>
                    <div className={`signup_form ${hidden ? "expand" : null}`}>
                        <Formik
                            initialValues={{ username: '', password: '', confirmPassword: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => handleSignUp(values, setIsLoggedIn, navigate, setInvalid)}
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
                                    <div>
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <Field type="password" name="confirmPassword" />
                                        <ErrorMessage name="confirmPassword" component="div" />
                                    </div>
                                    <button type="submit" disabled={isSubmitting}>
                                        {invalid ? "Invalid Sign-up" : "Sign-Up"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        <button onClick={() => setHidden(!hidden)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login