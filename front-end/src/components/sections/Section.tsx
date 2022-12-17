import { Col, Row } from 'antd'
import { FC, PropsWithChildren} from 'react'
import { Container } from './Container'

type SectionColorType = 'light' | 'dark' | 'footer'

type SectionType = {
    theme?: SectionColorType
}

export const Section: FC<PropsWithChildren<SectionType>> = ({theme = 'light', children}) => {
    const themeColor = {
        light: 'white',
        dark: '#f8f8f8',
        footer: 'black'
    }
    const colorFontSize = theme === 'footer' ? 'white' : 'auto'
    return (
        <Row  style={{width: '100%', padding: '70px 0', background: themeColor[theme], color: colorFontSize}}>
            <Col span={24}>
                <Container>
                    {children}
                </Container>
            </Col>
        </Row>
    )
}