import {FC, Suspense} from "react";
import {Col, Row, Tabs, Typography} from "antd";
import {NavLink, Outlet, useLocation} from "react-router-dom";
import {Section} from "../sections/Section";

const navigation = [
    { label: 'Wish List', url: '/wish-list' },
    { label: 'My Purchases', url: '/my-purchases' },
]

const MyOrderListLayout: FC = () => {
    const { pathname } = useLocation()
    return (
        <Section>
            <Row>
                <Col span={24}>
                    <Tabs
                        defaultActiveKey={pathname}
                        activeKey={pathname}
                        size={'large'}
                        type={'line'}
                        items={navigation?.map(it => ({
                            label: <NavLink to={it.url} style={{display:'block',padding:'16px 0'}}>{it.label}</NavLink>,
                            key: it.url,
                            children: <Typography.Title level={3}>{it.label}</Typography.Title>
                        }))}
                    />
                </Col>
                <Suspense fallback={null}>
                    <Outlet />
                </Suspense>
            </Row>
        </Section>
    )
}

export { MyOrderListLayout }