import { useNavigate } from "react-router-dom"

function ErrorPage({ error, redirect }) {
    const navigate = useNavigate()
    setTimeout(() => { navigate(`/${redirect}`) }, 3000)
    return (
        <div>
            Error: {error} Redirecting you to {redirect}
        </div>
    )
}

export default ErrorPage