import { FC } from 'react'
import { Col, Row } from 'antd'
import { Outlet } from 'react-router-dom'
import { Container } from '../sections/Container'
import { Section } from '../sections/Section'

export const Layout: FC = () => {
    return (
        <Col>
            <Header/>
            <Row>
                <Outlet />
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
                    LOGO
                </Col>
                <Col>
                    <PersonalPhoto/>
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
    return (
        <div style={{height: photoSize, width: photoSize, }}>
            <img style={{height: '100%', width: '100%', objectFit: 'cover', borderRadius: '50%'}} src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiY_BBq9EJopJ7s6xGctOMFLvDhY7LPCIesM18ezaj&s'} />
        </div>
    )
}