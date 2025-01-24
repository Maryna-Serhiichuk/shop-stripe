import {FC, Suspense, useEffect, useState} from 'react'
import {Col, Row, Tooltip} from 'antd'
import {NavLink, Outlet} from 'react-router-dom'
import { Container } from '../sections/Container'
import { Section } from '../sections/Section'
import {instance as axios} from "../../request/axios";
import {Customer} from "../../types/types";

export const Layout: FC = () => {
    return (
        <Col>
            <Header/>
            <Row>
                <Suspense fallback={null}>
                    <Outlet />
                </Suspense>
            </Row>
            <Footer/>
        </Col>
    )
}

const Header: FC = () => {
    return (
        <Container>
            <Row justify={'space-between'} align={'middle'} style={{height: 100}}>
                <Col>
                    <NavLink to={'/'}>LOGO</NavLink>
                </Col>
                <Col>
                    <Row gutter={[30,0]} align={'middle'}>
                        <Col>
                            <NavLink to={'/wish-list'}>Basket</NavLink>
                        </Col>
                        <Col>
                            <NavLink to={'/account'}>
                                <PersonalPhoto/>
                            </NavLink>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

const Footer: FC = () => {
    return (
        <Section theme='footer'>
            Book shop 2022
        </Section>
    )
}

const PersonalPhoto: FC = () => {
    const photoSize = 70
    const [customer, setCustomer] = useState<Customer>()

    useEffect(() => {
        axios.get(`me`)
            .then(res => setCustomer(res.data))
            .catch(err => console.log(err))
    }, [])

    return (
        <div style={{height: photoSize, width: photoSize, }}>
            <Tooltip title={`${customer?.name} ${customer?.surname}`}>
                <img style={{height: '100%', width: '100%', objectFit: 'cover', borderRadius: '50%'}} src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiY_BBq9EJopJ7s6xGctOMFLvDhY7LPCIesM18ezaj&s'} alt={''} />
            </Tooltip>
        </div>
    )
}