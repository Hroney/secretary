import React, { useState, useEffect } from "react";
import InvoiceCard from "./InvoiceCard";
import "../../styles/clientcard.css";

function ClientCard({ client }) {
    const [clientObj, setClientObj] = useState(null);
    const [invoiceList, setInvoiceList] = useState([]);
    const [extended, setExtended] = useState(false);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`http://localhost:5555/client_by_id/${client[1].id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setClientObj(data);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        const fetchInvoices = async () => {
            try {
                const response = await fetch(`http://localhost:5555/invoices_by_client_id/${client[1].id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setInvoiceList(data);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchClient();
        fetchInvoices();
    }, [client]);

    if (!clientObj) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`client_card_container ${extended ? 'extended' : ''}`} key={clientObj.id}>
            <div className="client_card_name">
                {clientObj.name}
            </div>
            <button onClick={() => setExtended(!extended)} className={`client_card_button ${extended ? 'extended' : ''}`}>See Details</button>
            <div className="invoice_box">
                <div className="invoice_box_title">
                    {invoiceList.length === 0 ? "No Invoices" : "Invoice(s)"}
                </div>
                {invoiceList.map((invoice, index) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
                ))}
            </div>
        </div>
    );
}

export default ClientCard;
