import { Button, Col, message, Row, Input, Select, Form, Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { getData, putData, postData } from 'Api/api';
import { url } from 'Api/url';
import { urnSurchargePrice, urnExtraFeeID, urnSaleOffByCost, urnBillUpdateMoneyInBill, urnExtraFeeByIDPTT, urnBillID, urnRoomByIdBill, urnRoomTypeRateIDLP } from 'Api/urn';
import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";

function SurchargeUpd(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const idPT = props.idPT;
    const idPTT = props.idPTT;
    const [soLuong, setSoLuong] = useState(0);
    const [donGia, setDonGia] = useState(0);
    const [idGPT, setIdGPT] = useState('');
    const [dataGPT, setDataGPT] = useState([]);
    const [showDataRooms, setShowDataRooms] = useState(false);
    const [dataRooms, setDataRooms] = useState([]);
    const [ghiChu, setGhiChu] = useState('Basic');
    
    const [bill, setBill] = useState(null);
    
    useEffect(() => {
        var uri = url + urnBillID(props.idPTT);
        getData(uri).then(res => {
            setBill(res.data);
        });
    },[props.idPTT]);

    useEffect(() => {
        var uri = url + urnExtraFeeID(idPT);
        getData(uri)
        .then(res =>{ 
            console.log("load:", res.data); 
            console.log("soluong:", res.data.soLuong); 
            setSoLuong(res.data.soLuong);
            setDonGia(res.data.donGia);
            setIdGPT(res.data.idGPT);

            if (res.data.ghiChu !== 'Basic') {
                setShowDataRooms(true);
            }
            setGhiChu(res.data.ghiChu);
        });
    }, [idPT]);

    useEffect(() => {
        var uri = url + urnSurchargePrice;
        getData(uri).then(res =>{ console.log("load:", res.data); setDataGPT(res.data); });
    }, []);

    // useEffect(() => {
    //     dataGPT.map((item, index) => {
    //         if (item.idGPT === idGPT) {
    //             setDonGia(item.giaPT);
    //         }
    //     })
    // }, [idGPT]);

    useEffect(() => {
        if (idGPT && dataGPT.length > 0) {
            var found = dataGPT.find(item => item.idGPT === idGPT);
            console.log("bla: ", found);
            if (found.loaiGPT === 1) {
                setShowDataRooms(false);
                setGhiChu('Basic');
                dataGPT.map((item, index) => {
                    if (item.idGPT === idGPT) {
                        setDonGia(item.giaPT);
                    }
                    return 1;
                })
            }
            else {
                setShowDataRooms(true);
                setGhiChu();
                var uri = url + urnRoomByIdBill(idPTT);
                getData(uri)
                .then(res => {
                    setDataRooms(res.data);
                })
            }
        }
    }, [idGPT, idPTT, dataGPT]);

    useEffect(() => {
        if (ghiChu !== "Basic" && ghiChu && dataRooms.length > 0) {
            var found = dataRooms.find(item => item.maPhong === ghiChu);
            console.log("bla2: ", found);
            var uri = url + urnRoomTypeRateIDLP(found.idLP);
            getData(uri)
            .then(res => {
                console.log('gia goc: ', res.data);
                dataGPT.map((item, index) => {
                    if (item.idGPT === idGPT) {
                        console.log('gia 20%: ', res.data * (item.giaPT/100));
                        setDonGia(res.data * (item.giaPT/100));
                    }
                    return 1;
                })
            })
        }
    }, [ghiChu, dataRooms, dataGPT, idGPT]);

    const showModalSearch = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    const onReset = () => {
        var uri = url + urnExtraFeeID(idPT);
        getData(uri)
        .then(res =>{
            console.log("setdatagpt: ", dataGPT);
            console.log("idPTT: ", idPTT);
            console.log("idGPT: ", idGPT);
            console.log("donGia: ", donGia);
            console.log("sl: ", soLuong);
            setSoLuong(res.data.soLuong);
            setDonGia(res.data.donGia);
            setIdGPT(res.data.idGPT);
            setGhiChu(res.data.ghiChu);
        })
        .catch(err => console.log(err));
    }

    const onUpdate = () => {
        if(idGPT === "" || donGia === 0 || soLuong === 0){
            message.error("Please, fill out all the fields!");
            return;
        }
        const data = {
            soLuong: parseInt(soLuong),
            donGia,
            idGPT,
            idPTT: parseInt(idPTT),
            ghiChu
        }
        console.log(data);
        var uri = url + urnExtraFeeID(idPT);
        putData(uri, data)
        .then(res=>{
            if (res.data) {
                console.log("res update: ", res.data);
                var tpt = 0;
                const uri1 = url + urnExtraFeeByIDPTT(props.idPTT);
                getData(uri1)
                .then(res =>{ 
                    console.log("loadidPTT:", res.data);
                    res.data.map(item => {
                        tpt += (item.soLuong * item.donGia);
                        return 1;
                    });
                    console.log("tpt:", tpt); 
                    console.log("bill.tongtienphong:", bill.tongTienPhong); 
                    var tongTienPhong = bill.tongTienPhong;
                    var tienCoc = tongTienPhong * (30/100);
                    var phiPhatSinh = tpt;
                    console.log("tongTienPhong:", tongTienPhong); 
                    console.log("phiPhatSinh:", phiPhatSinh); 
                    const uri2 = url + urnSaleOffByCost;
                    postData(uri2,{tongTienPhong, phiPhatSinh})
                    .then(resSaleOff => {
                        var phanTramGiam = resSaleOff.data.phanTramGiam;
                        var tongTienConLai = ((tongTienPhong - tienCoc) - (tongTienPhong - tienCoc) * (phanTramGiam / 100)) + (tienCoc - tienCoc * (phanTramGiam / 100)) + (phiPhatSinh - phiPhatSinh * (phanTramGiam / 100));
            
                        var dataPTTP = {
                            tongTienPhong,
                            tienCoc,
                            phiPhatSinh,
                            phanTramGiam,
                            tongTienConLai,
                            idKM: resSaleOff.data.idKM
                        }
                        const uri3 = url + urnBillUpdateMoneyInBill(props.idPTT);
                        putData(uri3, dataPTTP)
                        .then(resUpdBill => {
                            if (resUpdBill.data) {
                                message.success("Updated successfully, wait a few seconds", 3).then(()=>{
                                    onReset();
                                    return props.onRefesh(true);
                                })
                            }
                        })
                    })
                });
            }
            else {
                message.error("Something went wrong, please try again!", 3).then(()=>{
                    onReset();
                })
            }
        })
    }

    return (
        <>
            {/* <Button onClick={ showModalSearch }>ADD SURCHARGE</Button> */}
            <Tooltip placement="top" title="Edit"><Button onClick={ showModalSearch } className="btn-edit"><FaRegEdit/></Button></Tooltip>
            <Modal 
                title="Update surcharge for customer" 
                visible={ isModalVisible } 
                onCancel={ handleCancel } 
                footer={[
                    <Button onClick={ handleCancel }>
                        Close
                    </Button>
                ]}
            >
                <Row>
                    <Col xs={5} md={5} lg={5}/>
                    <Col xs={15} md={15} lg={15}>
                        <h1><b>UPDATE SURCHARGE</b></h1>
                    </Col>
                    <Col xs={4} md={4} lg={4}/>
                </Row>
                <Form>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6}><b>ID Bill:</b></Col>
                        <Col xs={18} md={18} lg={18}>
                            <Input name="idPTT" value={idPTT} readOnly />
                        </Col>
                    </Row>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6}><b>Surcharge name:</b></Col>
                        <Col xs={18} md={18} lg={18}>
                            <Select value={idGPT} style={{width: '100%'}} onChange={value => setIdGPT(value)} disabled>
                                {
                                    dataGPT.map((item, index) => 
                                        <Select.Option key={index} value={item.idGPT}>{item.idGPT + " - " + item.tenPT}</Select.Option>
                                    )
                                }
                            </Select>
                        </Col>
                    </Row>
                    {
                        showDataRooms && (
                            <Row className="mb-15">
                                <Col xs={6} md={6} lg={6}><b>Rooms:</b></Col>
                                <Col xs={18} md={18} lg={18}>
                                    <Select value={ghiChu} style={{width: '100%'}} onChange={value => setGhiChu(value)}>
                                        {
                                            dataRooms.map((item, index) => 
                                                <Select.Option key={index} value={item.maPhong}>{item.maPhong}</Select.Option>
                                            )
                                        }
                                    </Select>
                                </Col>
                            </Row>
                        )
                    }
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6}><b>Price:</b></Col>
                        <Col xs={18} md={18} lg={18}>
                            {/* {
                                dataGPT.map((item, index) => 
                                    item.idGPT === idGPT &&  */}
                                    <Input type="number" prefix="$" suffix="USD" name="donGia" value={donGia} readOnly/>
                                {/* )
                            } */}
                        </Col>
                    </Row>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6}><b>Amount:</b></Col>
                        <Col xs={18} md={18} lg={18}><Input type="number" min={1} max={6} name="soLuong" value={soLuong} onChange={ e => setSoLuong(e.target.value) } placeholder="Amount" /></Col>
                    </Row>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6}/>
                        <Col xs={8} md={8} lg={8}>
                            <Button size="large" onClick={ onReset } className="btn-reset">Reset</Button>
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                            <Button size="large" onClick={ onUpdate } className="btn-create">Update</Button>
                        </Col>
                        <Col xs={4} md={4} lg={4}/>
                    </Row>
                </Form>
            </Modal>  
        </>
    )
}

export default SurchargeUpd

