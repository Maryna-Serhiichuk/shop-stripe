import { FC } from 'react'
import { Row, Col, Typography } from 'antd'
import { Section } from './Section'

export const Hero: FC<{title?: string, subtitle?: string}> = ({title, subtitle}) => {
    return (
        <Section>
            <Row justify={'center'}>
                <Typography.Title level={2}>
                    {title}
                </Typography.Title>
            </Row>
            <Row justify={'center'}>
                <Typography.Title level={4} style={{textAlign: 'center'}}>
                    {subtitle}
                </Typography.Title>
            </Row>
        </Section>
    )
}