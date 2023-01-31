import {FC} from "react";
import {Section} from "../../components/sections/Section";
import {Button, Col, Row, Typography} from "antd";
import {NavLink} from "react-router-dom";

const Success: FC = () => {
    return <Section>
        <Typography.Title level={2}>The Payment is Success</Typography.Title>
        <Row gutter={[20,0]}>
            <Col>
                <NavLink to={'shopping-cart'}>
                    <Button type={'primary'}>Return to my Wish List</Button>
                </NavLink>
            </Col>
            <Col>
                <NavLink to={'catalog'}>
                    <Button>Go to Catalog</Button>
                </NavLink>
            </Col>
        </Row>
    </Section>
}

export { Success as default }