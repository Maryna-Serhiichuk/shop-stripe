import { stripe } from "../integrations/stripe";
import { Book as DBBook } from "../models/book";
import { CreateBook, QueryBook } from "../types/Book";

export class Book {
    private book: CreateBook | undefined
    private dbBook: any
    private paymentBook: any

    public async findById(id: string): Promise<QueryBook | null> {
        const instance: QueryBook | null = await DBBook.findById(id)
        return instance ?? null
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