import { stripe } from "../integrations/stripe";

// TODO: attach types from Stripe

export class Stripe {
    public async updateBookName ({ id, name }: { id: string, name: string }) {
        await stripe.products.update( id, { name } )
    }

    public async updateBookPrice (values: { id: string, price: number }) {
        const newPrice = await this.createBookPrice(values)
        const updatedProduct = await this.updateProductPrice({ newPriceId: newPrice?.id, id: values?.id })
    
        if(updatedProduct.default_price !== newPrice.id) {
            throw new Error("Price hasn't updated")
        }
    }

    private async createBookPrice({ id, price }: { id: string, price: number }) {
        return await stripe.prices.create({
            unit_amount: Math.round(price * 100),
            currency: 'usd',
            product: id
        })
    }

    private async updateProductPrice({ newPriceId, id }: { newPriceId: string, id: string }) {
        return await stripe.products.update(id, {
            default_price: newPriceId
        })
    }

    public async createBookProduct({ price, name }: { price: number, name: string }) {
        return await stripe.products.create({
            name: name,
            default_price_data: {
                currency: 'usd',
                unit_amount: Math.round((price ?? 0) * 100)
            },
        })
    }

    public async attachDbProductIdToMetadata ({ id, dbProductId }: { id: string, dbProductId: string }) {
        return await stripe.products.update(
            id,
            { metadata: { product_id: dbProductId } }
        )
    }
}