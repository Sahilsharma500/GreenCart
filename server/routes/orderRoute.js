import express from 'express'
import authUser from '../middleware/authUser.js'
import { getAllOrders, getUserOrders, placeOrderCOD } from '../controllers/orderController.js'
import authSeller from '../middleware/authSeller.js'

const orderRouter = express.Router()

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/user', authSeller, getAllOrders)

export default orderRouter