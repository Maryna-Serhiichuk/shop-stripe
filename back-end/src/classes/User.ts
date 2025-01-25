import { Customer } from "../models/customer";
import { Role } from "../models/role";
import { CreateCustomer } from "../types/Customer";
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { stripe } from '../integrations/stripe'
 
enum UserRole {
    CUSTOMER,
    ADMIN
}

export class User {
    private name: string
    private surname: string
    private email: string
    private password: string
    private phone: string

    private dbCustomer: any
    private paymentCustomer: any

    constructor(data: CreateCustomer) {
        this.name = data?.name
        this.surname = data?.name
        this.email = data?.email
        this.password = data?.password
        this.phone = data?.phone
    }

    public async isEmailExist(): Promise<boolean> {
        const candidate = await Customer.findOne({email: this.email})
        return !!candidate
    }

    public async createCustomer(role: UserRole) {
        const roleValue = await this.findRoleValue(role)
        await this.createObjectInDataBase(roleValue)
        await this.createToPaymentSystem()
        await this.addStriptCustomerIdToDataBase()
    }

    private async findRoleValue(role: UserRole): Promise<string> {
        const userRole = await Role.findOne({value:role})
        return userRole!.value
    }

    private async createObjectInDataBase(roleValue: string) {
        const hashPassword = bcrypt.hashSync(this.password, 7)
        const customer = new Customer({
            name: this.name, 
            surname: this.surname,
            phone: this.phone,
            email: this.email,
            role: roleValue, 
            password: hashPassword
        })
        await customer.save()
        
        this.dbCustomer = customer
    }

    private async createToPaymentSystem() {
        const customerStripe = await stripe.customers.create({
            email: this.email, 
            phone: this.phone,
            name: this.name + this.surname
        })

        this.paymentCustomer = customerStripe
    }

    private async addStriptCustomerIdToDataBase() {
        const customer = await Customer.updateOne(
            {_id: new ObjectId(this.dbCustomer.id)},
            {$set: {
                    customerStripeId: this.paymentCustomer.id
                }}
        )

        this.dbCustomer = customer
        // customer.acknowledged
    }
}