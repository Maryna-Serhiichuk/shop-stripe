export type BookListRequest = {
    list: string[] | undefined
}

export type ByBookRequest = {
    list: {id:string,numbers:number}[], 
    metadata: {[key:string]:string}
}

export type ByBookResponse = {
    checkoutUrl: string
}

export type SubscribeRequest = {
    accountId?: string
    customerId?: string
    priceId?: string
}