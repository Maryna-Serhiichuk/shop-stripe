import { client } from "../integrations/client";
import { Book as DBBook } from "../models/book";
import { CreateBook, QueryBook, UpdateBook } from "../types/Book";
import { ObjectId, UpdateResult } from 'mongodb';
import { Stripe } from "./Stripe";
import { BookListRequest } from "../types/queryTypes";

export class Book {
    private book: CreateBook | undefined
    private dbBook: any
    private paymentBook: any

    private stripeService: Stripe

    constructor() {
        this.stripeService = new Stripe()
    }

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

    private async updateInPaymentSystem(stripeId: string, value: ({ name?: string, price?: number })) {
        if (value?.name) {
            await this.stripeService.updateBookName({ id: stripeId, name: value?.name })
        }
        if (value?.price) {
            await this.stripeService.updateBookPrice({ id: stripeId, price: value?.price })
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
            this.paymentBook = await this.stripeService.attachDbProductIdToMetadata({
                id: this.paymentBook.id,
                dbProductId: this.dbBook.id
            })

        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            }

            throw new Error('An unknown error occurred')
        }
    }

    private async createToPaymentSystem() {
        try {
            if(!this.book)throw new Error("Book props isn't visible")

            this.paymentBook = await this.stripeService.createBookProduct({ 
                name: this.book.name,
                price: this.book.price
            })

        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            }

            throw new Error('An unknown error occurred')
        }
    }

    public async getBookList(idsList: BookListRequest['list']): Promise<QueryBook[]> {
        return await DBBook.find({ _id: { $in: idsList } })
    }

    public async getBooks({ search, sort }: { search?: string, sort?: string }): Promise<QueryBook[]> {
        return await DBBook.find({ $or: [
            { name: { $regex: search } }, 
            { author: { $regex: search } }, 
            { author: { $regex: search }}, 
            { genres: { $regex: search } }, 
            { description: { $regex: search } }
        ]} )
    }
}