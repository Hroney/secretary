import { useOutletContext } from "react-router-dom"
import redirectCheck from "../helpers/redirectCheck";


function Schedule() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();



    return (
        <div>
            {!isLoggedIn ? redirectCheck(isLoggedIn) :
                <div>

                </div>
            }
        </div>
    )
}

export default Schedule