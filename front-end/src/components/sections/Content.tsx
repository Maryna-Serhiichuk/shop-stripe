import { Col, Row, Image, Typography, Button, Space } from 'antd'
import { FC } from 'react'

type ContentType = {
    image: string
    title: string
    subtitle: string
    button: {
        text: string
        href: string
    }
    imagePosition?: 'left' | 'right'
}

export const Content: FC<ContentType> = ({image, title, subtitle, button, imagePosition}) => {
    const changedDefaultPosition = imagePosition === 'right'
    return (
        <Row justify='space-between' align='middle'>
            <Col order={!changedDefaultPosition ? 1 : 2} span={11}>
                <Image src={image} preview={false} />
            </Col>
            <Col order={!changedDefaultPosition ? 2 : 1} span={11}>
                <Row justify='center' align='middle' style={{flexDirection: 'column'}}>
                    <Col>
                        <Space size={30} direction={'vertical'}>
                            <Row>
                                <Typography.Title level={2}>{title}</Typography.Title>
                                <Typography.Title level={3}>{subtitle}</Typography.Title>
                            </Row>
                            <Row style={{width: '100%'}}>
                                <Button href={button.href} size='large' type='primary' style={{width: '30%'}}>
                                    {button.text}
                                </Button>
                            </Row>
                        </Space>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}