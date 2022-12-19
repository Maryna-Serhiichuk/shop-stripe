import { Button, Col, Row, Typography, Space } from "antd";
import {FC, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Section } from "../../components/sections/Section";
import { Book } from "../../types/types";
import { instance as axios } from "../../request/axios";

const Order: FC = () => {
    const { id } = useParams()
    const [book, setBook] = useState<Book | null>(null)

    useEffect(() => {
        axios.get(`book/${id}`)
            .then(res => setBook(res.data))
            .catch(err => console.log(err))
    }, [])

    return (
        <Section>
            <Space size={50} direction={'vertical'} style={{width: '100%'}}>
                <Row>
                    <Col span={12}>
                        <Row>
                            <img src={book?.image ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrHak2cmeZ0nMuSIToIfPpj319fqI8DgrN5A&usqp=CAU'} alt={book?.name} />
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Typography.Title level={3}>
                            {book?.name}
                        </Typography.Title>
                        <Typography.Title level={4}>
                            {book?.author}
                        </Typography.Title>
                        <Typography.Title level={4}>
                            {book?.year}
                        </Typography.Title>
                        <Typography.Title level={4}>
                            {book?.genres}
                        </Typography.Title>
                    </Col>
                </Row>
                <Row>
                    <Typography.Paragraph style={{fontSize: 20}}>
                        {book?.description}
                    </Typography.Paragraph>
                </Row>
                <Row justify={'space-between'}>
                    <Col>
                        <Typography.Title>
                            {book?.price} $
                        </Typography.Title>
                    </Col>
                    <Col>
                        <Button type={'primary'} size={'large'}>
                            BY
                        </Button>
                    </Col>
                </Row>
            </Space>
        </Section>
    )
}

export default Order