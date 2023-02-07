import {Row, Segmented, List as ListAnt, Col, Card, Typography, Button, Form, Input, Space} from "antd"
import { AppstoreOutlined, BarsOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import {FC, useEffect, useState} from "react"
import { Book } from "../../types/types"
import {NavLink} from "react-router-dom"
import { instance as axios} from "../../request/axios"
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined, HistoryOutlined } from '@ant-design/icons';

type SegmentType = 'horizontal'|'vertical'

const List: FC = () => {
    const [segment, setSegment] = useState<SegmentType>('vertical')
    const [books, setBooks] = useState<Book[]>([])
    const [reqQuery, setReqQuery] = useState<{ [key: string]: string }>({
        search: '',
        sort: 'newer'
    })

    const [me, setMe] = useState(true)

    useEffect(() => {
        axios.get(`books?${Object.keys(reqQuery).map(key => `${key}=${reqQuery[key]}`).join('&')}`)
            .then(res => setBooks(res.data))
            .catch(err => console.log(err))
    }, [reqQuery])

    const filter = (value: {value: string}) => {
        setReqQuery(prev => ({...prev, search: value.value}))
    }

    return (
        <Row>
            <Col span={24}>
                <Space size={50} direction={'vertical'} style={{width: '100%'}}>
                    <Row justify={'space-between'}>
                        <Form layout="inline" onFinish={filter}>
                            <Form.Item name={'value'} style={{width:280}}>
                                <Input placeholder={'Search'} />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType={'submit'} type="primary" icon={<SearchOutlined />}/>
                            </Form.Item>
                        </Form>
                        <Col>
                            <Space size={20}>
                                <Segmented
                                    onChange={e => setReqQuery(prev => ({...prev, sort: e as string}))}
                                    options={[
                                        {
                                            value: 'newer',
                                            icon: <HistoryOutlined />,
                                        },
                                        {
                                            value: 'cheaper',
                                            icon: <SortAscendingOutlined />,
                                        },
                                        {
                                            value: 'expensive',
                                            icon: <SortDescendingOutlined />,
                                        },
                                    ]}
                                />
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
                            </Space>
                        </Col>
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
                                                style={{ width: 300, overflow:'hidden' }}
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
                </Space>
            </Col>
        </Row>
    )
}

export { List }