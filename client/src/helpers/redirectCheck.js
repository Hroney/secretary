import ErrorPage from '../components/main/ErrorPage'

const redirectCheck = (isLoggedIn) => {
    const error = isLoggedIn ? "Already logged in." : "Not logged in."
    const redirect = isLoggedIn ? "schedule" : "home"
    return (
        <ErrorPage error={error} redirect={redirect} />
    )
}

export default redirectCheck