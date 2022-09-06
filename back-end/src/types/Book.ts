enum BookGenres {
    biographical,
    detective,
    historical,
    adventure,
    science,
    romantic,
    fantastic
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
}

export type CreateBook = {
    name: string
    author: string
    year: number
    description: string
    price: number
    genres: string
    created: string
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
    id: string
    name: string
    author: string
    year: number
    description: string
    price: number
    genres: string
    created: string
}

