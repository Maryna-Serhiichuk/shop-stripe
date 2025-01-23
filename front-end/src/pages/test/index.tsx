import {FC, useState} from "react";
import {Button, Col, Row, Space} from "antd";
import {instance as axios} from "../../request/axios";

const accountId = 'acct_1MootuRkDRLIf4LK'
const customerId = 'cus_Na2sfdpBFWVZE6'
// const productId = 'prod_Na31ETpYxuPh9u'
const priceId = 'price_1MorKcDuM9KePQht1jtV9YHd'

const Test: FC = () => {
    return (
        <Col span={24}>
            <Space size={20} direction={'vertical'} style={{width:'100%'}}>
                <Onboarding/>
                <Subscribe/>
            </Space>
        </Col>
    )
}

export { Test as default }

const Subscribe: FC = () => {
    const subscribe = () => {
        axios.post('subscribe', {customerId, accountId, priceId})
            .then(res => console.log(res)) // standard
            .catch(err => console.log('error', err))
    }
    return <Row gutter={[10, 0]}>
        <Col>
            <Button type={'primary'} onClick={subscribe}>
                Subscribe
            </Button>
        </Col>
    </Row>
}

const Onboarding: FC = () => {
    const [link, setLink] = useState('')

    const onboarding = () => {
        axios.post('connect', {email: 'test3333@gmail.com'})
            // .then(res => setLink(res?.data?.url)) // express
            // .then(res => setLink(res?.data?.data?.url)) // custom
            .then(res => setLink(res?.data?.url)) // standard
            .catch(err => console.log('error', err))
    }

    return <Row gutter={[10, 0]}>
        <Col>
            <Button type={'primary'} onClick={onboarding}>
                Account onboarding
            </Button>
        </Col>
        {link &&
            <Col>
                <Button href={link} target={'_blank'} type={'primary'}>
                    Link
                </Button>
            </Col>
        }
    </Row>
}