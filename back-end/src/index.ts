import express, { Response } from 'express'
import { stripeKey, url } from './connect'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "./types/requestTypes";
import { CreateBook, QueryBook, UpdateBook } from "./types/Book";
import { Book } from './models/book'
import { Customer } from "./models/customer";
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { Role } from "./models/role";
import { CreateCustomer, QueryCustomer } from "./types/Customer";

import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger/swagger.json'
import { SubscribeRequest, ByBookRequest, BookListRequest, ByBookResponse } from './types/queryTypes'
import { User } from './classes/User'
import { Book as BookClass } from './classes/Book'

const stripe = require('stripe')(stripeKey)

const app = express()

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:true});

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.use(cors({ origin: '*' }))

const port = 3030

const defaultCustomerId = '63dfe850d6550e60491fb57b'

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NOT_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,

	SERVER_500: 500
}

app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(swaggerDocument) as any);

app.route('/me')
	.get(async (req,res: Response<QueryCustomer>) => {
		const customer = await Customer.findById(defaultCustomerId)

		res.json(customer as QueryCustomer)
	})

app.route('/registration')
	.post(async (req: RequestWithBody<CreateCustomer>,res: Response<QueryCustomer>) => {
		try {
			// const { email, password, name, surname, phone } = req.body

			const user = new User(req.body)

			if(await user.isEmailExist()) {
				return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400) // .json({message: 'Customer already exists'})
			}

			await user.createCustomer(0)

			return res.sendStatus(HTTP_STATUSES.CREATED_201) // .json({message: 'Customer is registered'})
		} catch (err) {
			console.log(err)
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400) // .json({message: 'Registration error'})
		}
	})

app.route('/books')
	.get(async (req: RequestWithParams<QueryBook>, res: Response<QueryBook[]>)  => {
		const query: string = (req.query?.search ?? '') as string
		const sort: string = (req.query?.sort ?? '') as string

		const instance = new BookClass()
		const books: QueryBook[] = await instance.getBooks({ 
			search: query,
			sort: sort
		})

		res.json(books)
	})
	.post(urlencodedParser, async (req: RequestWithBody<CreateBook>, res: Response<QueryBook>) => {
		const { name, year, author, description, genres, price } = req.body
		if(!author || !year || !name || !description || !genres || !price){
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
			return
		}

		const book = new BookClass()

		try {
			const createResult = await book.create(req.body)
			res.sendStatus(HTTP_STATUSES.CREATED_201)
		} catch (e) {
			console.log(e)
			res.sendStatus(HTTP_STATUSES.SERVER_500)
		}
	})

app.route('/book/:id')
	.get(async (req: RequestWithParams<{id: string}>, res: Response<QueryBook>) => {
		const id = req.params.id
		if(!id) res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

		const instance = new BookClass()
		const book = await instance.findById(id)
		if(book) {
			res.json(book)
			return
		}
		res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
	})
	.delete(async (req: RequestWithParams<{id: string}>, res: Response<QueryBook>) => {
		const id = req.params.id
		const instance = new BookClass()
		await instance.deleteById(id)
		res.sendStatus(HTTP_STATUSES.OK_200)
	})
	.put(urlencodedParser, async (req: RequestWithParamsAndBody<{id: string}, UpdateBook>, res: Response<QueryBook>) => {
		const id = req.params.id
		const { author, year, name, price, genres, description } = req.body
		if(author || year || name || price || genres || description){

			const instance = new BookClass()

			try {
				const result = await instance.update({ id, data: req.body })
			} catch (e) {
				if (e instanceof Error) {
					throw new Error(e.message)
				}
	
				throw new Error('An unknown error occurred')
			}
		}

		res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		return
	})

app.route('/books-list')
	.post(urlencodedParser, async (req: RequestWithBody<BookListRequest>, res: Response<QueryBook[] | undefined>) => {
		const { list } = req.body

		if(list && list?.length) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);

		const instance = new BookClass()

		try{
			const books: QueryBook[] | null = await instance.getBookList(list)
			res.json(books)
		} catch (err) {
			console.log(err)
			res.json(undefined)
		}
	})

app.route('/wish-list/:id')
	.get(async (req: RequestWithParams<{id: string}>, res: Response<number>) => {
		const { id } = req.params

		try{
			const customer = await Customer.updateOne(
				{_id: new ObjectId(defaultCustomerId)},
				{$push: {
						wishList: [new ObjectId(id)]
					}}
			)
			if(!customer.acknowledged){
				res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
			}
			res.sendStatus(HTTP_STATUSES.CREATED_201)
		} catch (err) {
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		}
	})

app.route('/by-books')
	.post(urlencodedParser, async (req: RequestWithBody<ByBookRequest>, res: Response<ByBookResponse>) => {
		const { list, metadata } = req.body
		const listIds = list.map(it => it.id)
		const books: QueryBook[] | null = await Book.find({ _id: { $in: listIds } })
		const booksWithQuantity = books?.map(it => ({_id: it._id, stripeId: it.stripeId, quantity: list.find(item => item.id === String(it._id))?.numbers}))
		const stripeId: string[] = booksWithQuantity.map(it => it.stripeId)
		const products = await stripe.products.list({ids: stripeId})
		const productsWithQuantity: {price:number, quantity:number}[] = products.data.map((it: any) => ({price: it.default_price, quantity: booksWithQuantity.find(item => String(it.id) === String(item.stripeId))?.quantity}))

		const session = await stripe.checkout.sessions.create({
			success_url: 'http://localhost:3000/success',
			cancel_url: 'http://localhost:3000/wish-list',
			line_items: productsWithQuantity.map(it => ({
				price: it.price,
				quantity: it.quantity,
			})),
			mode: 'payment',
			metadata
		})

		res.send({checkoutUrl: session.url})
	})

app.route('/connect')
	.post(urlencodedParser, async (req: RequestWithBody<{email: string}>, res: Response<any>) => {
		try {
			const account = await stripe.accounts.create({
				type: 'standard',
				email: req.body.email,
			});

			const accountLink = await stripe.accountLinks.create({
			 	account: account.id,
			 	refresh_url: 'https://example.com/reauth',
			 	return_url: 'https://example.com/return',
			 	type: 'account_onboarding',
			})

			res.send({url: accountLink.url})
			// res.sendStatus(HTTP_STATUSES.OK_200)
		} catch (err) {
			// res.sendStatus(555)
			res.send({error: err})
		}
		// res.send({checkoutUrl: session.url})
		// res.sendStatus(HTTP_STATUSES.OK_200)
	})

app.route('/subscribe')
	.post(urlencodedParser, async (req: RequestWithBody<SubscribeRequest>, res: Response<any>) => {
		const { accountId, customerId, priceId } = req.body

		try {

			const customer = await stripe.customers.create({
				name: 'Name',
				payment_method: 'pm_card_visa',
				invoice_settings: {
					default_payment_method: 'pm_card_visa'
				}
			}, {stripeAccount: accountId})

			const subscription = await stripe.subscriptions.create({
				customer: customer.id,
				items: [
					{price_data:
						{
							currency: 'usd',
							product: 'prod_Na31ETpYxuPh9u',
							unit_amount: 500,
							recurring: {
								interval: 'month'
							}
						}
					},
				],
			}, {stripeAccount: accountId})

			res.send({subscription})
		} catch (err) {
			res.send({err})
		}

		// try { // default_source
		// 	const customer = await stripe.customers.create({
		// 		name: 'Tetsttt222',
		// 		payment_method: 'pm_card_visa',
		// 		invoice_settings: {
		// 			default_payment_method: 'pm_card_visa'
		// 		}
		// 	})
		//
		// 	const subscription = await stripe.subscriptions.create({
		// 		customer: customer.id,
		// 		items: [
		// 			{
		// 				price_data: {
		// 					currency: 'USD',
		// 					product: 'prod_Na1NNnp1xPh9CM',
		// 					unit_amount: 500,
		// 					recurring: {
		// 						interval: 'month'
		// 					}
		// 				}
		// 			},
		// 		],
		// 		// payment_settings: {
		// 		// 	payment_method_types: ['card'],
		// 		// 	save_default_payment_method: 'on_subscription'
		// 		// },
		// 		// expand: ['latest_invoice.payment_intent']
		// 	}) // ,{ stripe_account: accountId }
		//
		// 	res.send({subscription})
		//
		// 	res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		// } catch (err) {
		// 	res.send({err})
		// }
	})


mongoose
	.connect(url)
	.then(res => console.log('Connect to mongoose'))
	.catch(err => console.log('mongoose error', err))

app.listen(port, () => {
    console.log(`listen port ${port}`)
})