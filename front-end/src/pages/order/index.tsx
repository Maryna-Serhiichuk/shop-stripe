import { Button, Col, Row, Typography } from "antd";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { Section } from "../../components/sections/Section";
import { Book } from "../../types/types";
import { list } from "../catalog/List";

const Order: FC = () => {
    const { id } = useParams()
    const order: Book = list.filter(item => item.id === id)?.[0]

    return (
        <Section>
            <Row>
                <Col span={12}>
                    <Row>
                        <img src={order.image} alt={order.name} />
                    </Row>
                </Col>
                <Col span={12}>
                    <Typography.Title level={3}>
                        {order.name}
                    </Typography.Title>
                    <Typography.Title level={4}>
                        {order.author}
                    </Typography.Title>
                    <Typography.Title level={4}>
                        {order.year}
                    </Typography.Title>
                    <Typography.Title level={4}>
                        {order.genres.join(', ')}
                    </Typography.Title>
                </Col>
            </Row>
            <Row>
                <Typography.Paragraph>
                    {order.description}
                </Typography.Paragraph>
            </Row>
            <Row justify={'space-between'}>
                <Col>
                    <Typography.Title>
                        {order.price} $
                    </Typography.Title>
                </Col>
                <Col>
                    <Button type={'primary'} size={'large'}>
                        BY
                    </Button>
                </Col>
            </Row>
        </Section>
    )
}

export default Order