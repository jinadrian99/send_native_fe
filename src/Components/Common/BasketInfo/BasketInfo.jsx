import React from 'react'
import { useEffect, useState } from 'react';
import { Row, Col, Modal, Button, Image, message } from 'antd';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, differenceInDays } from 'date-fns';

import { deleteCart } from 'ReduxConfig/Actions/cart';
import { useDispatch } from 'react-redux';

import { IoIosArrowForward } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";
import { RiCoinsLine } from "react-icons/ri";
import { GiCarKey } from "react-icons/gi";
import { TiShoppingCart } from "react-icons/ti";
import { GrDocumentLocked } from "react-icons/gr";
import { RiShoppingBasket2Line, RiPercentLine } from "react-icons/ri";
import { AiOutlineWifi } from "react-icons/ai";
import { BsCalendar } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

import './BasketInfo.css';

export default function BasketInfo(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState(localStorage.getItem('itemsShoppingCart') ? JSON.parse(localStorage.getItem('itemsShoppingCart')) : []);
    const [startDate, setStartDate] = useState(localStorage.getItem('dateArriveCart') ? new Date(JSON.parse(localStorage.getItem('dateArriveCart')).startDate): null);
    const [endDate, setEndDate] = useState(localStorage.getItem('dateArriveCart') ? new Date(JSON.parse(localStorage.getItem('dateArriveCart')).endDate) : null);
    const [tempSD, setTempSD] = useState(localStorage.getItem('dateArriveCart') ? new Date(JSON.parse(localStorage.getItem('dateArriveCart')).startDate): null);
    const [tempED, setTempED] = useState(localStorage.getItem('dateArriveCart') ? new Date(JSON.parse(localStorage.getItem('dateArriveCart')).endDate) : null);
    const [diff, setDiff] = useState(localStorage.getItem('dateArriveCart') ? JSON.parse(localStorage.getItem('dateArriveCart')).days_diff : 0);
    const [tempDiff, setTempDiff] = useState(localStorage.getItem('dateArriveCart') ? JSON.parse(localStorage.getItem('dateArriveCart')).days_diff : 0);
    const [slDat, setslDat] = useState(localStorage.getItem('slItemsShoppingCart') ? JSON.parse(localStorage.getItem('slItemsShoppingCart')).sl : 0);
    const [totalPrice, setTotalPrice] = useState(0);
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (rooms != null) {
            var ttp = 0;
            rooms.forEach(room => {
                ttp += parseInt(room.giaLP, 10) * diff * parseInt(room.slDat, 10);
            });
            setTotalPrice(ttp);
        }
    }, []);

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsModalVisible(false);
        }, 3000);
    };

    function showModalDate(){
        return (
            <>
                <Modal
                    // className="modalDate"
                    visible={isModalVisible}
                    title= {<span style={{fontFamily:'Georgia'}}>Change Date &nbsp;&nbsp;<BsCalendar/></span>}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" loading={loading} onClick={saveChangeDatePicker}>
                            Save change
                        </Button>
                    ]}
                >
                    <Row>
                        <Col xs="3" style={{fontSize:'2.5vh', fontFamily:'Georgia', paddingTop:'1%'}}>Arrive:</Col>
                        <Col xs="9">
                            <div className='date-start-picker'>
                                <DatePicker
                                    selected={tempSD}
                                    onChange={changeStartDate}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat='dd/MM/yyyy'
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="3" style={{fontSize:'2.5vh', fontFamily:'Georgia', paddingTop:'1%'}}>Depart:</Col>
                        <Col xs="9">
                            <div className='date-end-picker'>
                                <DatePicker
                                    selected={tempED}
                                    onChange={changeEndDate}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    dateFormat='dd/MM/yyyy'
                                />
                            </div>
                        </Col>
                    </Row>
                </Modal>
            </>
        );
    }

    const changeStartDate = (e) => {
        var date = new Date(e);
        if(format(new Date(), 'yyyy/MM/dd')>format(date, 'yyyy/MM/dd')){
            message.error('Chọn nhầm ngày trong quá khứ');
            return;
        } 
        else {
            setTempSD(date);
            console.log('sd: ', tempSD);
            date = format(date, 'yyyy/MM/dd');
        }
        
    }

    const changeEndDate = (e) => {
        if(startDate === null){
            message.error('Bạn chưa chọn ngày bắt đầu');
            return;
        } 
        else{
            var date = new Date(e);
            setTempED(date);
            date = format(date, 'yyyy/MM/dd');
            console.log('start date: ', tempSD);
            console.log('end date: ', tempED);
        }
    }

    const saveChangeDatePicker = () => {
        var days_diff = differenceInDays(tempED, tempSD);
        console.log('days diff: ', days_diff);
        setTempDiff(days_diff);
        setStartDate(tempSD);
        setEndDate(tempED);
        setDiff(days_diff);
        if (rooms != null) {
            var ttp = 0;
            rooms.forEach(room => {
                ttp += parseInt(room.giaLP, 10) * days_diff * parseInt(room.slDat, 10);
            });
            setTotalPrice(ttp);
        }
        var date_cart = {
            startDate: format(tempSD, 'yyyy/MM/dd'),
            endDate: format(tempED, 'yyyy/MM/dd'),
            days_diff: days_diff
        }
        localStorage.setItem('dateArriveCart', JSON.stringify(date_cart));
        setIsModalVisible(false);
    }

    function showRooms() {
        console.log('ko ra: ', startDate, endDate, diff, tempSD, tempED, tempDiff);
        var lst = rooms.map((item, index) =>
            <div style={{paddingTop:'1%'}} key={index}>
                <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                <Row style={{padding:'2% 0 2% 0'}}>
                    <Col xs={24} md={6} lg={6} style={{borderRight:'1px solid #F3F1EF', height: '14vh', overflow: 'hidden', textAlign:'center'}}>
                        <Image src={ item.hinhanhLP } style={{width:'12vw', height:'auto'}}/>
                    </Col>
                    <Col xs={24} md={14} lg={12} style={{fontSize:'21px', fontFamily:'Georgia', borderRight:'1px solid #F3F1EF'}}>
                        <Row>
                            <Col xs={22} md={22} lg={24}><span style={{fontWeight:'bold', paddingLeft: '2vw'}}>Room: { item.tenLP } x { item.slDat }</span><hr style={{color:'#E5E5E5', border:'1px solid'}}/></Col>
                        </Row>
                        <Row>
                            <Col xs={22} md={22} lg={24}>
                                <span style={{fontWeight:'bold', fontSize:'21px', lineHeight: '3vw', paddingLeft: '2vw'}}>
                                    Price: { item.giaLP } USD
                                </span>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={4} lg={6} style={{fontSize:'20px', fontFamily:'Georgia'}}>
                        <Row>
                            <Col xs={22} md={8} lg={8}>
                                <Button 
                                    outline color="red" 
                                    className="btn-del-spin"
                                    style={{padding: 0, marginTop: '5vh', marginLeft: '2.5vw', border:'none'}} 
                                    onClick={ ()=>deleteItemsShoppingCart(item.idLP) }
                                >
                                    <ImCancelCircle style={{fontSize: '3vh'}} color="black" className="icon-spin" /> <span style={{fontSize: '2.5vh', paddingLeft: '1vw', paddingBottom:'2vw'}}>Remove</span>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
            </div>
        );
        return lst;
    }

    const deleteItemsShoppingCart = (n) => {
        console.log(rooms);
        var index = rooms.findIndex(r => r.idLP == n);
        // setslDat(parseInt(slDat, 10) - parseInt(rooms[index].slDat, 10));
        // return console.log('soluongphong: ', rooms[index].slDat);
        
        
        // if (slDat == 0) {
            // localStorage.removeItem('slItemsShoppingCart');
        // }
        // else {
        //     // localStorage.setItem('slItemsShoppingCart', JSON.stringify(slDat));
        //     var actionDelSL = deleteCart(slDat);
        //     dispatch(actionDelSL);
        // }
        var actionDelSL = deleteCart(rooms[index].slDat);
        dispatch(actionDelSL);
        var newRooms = rooms.filter(room => room.idLP != n);
        setRooms(rooms.filter(room => room.idLP != n))
        console.log('rooms: ', newRooms);
        var ttp = 0;
        newRooms.forEach(room => {
            ttp += parseInt(room.giaLP, 10) * diff * parseInt(room.slDat, 10);
        });
        console.log('ttp: ', ttp);
        setTotalPrice(ttp);
        if (rooms.length == 0) {
            localStorage.removeItem('itemsShoppingCart');
        }
        else {
            localStorage.setItem('itemsShoppingCart', JSON.stringify(newRooms));
        }
    }

    if (slDat === 0) {
        return (
            <div style={{ paddingTop:'1%', backgroundColor:'#FFFFFF'}}>
                <div style={{backgroundColor:'#FFFFFF', paddingBottom:'1%'}}>
                    <Row className="breadcrumb-nativeLink">
                        <Col xs={2} md={3} lg={3}></Col>
                        <Col xs={20} md={18} lg={18}>
                            <Link to="/"><span>NATIVE</span></Link>&nbsp; <IoIosArrowForward className="icon"/>&nbsp;<span>YOUR BASKET</span>
                        </Col>
                        <Col xs={2} md={3} lg={3}></Col>
                    </Row> 
                </div>
                <Row style={{ paddingTop:'5%', paddingBottom:'5%', backgroundColor:'#F3F1EF'}}>
                    <Col xs={2} md={3} lg={6}></Col>
                    <Col xs={20} md={18} lg={12}>
                        <span style={{fontSize:'28px', fontWeight:'bold', fontFamily:'Georgia'}}>YOUR BASKET</span>&nbsp;&nbsp;<RiShoppingBasket2Line style={{width:'4vw', height:'4vh'}} className="iconBasket"/><hr/>
                        <p style={{fontSize:'19px', fontFamily:'Georgia'}}>We no longer offer Pay on Arrival (for the moment anyway) and now ask for all web customers to pay on booking.</p>
                    </Col>
                    <Col xs={2} md={3} lg={6}></Col>
                </Row>
                <Row style={{ paddingTop:'2%', paddingBottom:'5%'}}>
                    <Col  xs={2} md={3} lg={6}></Col>
                    <Col xs={20} md={18} lg={12}>
                        <p style={{fontSize:'19px', fontFamily:'Georgia'}}>Your basket is empty.</p>
                    </Col>
                    <Col xs={2} md={3} lg={3}></Col>
                </Row>
            </div>
        )
    }
    return (
        <div style={{ paddingTop:'1%', backgroundColor:'#FFFFFF'}}>
            <div style={{backgroundColor:'#FFFFFF', paddingBottom:'1%'}}>
                <Row className="breadcrumb-nativeLink">
                    <Col xs={2} md={3} lg={3}></Col>
                    <Col xs={20} md={18} lg={18}>
                        <Link to="/"><span>NATIVE</span></Link>&nbsp; <IoIosArrowForward className="icon"/>&nbsp;<span>YOUR BASKET</span>
                    </Col>
                    <Col xs={2} md={3} lg={3}></Col>
                </Row> 
            </div>
            <Row style={{ paddingTop:'5%', paddingBottom:'5%', backgroundColor:'#F3F1EF'}}>
                <Col xs={2} md={3} lg={6}></Col>
                <Col xs={20} md={18} lg={12}>
                    <span style={{fontSize:'28px', fontWeight:'bold', fontFamily:'Georgia'}}>YOUR BASKET</span>&nbsp;&nbsp;<RiShoppingBasket2Line style={{width:'4vw', height:'4vh'}} className="iconBasket"/><hr/>
                    <p style={{fontSize:'19px', fontFamily:'Georgia'}}>We no longer offer Pay on Arrival (for the moment anyway) and now ask for all web customers to pay on booking.</p>
                </Col>
                <Col xs={2} md={3} lg={6}></Col>
            </Row>
            <Row style={{ paddingTop:'3%', paddingBottom:'8%'}}>
                <Col xs={1} md={2} lg={3}></Col>
                <Col xs={0} md={3} lg={3} style={{borderRight:'1px solid #F3F1EF'}}>
                    <Row >
                        <Col>
                            <span style={{fontSize:'20px', fontFamily:'Georgia'}}>Benefits of booking with us direct:</span>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop:'5%'}}>
                        <Col>
                            <div>
                                <div><IoIosStarOutline style={{width:'4vw', height:'4vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>LOWEST PRICE GUARANTEE</p></div>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop:'5%'}}>
                        <Col>
                            <div>
                                <div><RiCoinsLine style={{width:'4vw', height:'4vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>NO CREDIT CARD OR BOOKING FEES</p></div>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop:'5%'}}>
                        <Col>
                            <div>
                                <div><GiCarKey style={{width:'4vw', height:'4vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>11AM CHECKOUT</p></div>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop:'5%'}}>
                        <Col>
                            <div>
                                <div><TiShoppingCart style={{width:'4vw', height:'4vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>CUSTOMISE YOUR BOOKING</p></div>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop:'5%'}}>
                        <Col>
                            <div>
                                <div><GrDocumentLocked style={{width:'4vw', height:'4vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>BOOK WITH CONFIDENCE</p></div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={0} md={17} lg={15}>
                    <Row>
                        <Col xs={6} md={7} lg={9} /> 
                        <Col xs={12} md={10} lg={6} style={{textAlign:'center'}}>
                            <span style={{fontSize:'24px', fontFamily:'Georgia', fontWeight:'revert'}}>YOUR ROOM</span>
                        </Col>
                        <Col xs={6} md={7} lg={9} />
                    </Row>
                    <Row>
                        <Col xs={3} md={6} lg={8} /> 
                        <Col xs={18} md={12} lg={8} style={{textAlign:'center'}}>
                            <span style={{fontSize:'20px', fontFamily:'Georgia', fontWeight:'revert'}}>
                                Cost rooms for { diff } night(s)<br />
                                <span 
                                    className="hover-pointer hover-underline" 
                                    onClick={ ()=>{ setIsModalVisible(true) } }
                                >
                                    from <b>{ format(startDate, 'dd/MM/yyyy') }</b> to <b>{ format(endDate, 'dd/MM/yyyy') }</b>
                                </span>
                            </span>
                            { 
                                isModalVisible && showModalDate()
                            }
                        </Col>
                        <Col xs={3} md={6} lg={8} /> 
                    </Row>
                    { showRooms() }
                    <Row style={{paddingTop:'5%',fontFamily:'Georgia', fontWeight:'revert'}}>
                        <Col xs={0} md={2} lg={8} /> 
                        <Col xs={0} md={20} lg={8} style={{textAlign:'center'}}><span style={{fontSize:'25px'}}>Total booking cost</span><hr/></Col>
                        <Col xs={0} md={2} lg={8} /> 
                    </Row>
                    <Row style={{fontFamily:'Georgia', fontWeight:'revert'}}>
                        <Col xs={0} md={2} lg={8} /> 
                        <Col xs={0} md={20} lg={8} style={{textAlign:'center'}}>
                            <span style={{fontWeight:'bold', fontSize:'25px'}}>
                                { new Intl.NumberFormat().format(totalPrice) } USD
                            </span>
                        </Col>
                        <Col xs={0} md={2} lg={8} />    
                    </Row>
                    <Row style={{ paddingTop:'2%', fontSize:'15px', fontFamily:'Georgia', fontWeight:'revert'}} className="button-Continue">
                        <Col xs={0} md={2} lg={8} /> 
                        <Col xs={0} md={20} lg={8} style={{textAlign:'center'}}>
                            <Button size="large" style={{width:'200px'}}><b>CONTINUE</b></Button>
                        </Col>
                        <Col xs={0} md={2} lg={8} /> 
                    </Row>
                </Col>
                <Col xs={21} md={0} lg={0}>
                    <Row>
                        <Col xs={6} md={8} lg={10} /> 
                        <Col xs={12} md={8} lg={4} style={{textAlign:'center'}}>
                            <span style={{fontSize:'24px', fontFamily:'Georgia', fontWeight:'revert'}}>YOUR ROOM</span>
                        </Col>
                        <Col xs={6} md={8} lg={10} />
                    </Row>
                    <Row>
                        <Col xs={3} md={6} lg={8} /> 
                        <Col xs={18} md={12} lg={8} style={{textAlign:'center'}}>
                            <span style={{fontSize:'20px', fontFamily:'Georgia', fontWeight:'revert'}}>
                                Cost rooms for { diff } night(s)<br />
                                <span 
                                    className="hover-pointer hover-underline" 
                                >
                                    from <b>{ format(startDate, 'dd/MM/yyyy') }</b> to <b>{ format(endDate, 'dd/MM/yyyy') }</b>
                                </span>
                            </span>
                            <Modal 
                                
                            >
                            </Modal>
                        </Col>
                        <Col xs={3} md={6} lg={8} /> 
                    </Row>
                    {
                        rooms.map((item, index) => 
                            <div style={{paddingTop:'1%'}} key={index}>
                                <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                                <Row style={{padding:'2% 0 2% 0'}}>
                                    <Col xs={24} md={0} lg={0} style={{borderBottom:'1px solid #F3F1EF', paddingBottom:'3%', textAlign:'center'}}>
                                        <Image src={ item.hinhanhLP } style={{width:'60vw', height:'30vh'}}/>
                                    </Col>
                                    <Col xs={24} md={0} lg={0} style={{fontSize:'21px', fontFamily:'Georgia', borderRight:'1px solid #F3F1EF'}}>
                                        <Row style={{paddingTop:'3%'}}>
                                            <Col xs={22} md={0} lg={0}><span style={{fontWeight:'bold', paddingLeft: '2vw'}}>Room: { item.tenLP } x { item.slDat }</span>
                                                <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={22} md={0} lg={0}>
                                                <span style={{fontWeight:'bold', fontSize:'21px', lineHeight: '3vw', paddingLeft: '2vw'}}>
                                                    Price: { item.giaLP } USD
                                                </span>
                                            </Col>
                                        </Row>
                                        <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                                    </Col>
                                    <Col xs={24} md={0} lg={0} style={{fontSize:'20px', fontFamily:'Georgia'}}>
                                        <Row>
                                            <Col xs={22} md={0} lg={0}>
                                                <Button 
                                                    outline color="red" 
                                                    className="btn-del-spin"
                                                    style={{padding: 0, marginTop: '5vh', marginLeft: '2.5vw', border:'none'}} 
                                                >
                                                    <ImCancelCircle style={{fontSize: '3vh'}} color="black" className="icon-spin" /> <span style={{fontSize: '2.5vh', paddingLeft: '1vw', paddingBottom:'2vw'}}>Remove</span>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                            </div>
                        )
                    }
                    {/* <div style={{paddingTop:'1%'}}>
                        <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                        <Row style={{padding:'2% 0 2% 0'}}>
                            <Col xs={24} md={0} lg={0} style={{borderBottom:'1px solid #F3F1EF', paddingBottom:'3%', textAlign:'center'}}>
                                <Image src="./assets/images/IMG_about_1.jpg" style={{width:'60vw', height:'30vh'}}/>
                            </Col>
                            <Col xs={24} md={0} lg={0} style={{fontSize:'21px', fontFamily:'Georgia', borderRight:'1px solid #F3F1EF'}}>
                                <Row style={{paddingTop:'3%'}}>
                                    <Col xs={22} md={0} lg={0}><span style={{fontWeight:'bold', paddingLeft: '2vw'}}>Room: Classic Room x 2</span>
                                        <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={22} md={0} lg={0}>
                                        <span style={{fontWeight:'bold', fontSize:'21px', lineHeight: '3vw', paddingLeft: '2vw'}}>
                                            Price: 5000 USD
                                        </span>
                                    </Col>
                                </Row>
                                <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                            </Col>
                            <Col xs={24} md={0} lg={0} style={{fontSize:'20px', fontFamily:'Georgia'}}>
                                <Row>
                                    <Col xs={22} md={0} lg={0}>
                                        <Button 
                                            outline color="red" 
                                            className="btn-del-spin"
                                            style={{padding: 0, marginTop: '5vh', marginLeft: '2.5vw', border:'none'}} 
                                        >
                                            <ImCancelCircle style={{fontSize: '3vh'}} color="black" className="icon-spin" /> <span style={{fontSize: '2.5vh', paddingLeft: '1vw', paddingBottom:'2vw'}}>Remove</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr style={{color:'#E5E5E5', border:'1px solid'}}/>
                    </div> */}
                    <Row style={{paddingTop:'5%',fontFamily:'Georgia', fontWeight:'revert'}}>
                        <Col xs={2} md={0} lg={0} /> 
                        <Col xs={20} md={0} lg={0} style={{textAlign:'center'}}><span style={{fontSize:'25px'}}>Total booking cost</span><hr/></Col>
                        <Col xs={2} md={0} lg={0} /> 
                    </Row>
                    <Row style={{fontFamily:'Georgia', fontWeight:'revert'}}>
                        <Col xs={2} md={0} lg={0} />
                        <Col xs={20} md={0} lg={0} style={{textAlign:'center'}}>
                            <span style={{fontWeight:'bold', fontSize:'25px'}}>
                                { new Intl.NumberFormat().format(totalPrice) } USD
                            </span>
                        </Col>
                        <Col xs={2} md={0} lg={0} />    
                    </Row>
                    <Row style={{ paddingTop:'2%', fontSize:'15px', fontFamily:'Georgia', fontWeight:'revert'}} className="button-Continue">
                        <Col xs={2} md={0} lg={0} />
                        <Col xs={20} md={0} lg={0} style={{textAlign:'center'}}>
                            <Button size="large" style={{width:'200px'}}><b>CONTINUE</b></Button>
                        </Col>
                        <Col xs={2} md={0} lg={0} />
                    </Row>
                </Col>
                <Col xs={21} md={0} lg={0}>
                    <Row style={{paddingTop:'7%'}}>
                        <Col xs={2} md={0} lg={0} />
                        <Col xs={20} md={0} lg={0}>
                            <span style={{fontSize:'20px', fontFamily:'Georgia'}}>Benefits of booking with us direct:</span>
                        </Col>
                        <Col xs={2} md={0} lg={0} />
                    </Row>
                    <Row style={{ paddingTop:'5%'}}>
                        <Col xs={2} md={0} lg={0} />
                        <Col xs={10} md={0} lg={0} style={{borderRight:'1px solid #F3F1EF', borderBottom:'1px solid #F3F1EF'}}>
                            <div>
                                <div><IoIosStarOutline style={{width:'5vw', height:'5vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>LOWEST PRICE GUARANTEE</p></div>
                            </div>
                        </Col>
                        <Col xs={10} md={0} lg={0} style={{borderLeft:'1px solid #F3F1EF', borderBottom:'1px solid #F3F1EF'}}>
                            <div style={{paddingLeft:'5%'}}>
                                <div><RiCoinsLine style={{width:'5vw', height:'5vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>NO CREDIT CARD OR BOOKING FEES</p></div>
                            </div>
                        </Col>
                        <Col xs={2} md={0} lg={0} />
                    </Row>
                    <Row>
                        <Col xs={2} md={0} lg={0} />
                        <Col xs={10} md={0} lg={0} style={{borderRight:'1px solid #F3F1EF', borderTop:'1px solid #F3F1EF'}}>
                            <div style={{paddingTop:'10%'}}>
                                <div><AiOutlineWifi style={{width:'5vw', height:'5vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>FREE WIFI</p></div>
                            </div>
                        </Col>
                        <Col xs={10} md={0} lg={0} style={{borderLeft:'1px solid #F3F1EF', borderTop:'1px solid #F3F1EF'}}>
                            <div style={{paddingTop:'10%', paddingLeft:'5%'}}>
                                <div><RiPercentLine style={{width:'5vw', height:'5vh'}}/></div>
                                <div style={{padding:'5%'}}><p style={{fontWeight:'bold'}}>SIGN UP FOR EXCLUSIVE ONLINE DISCOUNTS</p></div>
                            </div>
                        </Col>
                        <Col xs={2} md={0} lg={0} />
                    </Row>
                </Col>
                <Col xs={1} md={2} lg={3}></Col>
            </Row>
        </div>
    )
}
