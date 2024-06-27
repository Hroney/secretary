import { useEffect, useState } from "react"

function ScheduleServiceCard({ service }) {
    const service_info = service.client_service_list.filter((s) => (s.name === service.service && s.scheduled_date === service.scheduled_date))
    console.log(service)
    return (
        <div>
            {service.service}
            {service.client.name}
            {service_info[0].price}
            {service_info[0].paid_status ? "true" : "false"}
        </div>
    )
}

export default ScheduleServiceCard