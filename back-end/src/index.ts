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
		const { author, year, name, price, genres, description } = req.body
		if(author || year || name || price || genres || description){
			const result = await Book.updateOne(
				{_id: new ObjectId(id)},
				{$set: {...req.body}}
			)
			if(result.acknowledged){
				const book: QueryBook | null = await Book.findById(id)
				const stripeId = book?.stripeId

				if(name) {
					try {
						const product = await stripe.products.update(stripeId, {name: name,})

						res.sendStatus(HTTP_STATUSES.OK_200)
						return
					} catch (err) {
						res.sendStatus(HTTP_STATUSES.SERVER_500)
						return
					}
				} else if (price) {
					try {
						const newPrice = await stripe.prices.create({
							unit_amount: Math.round(price * 100),
							currency: 'usd',
							product: stripeId
						})

						const product = await stripe.products.update(stripeId, {
							default_price: newPrice.id
						})

						if(product.default_price !== newPrice.id) {
							res.sendStatus(HTTP_STATUSES.SERVER_500)
							return
						}

						res.sendStatus(HTTP_STATUSES.OK_200)
						return
					} catch (err) {
						res.sendStatus(HTTP_STATUSES.SERVER_500)
						return
					}
				} else {
					res.sendStatus(HTTP_STATUSES.OK_200)
					return
				}
			}
			res.sendStatus(HTTP_STATUSES.SERVER_500)
			return
		}

		res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		return
	})

app.route('/wish-list')
	.post(urlencodedParser, async (req: RequestWithBody<{list: string[] | undefined}>, res: Response<QueryBook[] | undefined>) => {
		const { list } = req.body
		try{
			const books: QueryBook[] | null = await Book.find({ _id: { $in: list } })
			res.json(books)
		} catch (err) {
			res.json(undefined)
		}
	})

type ByBooksType = {
	list: {id:string,numbers:number}[],
	delivery: {
		address: {city: string,number:number},
		client: {name:string, surname:string,phone:string}
	}
}

app.route('/by-books')
	.post(urlencodedParser, async (req: RequestWithBody<ByBooksType>, res: Response<{checkoutUrl: string}>) => {
		const { list, delivery } = req.body
		const listIds = list.map(it => it.id)
		const books: QueryBook[] | null = await Book.find({ _id: { $in: listIds } })
		const booksWithQuantity = books?.map(it => ({_id: it._id, stripeId: it.stripeId, quantity: list.find(item => item.id === String(it._id))?.numbers}))
		const stripeId: string[] = booksWithQuantity.map(it => it.stripeId)
		const products = await stripe.products.list({ids: stripeId})
		const productsWithQuantity: {price:number, quantity:number}[] = products.data.map((it: any) => ({price: it.default_price, quantity: booksWithQuantity.find(item => String(it.id) === String(item.stripeId))?.quantity}))

		const session = await stripe.checkout.sessions.create({
			success_url: 'http://localhost:3000/success',
			cancel_url: 'http://localhost:3000/wish-list',
			line_items: productsWithQuantity.map(it => ({price: it.price, quantity: it.quantity})),
			mode: 'payment',
			metadata: {
				delivery_address_city: delivery.address.city,
				delivery_address_number: delivery.address.number,
				delivery_client_name: delivery.client.name,
				delivery_client_surname: delivery.client.surname,
				delivery_client_phone: delivery.client.phone
			}
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