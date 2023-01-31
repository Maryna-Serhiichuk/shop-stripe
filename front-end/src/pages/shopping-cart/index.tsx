import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {Section} from "../../components/sections/Section";
import {Avatar, Button, Checkbox, Col, List, Row, Space, Typography} from "antd";
import {useLocalStorage} from "react-use";
import {instance as axios} from "../../request/axios";
import {Book} from "../../types/types";
import {NavLink} from "react-router-dom";

const ShoppingCart: FC = () => {
    const separator = ', '
    const [value, setValue] = useLocalStorage('shopping-card', '')
    const orderIds = value as string
    const [orders, setOrders] = useState<Book[]>()
    const [checkedOrders, setCheckedOrders] = useState<string[]>([])

    useEffect(() => {
        axios.post(`shopping-cart`, ({list: orderIds?.split(separator)}))
            .then(res => setOrders(res.data))
            .catch(err => console.log(err))
    }, [value])

    const byOrders = () => {
        axios.post('by-books', ({list: checkedOrders}))
            .then(res => window.location.replace(res?.data?.checkoutUrl))
            .catch(err => console.log('err', err))
    }

    const deleteFromShoppingCart = (id:string) => {
        setValue(value?.split(separator).filter(it => it !== id).join(separator))
    }

    return <Section>
        <Space size={70} direction={'vertical'} style={{width:'100%'}}>
            <ShoppingCartList list={orders as Book[]} setChecked={setCheckedOrders} setLocalStorage={deleteFromShoppingCart}/>
            <Button type={'primary'} onClick={byOrders}>Pay Selected</Button>
        </Space>
    </Section>
}

const ShoppingCartList: FC<{list: Book[], setChecked: Dispatch<SetStateAction<string[]>>, setLocalStorage: (id:string) => void}> = ({list, setChecked, setLocalStorage}) => {
    return (
        <List
            itemLayout="vertical"
            size="large"
            dataSource={list}
            renderItem={(item) => (
                <List.Item key={item._id} style={{height:250}}>
                    <Row>
                        <Col span={1}>
                            <Row align={'middle'} style={{height:'100%'}}>
                                <Checkbox onChange={e => {
                                    console.log(e.target.checked)
                                    if(e.target.checked){
                                        setChecked(prev => prev.concat(item._id))
                                    } else {
                                        setChecked(prev => prev.filter(it => item._id !== it))
                                    }
                                }} />
                            </Row>
                        </Col>
                        <ShoppingCartCard item={item} setLocalStorage={setLocalStorage}  />
                    </Row>
                </List.Item>
            )}
        />
    )
}

const ShoppingCartCard: FC<{item: Book, setLocalStorage: (id:string) => void}> = ({item,setLocalStorage}) => {
    const byOrder = () => {
        axios.post('by-book', ({id: item._id}))
            .then(res => window.location.replace(res?.data?.checkoutUrl))
            .catch(err => console.log('err', err))
    }

    return (
        <>
            <Col span={6}>
                <img
                    height={'100%'}
                    alt="img"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrHak2cmeZ0nMuSIToIfPpj319fqI8DgrN5A&usqp=CAU"
                />
            </Col>
            <Col span={17}>
                <Row justify={'space-between'} style={{height:'100%'}}>
                    <Row style={{width:'100%'}}>
                        <Col span={24}>
                            <Row justify={'space-between'} style={{fontSize:24}}>
                                <Col>
                                    <NavLink to={`book/${item._id}`}>{item.name}</NavLink>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        $ {item.price}
                                    </Typography.Text>
                                </Col>
                            </Row>
                            <Row style={{fontSize:18}}>
                                {item.genres}
                            </Row>
                        </Col>
                    </Row>
                    <Row justify={'end'} style={{width:'100%'}}>
                        <Row gutter={[16, 0]} align={'bottom'}>
                            <Col>
                                <Button onClick={() => setLocalStorage(item._id)}>Delete from Shopping Cart</Button>
                            </Col>
                            <Col>
                                <Button onClick={byOrder} type={'primary'}>Buy</Button>
                            </Col>
                        </Row>
                    </Row>
                </Row>
            </Col>
        </>
    )
}

export { ShoppingCart as default }