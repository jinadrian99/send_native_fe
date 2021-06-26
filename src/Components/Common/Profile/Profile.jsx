import { Button, Col, Input, Radio, Row, Switch, Popconfirm } from 'antd';
import { getData } from 'Api/api';
import { url } from 'Api/url';
import { urnKhdID } from 'Api/urn';
import { urnUserID } from 'Api/urn';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { firAuth } from 'FirebaseConfig';
import { actLogout } from 'ReduxConfig/Actions/customerAccount';

export default function Profile(props) {
    //  variable support
    const dispatch = useDispatch();
    const isSocialLogin = useSelector(state => state.customerAccountReducer.isSocialLogin);
    const idTK = useSelector(state => state.customerAccountReducer.idTK);
    const [isUpdatePassword, setisUpdatePassword] = useState(false);

    const [oldLoaiTaiKhoan, setoldLoaiTaiKhoan] = useState('');
    const [oldPassword, setoldPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    //  USER
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [displayName, setdisplayName] = useState('');
    const [title, settitle] = useState('Mr');
    const [loaiTaiKhoan, setloaiTaiKhoan] = useState(0);

    //  KHD
    const [idKHD, setidKHD] = useState(-1);
    const [tenKH, settenKH] = useState('');
    const [sdt, setsdt] = useState('');

    useEffect(()=>{
        window.scrollTo(0, 0);
    },[]);

    useEffect(() => {
        var uri = url + urnUserID(idTK);
        getData(uri)
        .then((resUser) => {
            //  variable support
            setoldLoaiTaiKhoan(resUser.data[0].loaiTaiKhoan);

            //  USER
            setemail(resUser.data[0].email);
            setpassword(resUser.data[0].password);
            setdisplayName(resUser.data[0].displayName);
            settitle(resUser.data[0].title || 'Mr');
            setloaiTaiKhoan(resUser.data[0].loaiTaiKhoan);
            setidKHD(resUser.data[0].idKHD);

            uri = url + urnKhdID(resUser.data[0].idKHD);
            getData(uri)
            .then((resKHD) => {
                //  KHD
                settenKH(resKHD.data[0].tenKH);
                setsdt(resKHD.data[0].sdt);
            })
        });
    },[])

    const onReset = () => {
        var uri = url + urnUserID(idTK);
        getData(uri)
        .then((resUser) => {
            //  USER
            setemail(resUser.data[0].email);
            setpassword(resUser.data[0].password);
            setdisplayName(resUser.data[0].displayName);
            settitle(resUser.data[0].title || 'Mr');
            setloaiTaiKhoan(resUser.data[0].loaiTaiKhoan);
            setidKHD(resUser.data[0].idKHD);

            uri = url + urnKhdID(resUser.data[0].idKHD);
            getData(uri)
            .then((resKHD) => {
                //  KHD
                settenKH(resKHD.data[0].tenKH);
                setsdt(resKHD.data[0].sdt);
            })
        });
    }

    const onSubmitUpdate = () => {
        settenKH(displayName);
        
        var dataKHD = {
            idKHD,
            tenKH,
            sdt
        };

        var dataUser = {
            idTK,
            email,
            password,
            displayName,
            title,
            loaiTaiKhoan
        };
        if(!isUpdatePassword || loaiTaiKhoan == 1){  
            console.log('update non pass: ', dataKHD, dataUser);
        }
        else{
            console.log('update pass: ', dataKHD, dataUser);
        }
    }

    const onLogout = () => {
        if(isSocialLogin){
            firAuth.signOut();
        }

        var actionLogout = actLogout();
        dispatch(actionLogout);
        return props.propsParent.history.push('/');
    }

    return (
        <>
            <img 
                src="https://firebasestorage.googleapis.com/v0/b/fir-nativecity.appspot.com/o/slide%2FIMG_08.jpg?alt=media&token=ba97dcc9-3619-4044-8ad9-c54cce6cedcc" 
                style={{ position: 'fixed', zIndex: '-1', width: '98.9vw', height: '92vh', filter: 'brightness(50%)' }} 
            />
            <div style={{ height: '92vh' }} />
            <Row style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '98.9vw'}}>
                <Col xs={6} md={6} lg={6} />
                <Col xs={12} md={12} lg={12}>
                    <p className="text-center">
                        <span style={{ color: 'white', fontSize: '65px' }}>✨ { displayName || 'Dear Customer'} ✨</span>
                        <hr style={{ color: 'white'}} />
                        <span style={{ color: 'white', fontSize: '20px' }}>Profile</span>
                    </p>
                </Col>
                <Col xs={6} md={6} lg={6} />
            </Row>

            <Row style={{ backgroundColor: 'white', minHeight: '60vh', paddingTop: '30px'}}>
                <Col xs={24} md={24} lg={24}>
                    <h1 className="text-center"><b>INFORMATION CUSTOMER</b></h1> 
                    <Row className="mb-15 mt-15">
                        <Col xs={6} md={6} lg={6} />
                        <Col xs={12} md={12} lg={12} className="text-center">
                            <hr style={{ color: 'black'}} />
                        </Col>
                        <Col xs={6} md={6} lg={6} />
                    </Row>
                    <Row className="mb-15 mt-15">
                        <Col xs={6} md={6} lg={6} />
                        <Col xs={3} md={3} lg={3} style={{ lineHeight: '32px' }}>
                            <b>Display name:</b>
                        </Col>
                        <Col xs={9} md={9} lg={9} >
                            <Row>
                                <Col xs={3} md={3} lg={3} >
                                    <Input placeholder="Mr" value={ title } onChange={(e) => settitle( e.target.value )} />
                                </Col>
                                <Col xs={21} md={21} lg={21} >
                                    <Input value={ displayName } onChange={(e) => setdisplayName( e.target.value )} required/>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={6} md={6} lg={6} />
                    </Row>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6} />
                        <Col xs={3} md={3} lg={3} style={{ lineHeight: '32px' }}>
                            <b>Email:</b>
                        </Col>
                        <Col xs={9} md={9} lg={9} >
                            <Input value={ email } onChange={(e) => setemail( e.target.value )} /> 
                        </Col>
                        <Col xs={6} md={6} lg={6} />
                    </Row>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6} />
                        <Col xs={3} md={3} lg={3} style={{ lineHeight: '32px' }}>
                            <b>Phone number:</b>
                        </Col>
                        <Col xs={9} md={9} lg={9} >
                            <Input value={ sdt } onChange={(e) => setsdt( e.target.value )} placeholder="Enter your phone number"/> 
                        </Col>
                        <Col xs={6} md={6} lg={6} />
                    </Row>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6} />
                        <Col xs={3} md={3} lg={3} style={{ lineHeight: '32px' }}>
                            <b>Account type:</b>
                        </Col>
                        <Col xs={9} md={9} lg={9} >
                            {
                                loaiTaiKhoan == 1 ? (
                                    <>
                                        <Radio.Group onChange={(e) => setloaiTaiKhoan( e.target.value )} value={ loaiTaiKhoan }>
                                            <Radio value={1}>Social account</Radio>
                                            <Radio value={2}>Native account</Radio>
                                        </Radio.Group>
                                    </>
                                ) : (
                                    <>
                                        <Radio.Group value={2}>
                                            <Radio value={1} disabled>Social account</Radio>
                                            <Radio value={2} disabled>Native account</Radio>
                                        </Radio.Group>
                                    </>
                                )
                            }
                        </Col>
                        <Col xs={6} md={6} lg={6} />
                    </Row>
                    {
                        loaiTaiKhoan == 2 && (
                            <>
                                <Row className="mb-15">
                                    <Col xs={6} md={6} lg={6} />
                                    <Col xs={3} md={3} lg={3} style={{ lineHeight: '32px' }}>
                                        <b>Update password:</b>
                                    </Col>
                                    <Col xs={9} md={9} lg={9} >
                                        <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(checked)=>{ setisUpdatePassword(checked) }} />
                                    </Col>
                                    <Col xs={6} md={6} lg={6} />
                                </Row>
                                {
                                    isUpdatePassword && (
                                        <>
                                            {
                                                oldLoaiTaiKhoan != 1 && (
                                                    <>
                                                        <Row className="mb-15">
                                                            <Col xs={6} md={6} lg={6} />
                                                            <Col xs={3} md={3} lg={3} style={{ lineHeight: '32px' }}>
                                                                <b>Old Password:</b>
                                                            </Col>
                                                            <Col xs={9} md={9} lg={9} >
                                                                <Input value={oldPassword } onChange={(e) => setoldPassword( e.target.value )} placeholder="Enter your old pass" /> 
                                                            </Col>
                                                            <Col xs={6} md={6} lg={6} />
                                                        </Row> 
                                                    </>
                                                )
                                            }
                                            <Row className="mb-15">
                                                <Col xs={6} md={6} lg={6} />
                                                <Col xs={3} md={3} lg={3} style={{ lineHeight: '32px' }}>
                                                    <b>New Password:</b>
                                                </Col>
                                                <Col xs={9} md={9} lg={9} >
                                                    <Input value={newPassword } onChange={(e) => setnewPassword( e.target.value )} placeholder="Enter your new pass" /> 
                                                </Col>
                                                <Col xs={6} md={6} lg={6} />
                                            </Row> 
                                            <Row className="mb-50">
                                                <Col xs={6} md={6} lg={6} />
                                                <Col xs={3} md={3} lg={3} style={{ lineHeight: '32px' }}>
                                                    <b>Confirm password:</b>
                                                </Col>
                                                <Col xs={9} md={9} lg={9} >
                                                    <Input value={ confirmPassword } onChange={(e) => setconfirmPassword( e.target.value )} placeholder="Enter confirm the new pass" /> 
                                                </Col>
                                                <Col xs={6} md={6} lg={6} />
                                            </Row>                                         
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                    <Row className="mb-15 mt-50">
                        <Col xs={6} md={6} lg={6} />
                        <Col xs={4} md={4} lg={4} className="text-center">
                            <Popconfirm
                                title="Are you sure to reload form?"
                                onConfirm={ onReset }
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="large" shape="round" className="btn-reset"><b>Reset data</b></Button>
                            </Popconfirm>
                        </Col>
                        <Col xs={4} md={4} lg={4} className="text-center">
                            <Button onClick={ onSubmitUpdate } size="large" shape="round" className="btn-update"><b>Update data</b></Button>
                        </Col>
                        <Col xs={4} md={4} lg={4} className="text-center">
                            <Link to="/">
                                <Button size="large" shape="round" className="btn-back"><b>Home Page</b></Button>
                            </Link>
                        </Col>
                        <Col xs={6} md={6} lg={6} />
                    </Row>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6} />
                        <Col xs={12} md={12} lg={12} className="text-center">
                            <hr />
                        </Col>
                        <Col xs={6} md={6} lg={6} />
                    </Row>
                    <Row className="mb-15">
                        <Col xs={6} md={6} lg={6} />
                        <Col xs={12} md={12} lg={12} className="text-center">
                            <Popconfirm
                                title="Are you sure to logout?"
                                onConfirm={ onLogout }
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="large" shape="round"><b>LOGOUT</b></Button>
                            </Popconfirm>
                        </Col>
                        <Col xs={6} md={6} lg={6} />
                    </Row>                   
                </Col>
            </Row>
        </>
    )
}
