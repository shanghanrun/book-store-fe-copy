import {create} from 'zustand'
import api from '../utils/api';
import { USER_LOGOUT } from '../constants/user.constants';
import uiStore from './uiStore'

const cartStore = create((set,get)=>({
	cartList:[],
	selectedItem:{},
	cartItemCount:0,
	totalPrice:0,
	user:{},
	quantity:1,
	addToCartDone:false,
	deliveryAddress:'',
	loading:false,
	error:'',

	addToCart:async(book,quantity,deliverAddress)=>{
		try{
			const resp = await api.post('/cart', { bookId: book._id, qty: quantity, deliveryAddress });
    		if (resp.status !== 200) throw new Error(resp.error);
			set({
				addToCartDone:true,
				cartList:[...get().cartList, resp.data.data],
				cartItemCount: resp.data.cartItemQty,
				deliveryAddress: deliveryAddress
			})
		}catch(e){

		}
	},

	getCartList: async()=>{
		try{
			const resp = await api.get('/cart');
    		if (resp.status !== 200) throw new Error(response.error);
			set({
				cartList: resp.data.data.items,
				user: resp.data.data.user,
				totalPrice:resp.data.data.items.reduce((total,item)=> total+item.bookId.priceSales * item.qty, 0),
			})
		}catch(e){

		}
	},
	
	
	deleteCartItem:async(id,qty)=>{
		try{
			const resp = await api.delete(`/cart/${id}`);
    		if (response.status !== 200) throw new Error(response.error);
			set({cartItemCount: resp.data.data})//보내온값에 따라서,cartItemQty
		}catch(e){

		}
	},
	updateItemQty:async(id,value)=>{
		try{
			const resp = await api.put(`/cart/${id}`, { qty: value });
			set({
				cartList: resp.data.data,
				totalPrice:resp.data.data.reduce((total,item)=> total +=item.bookId.priceSales *item.qty, 0)
			})
		}catch(e){

		}
		
	},
	getCartQty:async()=>{
		try{
			const resp = await api.get('/cart/qty');
			set({
				cartItemCount: resp.data.data
			})
		}catch(e){

		}
	},
	setBookGroup:()=>{},
	resetBookListByCategory:()=>{}

}))

export default cartStore;