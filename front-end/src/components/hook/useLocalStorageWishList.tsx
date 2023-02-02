export const wishListLabel = 'wish-list'

export type WishListType = {
    id: string
    numbers: number
}

export function useLocalStorageWishList(value: string) {
    // const wishList = JSON.parse(value as string) as WishListType[]
    let wishList: WishListType[] = []
    try {
        wishList = JSON.parse(value as string) as WishListType[]
    } catch (err) {
        wishList = [] as WishListType[]
    }
    const wishListIds = wishList.map((it:WishListType) => it.id)

    const deleteFromWishList = (id: string) => {
        const filter = wishList.filter((it:WishListType) => it.id !== id)
        const valueStringify = JSON.stringify(filter)
        return valueStringify
    }

    const addToWishList = (id: string) => {
        let newValue
        if(!value){
            newValue = JSON.stringify([{id:id,numbers:1}])
        } else {
            const add = wishList.concat({id:id,numbers:1})
            newValue = JSON.stringify(add)
        }
        return newValue
    }

    return {deleteFromWishList, addToWishList, wishList, wishListIds}
}