import { Button, Col, Row, Typography, Space } from "antd";
import {FC, useEffect, useState} from "react";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import { Section } from "../../components/sections/Section";
import { Book } from "../../types/types";
import { instance as axios } from "../../request/axios";
import {useLocalStorage} from "react-use";
import {useLocalStorageWishList, wishListLabel} from "../../components/hook/useLocalStorageWishList";

const Order: FC = () => {
    const navigation = useNavigate()
    const { id } = useParams()
    const [book, setBook] = useState<Book | null>(null)
    const [value, setValue, remove] = useLocalStorage(wishListLabel, '')
    const {addToWishList} = useLocalStorageWishList(value ?? '')

    useEffect(() => {
        axios.get(`book/${id}`)
            .then(res => setBook(res.data))
            .catch(err => console.log(err))
    }, [])

    const toShoppingCart = () => {
        setValue(addToWishList(id as string))
    }

    const byOrder = () => {
        axios.post('by-book', ({id: id}))
            .then(res => window.location.replace(res?.data?.checkoutUrl))
            .catch(err => console.log('err', err))
    }

    const deleteOrder = () => {
        axios.delete(`/book/${id}`)
            .then(res => res.data === 'OK' && navigation('success'))
            .catch(err => console.log(err))
    }

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
                        <Row gutter={[24,0]}>
                            <Col>
                                <Button onClick={toShoppingCart} type={'primary'} size={'large'}>
                                    Add to Wish List
                                </Button>
                            </Col>
                            <Col>
                                <Button onClick={deleteOrder} size={'large'}>
                                    Delete Order
                                </Button>
                            </Col>
                            <Col>
                                <NavLink to={`/edit-order/${id}`}>
                                    <Button size={'large'}>
                                        Edit Order
                                    </Button>
                                </NavLink>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Space>
        </Section>
    )
}

export default Order