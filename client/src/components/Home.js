import redirectCheck from "../helpers/redirectCheck"
import { useOutletContext } from "react-router-dom"

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();

    return (
        <div>
            {isLoggedIn ? redirectCheck(isLoggedIn) :
                "Home"
            }
        </div>
    )
}

export default Home