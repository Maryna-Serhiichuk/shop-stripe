enum BookGenres {
    biographical,
    detective,
    historical,
    adventure,
    science,
    romantic,
    fantastic
}

enum MagazineGenres {
    sport,
    science,
    news
}

type Book = {
    id: string
    name: string
    author: string
    year: number
    description: string
    image: string
    price: number
    genres: BookGenres[]
    created: string
}

type Magazine = {
    id: string
    name: string
    publishingHouse: string
    genres: MagazineGenres[]
    description: string
    created: string
}

type Customer = {
    id: string
    name: string
    surname: string
    address: string
    created: string
    subscribe: Subscribe
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