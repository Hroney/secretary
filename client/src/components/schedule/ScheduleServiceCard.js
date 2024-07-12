import { useEffect, useState } from "react"
import '../../styles/schedule_box.css'

function ScheduleServiceCard({ service, setActiveService, setCreateInvoiceBool }) {
    const service_info = service.client_service_list.filter((s) => (service.invoice_service_id === s.id))

    const handleClick = (service, service_info) => {
        setActiveService([...service, service_info])
        setCreateInvoiceBool(false)
    }

    return (
        <div className="schedule_service_card" onClick={() => handleClick(service_info, service)}>
            {service.service}
            <div className="show_on_hover">
                <div>
                    {service.client.name}
                </div>
                <div className={service_info[0].paid_status ? "status_paid" : "status_owed"}>
                    {service_info[0].paid_status ? "Paid" : "Owes " + service_info[0].price}
                </div>
            </div>
        </div>
    )
}

export default ScheduleServiceCard