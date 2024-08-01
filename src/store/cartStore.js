import {create} from 'zustand'
import api from '../utils/api';
// import { USER_LOGOUT } from '../constants/user.constants';
import uiStore from './uiStore'


const cartStore =create((set,get)=>({
	error:'',
	cartUpdated:false,
	cart:{},
	cartItemCount:0,
	cartList:[], //에러 안나게 우선
	user:{},//에러 안나게 우선
	deliveryAddress:'',//에러 안나게 우선
	zeroCartItemCount:()=>set({cartItemCount:0}),
	zeroCart:()=>set({cart:{}}),
	setCartQuantity:(q)=>{set({quantity: q})},
	addToCart: async(bookId) => {
		try{
			const resp = await api.post('/cart',{bookId})
			uiStore.getState().showToastMessage('카트에 추가했습니다.', 'success');

			set((state)=>({
				cart: resp.data.data,
				cartItemCount: resp.data.cartItemQty,
				cartUpdated: !state.cartUpdated
			}))
		}catch(e){
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error'); 
		}
	},
	getCart:async()=>{
		try{
			const resp = await api.get('/cart')
			set({
				cart: resp.data.data,
				cartItemCount: resp.data.cartItemQty
			})
		}catch(e){
			set({
				error: e.error,
				cartCount:0
			})
		}
	},

	
	deleteCartItem:async(bookId)=>{
		console.log('삭제작업 시작')
		console.log('bookId', bookId)
		try{
			const resp = await api.delete('/cart/'+bookId)
			set((state)=>({
				cart: resp.data.data,
				cartItemCount: resp.data.cartItemQty,
				cartUpdated:!state.cartUpdated
			}))
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	updateItemQty:async(bookId,qty)=>{
		console.log('updateItemQty!')
		console.log('bookId', bookId)
		console.log('qty', qty)
		try{
			const resp = await api.put('/cart/'+bookId, {qty:qty})
			console.log('업데이트되어 온 Cart데이터:', resp.data.data)
			set((state)=>({
				cart: resp.data.data,
				cartUpdated: !state.cartUpdated
			}))
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	emptyCart:async()=>{
		try{
			const resp = await api.delete('/cart')
			set((state)=>({
				// cart:{},보류
				cartItemCount:0,
				cartUpdated: !state.cartUpdated
			}))
			console.log(resp.data.message)
		}catch(e){
			console.log(e.error)
		}	
	}
}))





// const cartStore = create((set,get)=>({
	// cart:{},
	// cartList:[],
	// selectedItem:{},
	// cartItemCount:0,  
	// totalPrice:0,
	// quantity:1,

	// addToCart:async(book,quantity)=>{
	// 	console.log('quantity: ', quantity);
	// 	console.log('book: ', book);
	// 	try{			
	// 		const resp = await api.post('/cart', { bookId: book._id, qty: quantity});
	// 		console.log('addToCart resp', resp)
	// 		set({
	// 			addToCartDone:true,
	// 			cartList:[...get().cartList, resp.data.data],
	// 			cartItemCount: resp.data.cartItemQty
	// 		});
	// 	}catch(e){
	// 		console.log(e)
	// 		uiStore.getState().showToastMessage(e.message, 'error')
	// 	}
	// },

	// getCartList: async()=>{
	// 	try{
	// 		const resp = await api.get('/cart');
    // 		if (resp.status !== 200) throw new Error(response.error);
	// 		set({
	// 			cartList: resp.data.data.items,
	// 			user: resp.data.data.user,
	// 			totalPrice:resp.data.data.items.reduce((total,item)=> total+item.bookId.priceSales * item.qty, 0),
	// 		})
	// 	}catch(e){

	// 	}
	// },
	
	
// 	deleteCartItem:async(id,qty)=>{
// 		try{
// 			const resp = await api.delete(`/cart/${id}`);
//     		if (response.status !== 200) throw new Error(response.error);
// 			set({cartItemCount: resp.data.data})//보내온값에 따라서,cartItemQty
// 		}catch(e){

// 		}
// 	},
// 	updateItemQty:async(id,value)=>{
// 		try{
// 			const resp = await api.put(`/cart/${id}`, { qty: value });
// 			set({
// 				cartList: resp.data.data,
// 				totalPrice:resp.data.data.reduce((total,item)=> total +=item.bookId.priceSales *item.qty, 0)
// 			})
// 		}catch(e){

// 		}
		
// 	},
// 	getCartQty:async()=>{
// 		try{
// 			const resp = await api.get('/cart/qty');
// 			set({
// 				cartItemCount: resp.data.data
// 			})
// 		}catch(e){

// 		}
// 	},
	
// 	setBookGroup:()=>{},
// 	resetBookListByCategory:()=>{},
	

// }))

export default cartStore;