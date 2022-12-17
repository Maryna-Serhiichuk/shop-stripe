import { FC, ReactNode } from 'react'
import { Col, Row } from 'antd'

export const Container: FC<{children: ReactNode}> = ({children}) => {
    return (
        <Row justify={'center'} style={{width: '100%'}}>
            <Col style={{width: 1300}}>
                {children}
            </Col>
        </Row>
    )
}