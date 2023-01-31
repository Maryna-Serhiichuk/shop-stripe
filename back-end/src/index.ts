import express, {Response} from 'express'
import { client } from './client'
import {stripeKey, url} from './connect'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types/requestTypes";
import {CreateBook, QueryBook, UpdateBook} from "./types/Book";
import { Book } from './models/book'
import cors from 'cors'

const stripe = require('stripe')(stripeKey)

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
	.get(async (req: RequestWithParams<QueryBook>, res: Response<QueryBook[]>)  => {
		const query = req.query?.search ?? ''
		const sort = req.query?.sort ?? ''
		const books: QueryBook[] = await Book.find({$or: [{name: {$regex: query}}, {author: {$regex: query}}, {author: {$regex: query}}, {genres: {$regex: query}}, {description: {$regex: query}}]} )
		res.json(books)
	})
	.post(urlencodedParser, async (req: RequestWithBody<CreateBook>, res: Response<QueryBook>) => {
		const { name, year, author, description, genres, price } = req.body
		if(!author || !year || !name || !description || !genres || !price){
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
			return
		}

		const product = await stripe.products.create({
			name: name,
			default_price_data: {
				currency: 'usd',
				unit_amount: Math.round(price * 100)
			},
		})

		const book = new Book({ name, year, author, description, genres, price, stripeId: product.id })
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
		const { author, year, name } = req.body
		if(author || year || name){
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

app.route('/shopping-cart')
	.post(urlencodedParser, async (req: RequestWithBody<{list: string[] | undefined}>, res: Response<QueryBook[] | undefined>) => {
		const { list } = req.body
		try{
			const books: QueryBook[] | null = await Book.find({ _id: { $in: list } })
			res.json(books)
		} catch (err) {
			res.json(undefined)
		}
	})

app.route('/by-book')
	.post(urlencodedParser, async (req: RequestWithBody<{id: string}>, res:Response<{checkoutUrl: string}>) => {
		const { id } = req.body

		const instance: QueryBook | null = await Book.findById(id)
		if(!instance || !instance?.stripeId) {
			res.sendStatus(HTTP_STATUSES.SERVER_500)
			return
		}
		const stripeId = instance.stripeId
		const product = await stripe.products.retrieve(stripeId)
		if(!product){
			res.sendStatus(HTTP_STATUSES.SERVER_500)
			return
		}
		const priceId = product.default_price

		const session = await stripe.checkout.sessions.create({
			success_url: 'http://localhost:3000/success',
			cancel_url: 'http://localhost:3000/shopping-cart',
			line_items: [
				{price: priceId, quantity: 1},
			],
			mode: 'payment',
		})

		res.send({checkoutUrl: session.url})
		// res.sendStatus(HTTP_STATUSES.CREATED_201)
	})

app.route('/by-books')
	.post(urlencodedParser, async (req: RequestWithBody<{list: string[]}>, res: Response<{checkoutUrl: string}>) => {
		const { list } = req.body
		const books: QueryBook[] | null = await Book.find({ _id: { $in: list } })
		const stripeId: string[] = books.map(it => it.stripeId)
		const products = await stripe.products.list({ids: stripeId})
		const priceIds: string[] = products.data.map((it: any) => it.default_price)

		const session = await stripe.checkout.sessions.create({
			success_url: 'https://example.com/success',
			cancel_url: 'https://google.com',
			line_items: priceIds.map(it => ({price: it, quantity: 1})),
			mode: 'payment',
		})

		res.send({checkoutUrl: session.url})
	})

mongoose
	.connect(url)
	.then(res => console.log('Connect to mongoose'))
	.catch(err => console.log('mongoose error', err))

app.listen(port, () => {
    console.log(`listen port ${port}`)
})