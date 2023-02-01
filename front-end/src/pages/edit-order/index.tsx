import {FC, useEffect, useState} from "react";
import {Button, Checkbox, Col, Form, Input, InputNumber, Row} from "antd";
import {Section} from "../../components/sections/Section";
import {useNavigate, useParams} from "react-router-dom";
import {Book, bookGenres} from "../../types/types";
import {instance as axios} from "../../request/axios";

const EditOrder: FC = () => {
    const navigation = useNavigate()
    const separator = ', '
    const { id } = useParams()
    const [book, setBook] = useState<Book>()
    const [changedBook, setChangedBook] = useState<Book>()

    useEffect(() => {
        id && axios.get(`book/${id}`)
            .then(res => setBook({...res.data, genres: res.data.genres.split(separator)}))
            .catch(err => console.log(err))
    }, [])

    const changeBook = (value: any) => {
        axios.put(`/book/${id}`, ({...changedBook, genres: changedBook?.genres?.join(separator)}))
            .then(res => res.data === 'OK' && navigation('/catalog'))
            .catch(err => console.log('err',err))
    }

    return <Section>
        <Row justify={'center'}>
            <Col span={8}>
                {book &&
                    <Form<Book>
                        onFinish={changeBook}
                        initialValues={book}
                        onValuesChange={e => setChangedBook(prev => prev ? ({...prev, ...e}) : e)}
                    >
                        {/*<Form.Item name={'image'}>*/}
                        {/*	<Upload {...props} listType={'picture'} action={'/api/upload'} name={'file'}>*/}
                        {/*	    <Button icon={<UploadOutlined />}>Click to Upload</Button>*/}
                        {/*	</Upload>*/}
                        {/*</Form.Item>*/}
                        <Form.Item name={'name'}>
                            <Input placeholder={'Name'}/>
                        </Form.Item>
                        <Form.Item name={'author'}>
                            <Input placeholder={'Author'}/>
                        </Form.Item>
                        <Form.Item name={'year'}>
                            <Input placeholder={'Year'}/>
                        </Form.Item>
                        <Form.Item name={'price'}>
                            <InputNumber placeholder={'Price'}/>
                        </Form.Item>
                        <Form.Item name={'genres'}>
                            <Checkbox.Group options={bookGenres.map((genre, index) => ({
                                label: genre.charAt(0).toUpperCase() + genre.slice(1),
                                value: genre,
                                style: {width: '50%', marginRight: 0, padding: '2px 0'}
                            }))} />
                        </Form.Item>
                        <Form.Item name={'description'}>
                            <Input.TextArea rows={4} placeholder={'Description'}/>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType={'submit'} type={'primary'}>
                                Change
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </Col>
        </Row>
    </Section>
}

export { EditOrder as default }