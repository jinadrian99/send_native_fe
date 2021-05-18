import { Col, Menu, Row } from 'antd'
import React from 'react'

const { SubMenu } = Menu;

export default function Navbar() {
    return (
        <>
            <Row align="middle" style={{ height: "8vh" }}>
                <Col xs={2} md={6} lg={9}>
                    <Menu mode="horizontal">
                        <Menu.Item>
                            <a href="/about">About</a>
                        </Menu.Item>
                        <Menu.Item>
                            Rates
                        </Menu.Item>
                        <SubMenu title="Room Type">
                            <Menu.Item>Option 1</Menu.Item>
                            <Menu.Item>Option 2</Menu.Item>
                            <Menu.Item>Option 3</Menu.Item>
                            <Menu.Item>Option 4</Menu.Item>
                        </SubMenu>
                        <SubMenu title="Service">
                            <Menu.Item>Option 1</Menu.Item>
                            <Menu.Item>Option 2</Menu.Item>
                            <Menu.Item>Option 3</Menu.Item>
                            <Menu.Item>Option 4</Menu.Item>

                        </SubMenu>
                    </Menu>
                </Col>
                <Col xs={20} md={12} lg={6} style={{ textAlign: "center", borderBottom: "1px solid #F0F0F0", height: "48px" }}>
                    <div style={{ display: "inline-block", fontSize: "3.7vh" }}><b>NATIVE HOTEL</b></div>
                </Col>
                <Col xs={0} md={2} lg={3} style={{ borderBottom: "1px solid #F0F0F0", height: "48px" }}></Col>
                <Col xs={2} md={4} lg={6} style={{ textAlign: "right" }}>
                    <Menu mode="horizontal">
                        <Menu.Item>
                            About
                        </Menu.Item>
                        <Menu.Item>
                            Rates
                        </Menu.Item>
                        <SubMenu title="Room Type">
                            <Menu.Item>Option 1</Menu.Item>
                            <Menu.Item>Option 2</Menu.Item>
                            <Menu.Item>Option 3</Menu.Item>
                            <Menu.Item>Option 4</Menu.Item>
                        </SubMenu>
                        <SubMenu title="Service">
                            <Menu.Item>Option 1</Menu.Item>
                            <Menu.Item>Option 2</Menu.Item>
                            <Menu.Item>Option 3</Menu.Item>
                            <Menu.Item>Option 4</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Col>
            </Row>
        </>
    )
}