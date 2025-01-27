import { stripe } from "../integrations/stripe";
import { client } from "../integrations/client";
import { Book as DBBook } from "../models/book";
import { CreateBook, QueryBook, UpdateBook } from "../types/Book";
import { ObjectId, UpdateResult } from 'mongodb'
import { Stripe } from "./Stripe";

export class Book {
    private book: CreateBook | undefined
    private dbBook: any
    private paymentBook: any

    public async update(values: { id: string, data: UpdateBook }): Promise<any> {
        const result: UpdateResult = await this.updateInDataBase(values)

        if(result.acknowledged) {
            const book = await this.findById(values.id)
            const stripeId = book?.stripeId

            if(!stripeId) throw new Error("Book isn't had a stripe id") // TODO: create new object in stripe

            await this.updateInPaymentSystem(stripeId, { name: book?.name, price: book?.price })
        } else {
            throw new Error("Book has't been changed")
        }
    }

    // TODO: need to split
    private async updateInPaymentSystem(stripeId: string, value: ({ name?: string, price?: number })) {
        if (value?.name) {
            await stripe.products.update(stripeId, {name: value?.name})
        }
        if (value?.price) {
            const newPrice = await stripe.prices.create({
                unit_amount: Math.round(value?.price * 100),
                currency: 'usd',
                product: stripeId
            })

            const product = await stripe.products.update(stripeId, {
                default_price: newPrice.id
            })

            if(product.default_price !== newPrice.id) {
                throw new Error("Price hasn't updated")
            }
        }
    }

    private async updateInDataBase({ id, data }: { id: string, data: UpdateBook }): Promise<UpdateResult> {
        return await DBBook.updateOne(
            {_id: new ObjectId(id)},
            {$set: { ...data }}
        )
    }

    public async findById(id: string): Promise<QueryBook | null> {
        const instance: QueryBook | null = await DBBook.findById(id)
        return instance ?? null
    }

    public async deleteById(id: string) {
        await client.connect()
		const books = await client.db().collection('books')
		await books.deleteOne({_id: new ObjectId(id)}) // const book: QueryBook =
    }

    public async create(data: CreateBook) {
        this.book = data
        await this.createToPaymentSystem()
        return await this.createToDataBaseAndUpdateInPaymentSystem()
    }

    private async createToDataBaseAndUpdateInPaymentSystem() {
        try {
            if(this.paymentBook && this.book) {
                this.dbBook = new DBBook({ 
                    name: this.book.name, 
                    year: this.book.year, 
                    author: this.book.author, 
                    description: this.book.description, 
                    genres: this.book.genres, 
                    price: this.book.price, 
                    stripeId: this.paymentBook.id
                })

                try {
                    const result = await this.dbBook.save()
                    await this.addMatadataToPaymentSystemObject()
                    return true
                } catch (error) {
                    throw new Error("Object haven't been saved in data base")
                }

            } else {
                throw new Error("Payment's ID or/and book props isn't visible")
            }
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            }

            throw new Error('An unknown error occurred')
        }
    }

    private async addMatadataToPaymentSystemObject() {
        try {
            this.paymentBook = await stripe.products.update(
                this.paymentBook.id,
                {metadata: {product_id: this.dbBook.id}}
            )
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            }

            throw new Error('An unknown error occurred')
        }
    }

    private async createToPaymentSystem() {
        try {
            if(! this.book)throw new Error("Book props isn't visible")
            this.paymentBook = await stripe.products.create({
                name: this.book.name,
                default_price_data: {
                    currency: 'usd',
                    unit_amount: Math.round((this.book.price ?? 0) * 100)
                },
            })
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            }

            throw new Error('An unknown error occurred')
        }
    }
}