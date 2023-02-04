import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {Button, Checkbox, Col, Form, Input, InputNumber, List, Row, Space, Tooltip, Typography} from "antd";
import {useLocalStorage} from "react-use";
import {instance as axios} from "../../request/axios";
import {Book} from "../../types/types";
import {NavLink} from "react-router-dom";
import {useLocalStorageWishList, wishListLabel, WishListType} from "../../components/hook/useLocalStorageWishList";

const WishList: FC = () => {
    const [value, setValue] = useLocalStorage(wishListLabel, '')
    const [orders, setOrders] = useState<Book[] | undefined>()
    const [checkedOrders, setCheckedOrders] = useState<WishListType[]>([])
    const {deleteFromWishList, wishListIds} = useLocalStorageWishList(value ?? '')
    const [isDeliveryForm, setDeliveryFormState] = useState(false)

    useEffect(() => {
        axios.post(`wish-list`, ({list: !isDeliveryForm ? wishListIds : checkedOrders.map(it => it.id) }))
            .then(res => setOrders(res.data))
            .catch(err => console.log(err))

        if(!checkedOrders.length){
            setDeliveryFormState(false)
        }

    }, [value, isDeliveryForm, checkedOrders])

    const byOrders = (value: any) => {
        axios.post('by-books', ({list: checkedOrders, metadata: value}))
            .then(res => window.location.replace(res?.data?.checkoutUrl))
            .catch(err => console.log('err', err))
    }

    const deleteFromShoppingCart = (id:string) => {
        setValue(deleteFromWishList(id))
    }

    return <Space size={70} direction={'vertical'} style={{width:'100%'}}>
        <WishListList list={orders as Book[]} setChecked={setCheckedOrders} setLocalStorage={deleteFromShoppingCart}/>
        <Row>
            <Col span={24}>
                <Form onFinish={byOrders}>
                    { isDeliveryForm &&
                        <Col span={6}>
                            <DeliveryForm/>
                        </Col>
                    }
                    <Space size={12}>
                        { !isDeliveryForm &&
                            <Tooltip title={!checkedOrders.length ? 'Choose a order' : undefined}>
                                <Button disabled={!checkedOrders.length} type={'primary'} onClick={() => setDeliveryFormState(true)}>
                                    Make a delivery
                                </Button>
                            </Tooltip>
                        }
                        { isDeliveryForm && <Button htmlType={'submit'} type={'primary'}>Pay Selected</Button> }
                        { isDeliveryForm && <Button onClick={() => setDeliveryFormState(false)}>Cancel</Button> }
                    </Space>
                </Form>
            </Col>
        </Row>
    </Space>
}

const WishListList: FC<{list: Book[], setChecked: Dispatch<SetStateAction<WishListType[]>>, setLocalStorage: (id:string) => void}> = ({list, setChecked, setLocalStorage}) => {
    return (
        <List
            itemLayout="vertical"
            size="large"
            dataSource={list}
            renderItem={(item) => (
                <List.Item key={item._id} style={{height:250}}>
                    <WishListCard setChecked={setChecked} item={item} setLocalStorage={setLocalStorage}  />
                </List.Item>
            )}
        />
    )
}

const WishListCard: FC<{item: Book, setLocalStorage: (id:string) => void, setChecked: Dispatch<SetStateAction<WishListType[]>>}> = ({item,setLocalStorage, setChecked}) => {
    const [numbers, setNumbers] = useState<number>(1)

    useEffect(() => {
        setChecked(prev => prev.map(it => it.id === item._id ? ({...it, numbers}) : it))
    }, [numbers])

    const byOrder = () => {
        axios.post('by-books', ({list: [item._id]}))
            .then(res => window.location.replace(res?.data?.checkoutUrl))
            .catch(err => console.log('err', err))
    }

    return (
        <Row>
            <Col span={1}>
                <Row align={'middle'} style={{height:'100%'}}>
                    <Checkbox onChange={e => {
                        if(e.target.checked){
                            setChecked(prev => prev.concat({id:item._id,numbers}))
                        } else {
                            setChecked(prev => prev.filter(it => item._id !== it.id))
                        }
                    }} />
                </Row>
            </Col>
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
                                    <NavLink to={`/order/${item._id}`}>{item.name}</NavLink>
                                </Col>
                                <Col>
                                    <Row>
                                        <Typography.Text>
                                            $ {item.price}
                                        </Typography.Text>
                                    </Row>
                                </Col>
                            </Row>
                            <Row justify={'space-between'} style={{fontSize:18}}>
                                {item.genres}
                            </Row>
                        </Col>
                    </Row>
                    <Row justify={'space-between'} style={{width:'100%'}}>
                        <Row align={'bottom'}>
                            <Form onValuesChange={value => setNumbers(value.numbers)} initialValues={{numbers: 1}} layout={'inline'}>
                                <Form.Item name={'numbers'}>
                                    <InputNumber />
                                </Form.Item>
                            </Form>
                        </Row>
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
        </Row>
    )
}

const DeliveryForm: FC = () => {
    return (
        <>
            <Form.Item name={'delivery_address_city'}>
                <Input placeholder={'City'} />
            </Form.Item>
            <Form.Item name={'delivery_address_number'}>
                <InputNumber placeholder={'Number of Nova Poshta'}/>
            </Form.Item>
            <Form.Item name={'delivery_client_name'}>
                <Input placeholder={'First Name'} />
            </Form.Item>
            <Form.Item name={'delivery_client_surname'}>
                <Input placeholder={'Last Name'} />
            </Form.Item>
            <Form.Item name={'delivery_client_phone'}>
                <Input placeholder={'Phone'} />
            </Form.Item>
        </>
    )
}

export { WishList as default }