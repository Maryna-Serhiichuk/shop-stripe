import { Row, Segmented, List as ListAnt, Col, Card, Typography, Button } from "antd"
import { AppstoreOutlined, BarsOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import {FC, useEffect, useState} from "react"
import { Book } from "../../types/types"
import { NavLink } from "react-router-dom"
import { instance as axios} from "../../request/axios"

type SegmentType = 'horizontal'|'vertical'

const List: FC = () => {
    const [segment, setSegment] = useState<SegmentType>('vertical')
    const [books, setBooks] = useState<Book[]>([])

    useEffect(() => {
        axios.get('books')
            .then(res => setBooks(res.data))
            .catch(err => console.log(err))
    }, [])

    return (
        <Row>
            <Col span={24}>
                <Row>
                    <Segmented
                        onChange={e => setSegment(e as SegmentType)}
                        options={[
                        {
                            value: 'horizontal',
                            icon: <BarsOutlined />,
                        },
                        {
                            value: 'vertical',
                            icon: <AppstoreOutlined />,
                        },
                        ]}
                    />
                </Row>
                <Row>
                    <Col span={24}>
                        <ListAnt
                            grid={{ gutter: 50, column: 4 }}
                            itemLayout={segment}
                            // loadMore={loadMore}
                            dataSource={books}
                            renderItem={(item) => (
                                <ListAnt.Item>
                                    <NavLink to={`/order/${item._id}`}>
                                        <Card
                                            style={{ width: 300 }}
                                            cover={
                                                <img
                                                    style={{height: '300px', objectFit: 'contain'}}
                                                    alt={item.name}
                                                    src={item.image ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrHak2cmeZ0nMuSIToIfPpj319fqI8DgrN5A&usqp=CAU'}
                                                />
                                            }
                                            actions={[
                                                <Button type={'primary'}>
                                                    <ShoppingCartOutlined />
                                                </Button>,
                                                <Typography.Title level={5}>{item.price} $</Typography.Title>
                                            ]}
                                        >
                                            <Card.Meta
                                                title={item.name}
                                                description={item.description.substring(0, 100)}
                                            />
                                        </Card>
                                    </NavLink>
                                </ListAnt.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export { List }