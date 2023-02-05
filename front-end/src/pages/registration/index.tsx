import {FC} from "react";
import {Col, Divider, Form, Input, Row, Typography, Select, Button} from "antd";
import {instance as axios} from "../../request/axios";

type RegistrationType = {
    email: string
    password: string
    name: string
    surname: string
    phone: string
}

const Registration: FC = () => {

    const onRegistration = (value: RegistrationType) => {
        const result: RegistrationType = {
            ...value,
            phone: `0${value.phone.replaceAll(' ', '')}`
        }

        axios.post(`/registration`, result)
            .then(res => console.log(res.status === 201))
            .catch(err => console.log(err))
    }

    return <Row justify={'center'}>
        <Col span={24}>
            <Row justify={'center'}>
                <Typography.Title level={2}>
                    Registration
                </Typography.Title>
            </Row>
        </Col>
        <Col span={8}>
            <Form onFinish={onRegistration}>
                <Form.Item name={'name'}>
                    <Input placeholder={'Name'} />
                </Form.Item>
                <Form.Item name={'surname'}>
                    <Input placeholder={'Surname'} />
                </Form.Item>
                <Form.Item
                    name={'phone'}
                    getValueFromEvent={e => {
                        const value = e.target.value
                        if(e.nativeEvent.data === null) {
                            return value
                        } else if(value.length === 2 || value.length === 6 || value.length === 9){
                            return value + ' '
                        }
                        return value
                    }}
                    rules={[
                        { required: true, message: 'Please input your phone number!' },
                        () => ({
                            validator(_, value) {
                                if (value) {
                                    if(!(/^(50|95|99|63|73|93|67|68|96|97|98)\s[0-9]{3}\s[0-9]{2}\s[0-9]{2}$/.test(value))){
                                        return Promise.reject(new Error('Invalid phone'))
                                    }
                                    return Promise.resolve()
                                }
                            },
                        }),
                    ]}
                >
                    <Input placeholder={'Phone'} prefix={'+380'} />
                </Form.Item>
                <Divider/>
                <Form.Item
                    name={'email'}
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input placeholder={'Email'} />
                </Form.Item>
                <Form.Item
                    name={'password'}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder={'Password'} />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder={'Confirm Password'} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType={'submit'} type={'primary'}>Sing Up</Button>
                </Form.Item>
            </Form>
        </Col>
    </Row>
}

export { Registration as default }