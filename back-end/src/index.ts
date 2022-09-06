import express, {Response} from 'express'
import { client } from './client'
import { ObjectId } from 'mongodb'
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "./types/requestTypes";
import {CreateBook, QueryBook} from "./types/Book";

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
    NOT_FOUND_404: 404
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
		const result = await client.db().collection('books').insertOne(req.body)
		console.log(result)
		res.sendStatus(HTTP_STATUSES.CREATED_201)
	})

app.get('/books/:id', async (req: RequestWithParams<{id: string}>, res: Response<QueryBook>) => {
	const id = req.params.id
	await client.connect()
	const books = await client.db().collection('books')
	const book: QueryBook = await books.findOne({_id: new ObjectId(id)})
	res.json(book)
})

app.listen(port, () => {
    console.log(`listen port ${port}`)
})