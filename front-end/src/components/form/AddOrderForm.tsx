import { FC } from 'react'
import { Col, Row, Form, Input, InputNumber, message, Upload, Button, Checkbox, Space } from 'antd'
import { bookGenres, BookGenres } from "../../types/types"
import { instance as axios } from "../../request/axios";

const AddOrderForm: FC = () => {
	const props = {
	  name: 'file',
	  headers: {
	    authorization: 'authorization-text',
	  },
	  onChange(info: any) {
	    if (info.file.status !== 'uploading') {
	      console.log(info.file, info.fileList);
	    }
	    if (info.file.status === 'done') {
	      message.success(`${info.file.name} file uploaded successfully`);
	    } else if (info.file.status === 'error') {
	      message.error(`${info.file.name} file upload failed.`);
	    }
	  },
	}

	const addBook = (value: any) => {
		axios.post('books', ({...value, genres: value.genres.join(', ')}))
			.then(res => console.log(res))
			.catch(err => console.log(err))
		console.log(value)
	}

	return (
		<Form onFinish={addBook}>
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
				<Input placeholder={'Price'}/>
			</Form.Item>
			<Form.Item name={'genres'}>
				<Checkbox.Group options={bookGenres.map((genre, index) => ({ label: genre.charAt(0).toUpperCase() + genre.slice(1), value: genre, style: {width: '50%', marginRight: 0, padding: '2px 0'} }))} />
			</Form.Item>
			<Form.Item name={'description'}>
				<Input.TextArea rows={4} placeholder={'Description'}/>
			</Form.Item>
			<Form.Item>
				<Button htmlType={'submit'} type={'primary'}>
					Add
				</Button>
			</Form.Item>
		</Form>
	)
}

export { AddOrderForm }