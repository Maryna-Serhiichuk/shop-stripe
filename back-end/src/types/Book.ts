enum BookGenres {
    biographical,
    detective,
    historical,
    adventure,
    science,
    romantic,
    fantasy
}

export type Book = {
    id: string
    name: string
    author: string
    year: number
    description: string
    image: string
    price: number
    genres: BookGenres[]
    created: string
    stripeId: string
}

export type CreateBook = {
    name: string
    author: string
    year: number
    description: string
    price: number
    genres: string
    stripeId: string
}

export type UpdateBook = {
    name?: string
    author?: string
    year?: number
    description?: string
    price?: number
    genres?: string
}

export type QueryBook = {
    _id: string
    name: string
    author: string
    year: number
    description: string
    price: number
    genres: string
    stripeId: string
}

