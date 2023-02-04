import {FC, useEffect, useState} from "react";
import {instance as axios} from "../../request/axios";
import {Book} from "../../types/types";
import {useLocalStorageWishList, wishListLabel} from "../../components/hook/useLocalStorageWishList";
import {useLocalStorage} from "react-use";
import {Col, List, Row, Skeleton} from "antd";
import {NavLink} from "react-router-dom";

const MyPurchases: FC = () => {
    const [value] = useLocalStorage(wishListLabel, '')
    const [orders, setOrders] = useState<Book[] | undefined>()
    const {wishListIds} = useLocalStorageWishList(value ?? '')

    console.log(orders)

    useEffect(() => {
        axios.post(`wish-list`, ({list: wishListIds }))
            .then(res => setOrders(res.data))
            .catch(err => console.log(err))

    }, [])

    return (
        <Row style={{width:'100%'}}>
            <Col span={24}>
                <List
                    className="demo-loadmore-list"
                    // loading={initLoading}
                    itemLayout="horizontal"
                    // loadMore={loadMore}
                    dataSource={orders as Book[]}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <a>add comment</a>,
                                <NavLink to={`/order/${item?._id}`} >more</NavLink>
                            ]}
                        >
                            <Skeleton avatar title={false} loading={false} active>
                                <List.Item.Meta
                                    avatar={<img height={100} src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrHak2cmeZ0nMuSIToIfPpj319fqI8DgrN5A&usqp=CAU'} alt={''}/>}
                                    title={<NavLink to={`/order/${item?._id}`}>{item?.name}</NavLink>}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                                <Row>$ {item?.price}</Row>
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </Col>
        </Row>
    )
}

export { MyPurchases as default }