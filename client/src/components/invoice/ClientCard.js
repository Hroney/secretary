import React, { useState, useEffect } from "react";
import InvoiceCard from "./InvoiceCard";
import "../../styles/clientcard.css"

function ClientCard({ client }) {
    console.log("clientcard client", client)
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
        <div className="clientcard">
            <div className="clientname">
                {clientObj.name}
            </div>
            <button onClick={() => setExtended(!extended)}>See Details</button>
            {!extended ? null :
                <div className="invoicebox">
                    {invoiceList.length === 0 ? "No Invoices" : "Invoices"}
                    {invoiceList.map((invoice, index) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
                    ))}
                </div>
            }
        </div>
    );
}

export default ClientCard;
