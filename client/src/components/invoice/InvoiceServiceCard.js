import React, { useState } from "react"


function InvoiceServiceCard({ service }) {

    return (

        <div className="invoice_service_card_container">
            <div className="invoice_service_card_name">
                name: {service.name}
            </div>
            <div className="invoice_service_card_price">
                price: {service.price}
            </div>
            <div className="invoice_service_card_paid">
                paid: {service.paid_status ? "yes" : "no"}
            </div>
            <div className="invoice_service_card_date">
                {new Date(service.scheduled_date).toDateString()}
            </div>
        </div>
    )


}

export default InvoiceServiceCard