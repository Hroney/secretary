import { useEffect, useState } from "react"
import InvoiceServiceCard from "./InvoiceServiceCard"

function InvoiceCard({ invoice, index }) {
    const [expand, setExpand] = useState(false)


    if (invoice) {


        return (
            <div className={`invoice_card_container ${expand ? 'extended' : ''}`}>
                <div className="invoice_card_number">
                    {index + 1}
                </div>
                <div className="invoice_card_total">
                    total: {invoice.total}
                </div>
                <div className="invoice_card_paid">
                    Paid in full: {invoice.paid_in_full ? "yes" : "no"}
                </div>
                <button onClick={() => setExpand(!expand)} className={`invoice_card_button ${expand ? 'extended' : ''}`}> See Details </button>
                <div className="invoice_card_InvoiceServiceCard">
                    {invoice.services.map((service, index) => (
                        <InvoiceServiceCard
                            key={index}
                            service={service}
                        />
                    ))}
                </div>
            </div>)
    } else return (
        <div>
            No invoices
        </div>
    )
}

export default InvoiceCard