import Bill from 'Components/Common/Bill/Bill';
import Footer from 'Components/Common/Footer/Footer'
import IntroCus from 'Components/Common/IntroCus/IntroCus'
import NavProfile from 'Components/Common/Navigation/NavProfile/NavProfile'
import React, { useEffect } from 'react'

function PageBill(props) {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[]);

    return (
        <div style={{ overflow: 'hidden', width: '100vw' }}>
            <NavProfile />
            <IntroCus intro="Customer Bills" />
            <div style={{ backgroundColor: 'white', minHeight: '92vh', paddingTop: '30px'}}>
                <Bill />
            </div>
            <Footer />
        </div>
    )
}

export default PageBill

