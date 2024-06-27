import React, { useState } from "react"


function InvoiceServiceCard({ service }) {
    const [expanded, setExpanded] = useState(false)

    return (

        <div>
            <div>
                name: {service.name}
            </div>
            <button onClick={() => setExpanded(!expanded)}>See Details</button>
            {!expanded ? null :
                <div>
                    price: {service.price}
                    paid: {service.paid_status ? "yes" : "no"}
                    date: {service.scheduled_date}
                </div>
            }
        </div>
    )


}

export default InvoiceServiceCard