import '../../styles/customize.css'
import React from 'react'
import CustomizeClient from './CustomizeClients'
import CustomizeServices from './CustomizeServices'


function Customize() {

    return (
        <div className="customize_container">
            <div className="customize_customer_container">
                <CustomizeClient />
            </div>
            <div className="customize_services_container">
                <CustomizeServices />
            </div>
        </div >
    )
}

export default Customize