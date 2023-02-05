export type Customer = {
    email: string
    password: string
    name: string
    surname: string
    phone: string
    role: string
    wishList: string[]
    delivery: {
        city: string
        number: number
    }
    customerStripeId: string
}

export type CreateCustomer = {
    name: string
    email: string
    password: string
    surname: string
    phone: string
}

export type UpdateCustomer = {
    name?: string
    author?: string
    year?: number
    description?: string
    price?: number
    genres?: string
}

export type QueryCustomer = {
    customerStripeId: string
    name: string
    email: string
    password: string
    surname: string
    phone: string
    role: string
}