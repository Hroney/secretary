import { useOutletContext } from "react-router-dom"
import redirectCheck from "../helpers/redirectCheck";


function Schedule() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();

    return (
        <div>
            {!isLoggedIn ? redirectCheck(isLoggedIn) :
                "Schedule"
            }
        </div>
    )
}

export default Schedule