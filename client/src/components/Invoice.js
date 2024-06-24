import { useOutletContext } from "react-router-dom"
import redirectCheck from "../helpers/redirectCheck";

function Invoice() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();

    return (
        <div>
            {!isLoggedIn ? redirectCheck(isLoggedIn) :
                "Invoice"
            }
        </div>
    )
}

export default Invoice