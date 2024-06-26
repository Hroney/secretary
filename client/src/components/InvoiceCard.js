import { useEffect, useState } from "react"

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
                <button onClick={() => setExpand(!expand)}> expand </button>
                {!expand ? null :
                    <div>
                        <big>Services</big>
                        {invoice.services.map((service) => (
                            <div key={service.id}>
                                <div>
                                    name: {service.name}
                                </div>
                                <div>
                                    price: {service.price}
                                </div>
                                <div>
                                    paid: {service.paid_status ? "yes" : "no"}
                                </div>
                                <div>
                                    date: {service.scheduled_date}
                                </div>
                            </div>
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