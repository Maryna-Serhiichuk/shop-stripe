import express, {Response} from 'express'
import { client } from './client'
import { url } from './connect'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types/requestTypes";
import {CreateBook, QueryBook, UpdateBook} from "./types/Book";
import { Book } from './models/book'
import cors from 'cors'

const app = express()

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:true});

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.use(cors({ origin: '*' }))

const port = 3030

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NOT_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,

	SERVER_500: 500
}

app.route('/books')
	.get(async (req: RequestWithQuery<QueryBook>, res: Response<QueryBook[]>)  => {
		const books: QueryBook[] = await Book.find()
		res.json(books)
	})
	.post(urlencodedParser, async (req: RequestWithBody<CreateBook>, res: Response<QueryBook>) => {
		const { name, year, author, description, genres, price } = req.body
		if(!author || !year || !name || !description || !genres || !price){
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
			return
		}

		const book = new Book({ name, year, author, description, genres, price })
		book.save()
			.then(_ => res.sendStatus(HTTP_STATUSES.CREATED_201))
			.catch(err => res.sendStatus(HTTP_STATUSES.SERVER_500))
	})

app.route('/book/:id')
	.get(async (req: RequestWithParams<{id: string}>, res: Response<QueryBook>) => {
		const id = req.params.id
		const instance: QueryBook | null = await Book.findById(id)
		if(instance) {
			res.json(instance)
			return
		}
		res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
	})
	.delete(async (req: RequestWithParams<{id: string}>, res: Response<QueryBook>) => {
		const id = req.params.id
		await client.connect()
		const books = await client.db().collection('books')
		await books.deleteOne({_id: new ObjectId(id)}) // const book: QueryBook =
		res.sendStatus(HTTP_STATUSES.OK_200)
	})
	.put(urlencodedParser, async (req: RequestWithParamsAndBody<{id: string}, UpdateBook>, res: Response<QueryBook>) => {
		const id = req.params.id
		if(req.body.author || req.body.year || req.body.name){
			// || req.body.price
			await client.connect()
			const books = client.db().collection('books')
			const result = await books.updateOne(
				{_id: new ObjectId(id)},
				{$set: {...req.body}}
			)
			if(result.acknowledged){
				// const book = await books.findOne({_id: new ObjectId(id)})
				res.sendStatus(HTTP_STATUSES.OK_200)
				return
			}
			res.sendStatus(HTTP_STATUSES.SERVER_500)
			return
		}

		res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		return
	})

mongoose
	.connect(url)
	.then(res => console.log('Connect to mongoose'))
	.catch(err => console.log('mongoose error', err))

app.listen(port, () => {
    console.log(`listen port ${port}`)
})