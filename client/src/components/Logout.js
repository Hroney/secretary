import { useNavigate, useOutletContext } from "react-router-dom"
import redirectCheck from '../helpers/redirectCheck'

const handleLogOut = (isLoggedIn, setIsLoggedIn, navigate) => {
    setIsLoggedIn(!isLoggedIn)
    navigate("/home")
}

function Logout() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const navigate = useNavigate();

    return (
        <div>
            {!isLoggedIn ? redirectCheck(isLoggedIn) :
                <button onClick={() => handleLogOut(isLoggedIn, setIsLoggedIn, navigate)}>
                    Logout
                </button>
            }
        </div >
    )
}

export default Logout