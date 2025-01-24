export enum BookGenres {
    biographical,
    detective,
    historical,
    adventure,
    science,
    romantic,
    fantastic,
    fantasy
}

// enum MagazineGenres {
//     sport,
//     science,
//     news
// }
export const bookGenres: BookGenre[] = ['biographical','detective','historical','adventure','science','romantic','fantastic','fantasy']

type BookGenre = 
    'biographical' | 
    'detective' | 
    'historical' | 
    'adventure' |
    'science' |
    'romantic' |
    'fantastic' |
    'fantasy'

type MagazineGenre = 'sport' | 'science' | 'news'

export type Book = {
    _id: string
    name: string
    author: string
    year: number
    description: string
    image: string
    price: string
    genres: BookGenre[]
    created: string
}

export type Magazine = {
    id: string
    name: string
    publishingHouse: string
    genres: MagazineGenre[]
    description: string
    created: string
}

export type Customer = {
    id: string
    name: string
    surname: string
    email: string
    role: string
    phone: string
    wishList: string[]
    purchasesList: string[]
    delivery: {
        city: string,
        number: string
    },
    customerStripeId: string,
    // subscribe: Subscribe
    // discount: Discount[]
}

type Message = {
    id: string
    author: Customer
    text: string
    created: string
}

type SubscribeType = {
    type: 'regular'
    regular: 'year' | 'per-year'
}

type Subscribe = {
    id: string
    subsribe: Magazine
    type: SubscribeType
    startDate: string
    endDate: string
}

type Payment = {
    id: string
    subscribe: Subscribe
    customer: Customer
    created: string
}

type Discount = {
    id: string
    discont: number
    type: 'count' | 'percentage'
}