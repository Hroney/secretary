import { useEffect, useState } from "react"
import InvoiceServiceCard from "./InvoiceServiceCard"

function InvoiceCard({ invoice, index }) {
    const [expand, setExpand] = useState(false)


    if (invoice) {


        return (
            <div style={{ border: '1px solid black', marginBottom: '1px' }} >
                <div>Invoice number: {index + 1}</div>
                <div>
                    total: {invoice.total}
                </div>
                <div>
                    Paid in full: {invoice.paid_in_full ? "yes" : "no"}
                </div>
                <button onClick={() => setExpand(!expand)}> See Details </button>
                {!expand ? null :
                    <div>
                        <big>Services</big>
                        {invoice.services.map((service, index) => (
                            <InvoiceServiceCard
                                key={index}
                                service={service}
                            />
                        ))}
                    </div>
                }
            </div>)
    } else return (
        <div>
            No invoices
        </div>
    )
}

export default InvoiceCard