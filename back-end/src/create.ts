import { client } from "./client"
import {Role} from "./models/role";

const start = async () => {
	try {
		await client.connect()
		await client.db().createCollection('books')
		const books = client.db().collection('books')
		// await books.insertOne({title: 'Harry Potter', year: 1992})
		await books.insertMany([{name: 'Harry Potter', author: 'Joanne Rowling', year: 1992}, {name: 'Football', author: 'Eva Burbon', year: 2020}])
	} catch (e) {
		console.log('error ---- ', e)
	}
}

start()


const setUserRoles = async () => {
	try {
		const user = new Role()
		const admin = new Role({value: "ADMIN"})
		await user.save()
		await admin.save()
	} catch (err) {
		console.log(err)
	}
}
setUserRoles()