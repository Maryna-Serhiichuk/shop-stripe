import { FC } from 'react'
import { Row, Col } from 'antd'
import { Section } from "../../components/sections/Section"
import { AddOrderForm } from '../../components/form/AddOrderForm'

const AddOrder: FC = () => {
	return (
		<Section>
			<Row justify={'center'}>
				<Col span={8}>
					<AddOrderForm/>
				</Col>
			</Row>
		</Section>
	)
}

export default AddOrder