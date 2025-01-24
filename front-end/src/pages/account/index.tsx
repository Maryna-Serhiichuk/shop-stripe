import {FC, useState} from "react";
import {Section} from "../../components/sections/Section";
import {Button, Col, Row, Typography} from "antd";
import {useApp} from "../../App";
import { instance as axios} from "../../request/axios"

const Account: FC = () => {
    const { auth } = useApp()
    const me = auth.me

    return (
        <Section>
            <Row>
                <Col>
                    <Row>
                        <Typography.Title>
                            {me?.name} {me?.surname}
                        </Typography.Title>
                    </Row>
                    <Row>
                        <Typography.Title level={3}>
                            {me?.email}
                        </Typography.Title>
                    </Row>
                </Col>
            </Row>
        </Section>
    )
}

export { Account as default }