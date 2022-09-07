import express, {Response} from 'express'
import { client } from './client'
import { ObjectId } from 'mongodb'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types/requestTypes";
import {CreateBook, QueryBook, UpdateBook} from "./types/Book";

const app = express()

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:true});

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

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
		await client.connect()
		const books: QueryBook[] = await client.db().collection('books').find({}).limit(10).toArray()
		res.json(books)
	})
	.post(urlencodedParser, async (req: RequestWithBody<CreateBook>, res: Response<QueryBook>) => {
		if(!req.body.author || !req.body.year || !req.body.name){
			// || !req.body.price
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
			return
		}

		await client.connect()
		const books = client.db().collection('books')
		const result = await books.insertOne(req.body)
		if(result.acknowledged){
			// const book = await books.findOne({_id: result.insertedId})
			res.sendStatus(HTTP_STATUSES.CREATED_201)
			return
		}
		res.sendStatus(HTTP_STATUSES.SERVER_500)
	})

app.route('/books/:id')
	.get(async (req: RequestWithParams<{id: string}>, res: Response<QueryBook>) => {
		const id = req.params.id
		await client.connect()
		const books = await client.db().collection('books')
		const book: QueryBook = await books.findOne({_id: new ObjectId(id)})
		res.sendStatus(HTTP_STATUSES.OK_200).json(book)
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

app.listen(port, () => {
    console.log(`listen port ${port}`)
})