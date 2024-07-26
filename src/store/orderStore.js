import {create} from 'zustand'
import uiStore from './uiStore'

const orderStore = create((set,get)=>({
	orderList: [],
	myOrderList: [],
	selectedOrder: null,
	fullAddress: '',
	deliveryInfo: '',
	orderNum: '',
	requestList: [],
	myRequestList: [],
	selectedRequest: null,
	createOrder:async(payload)=>{
		try{
			const resp = await api.post('/order', payload)
			set({orderNum:resp.data.orderNum})
		}catch(e){
			console.log(e)
		}
	},
	// 내주문 조회
	getMyOrder:async(query)=>{
		try{
			const resp = await api.get('/order/me', {params:{...query}})
			set({myOrderList: resp.data})
		}catch(e){
			console.log(e)
		}
	},
	// 모든 주문 조회
	getOrderList:async(query)=>{
		try{
			const resp = await api.get('/order',{params:{...query}})
			set({orderList: resp.data})
		}catch(e){
			console.log(e)
		}
	},
	//주문 상태 업데이트
	updateOrder: async(id,status)=>{
		try{
			const resp = await api.put(`/order/${id}`,{status})
			uiStore.getState().showToastMessage('주문상태를 수정했습니다.', 'success')
			get().getOrderList()
		}catch(e){
			console.log(e)
		}
	},
	//주문 문의 신청
	requestOrder:async(orderNum,requestType,reason,navigate)=>{
		try{
			const resp = await api.post('/order/request', {orderNum,requestType, reason})
			set({requestList: resp.data})
			uiStore.getState().showToastMessage('상품문의를 완료했습니다.', 'success')
			navigate('/mypage/order-claim-list')
		}catch(e){
			console.log(e)
		}
	},
	// 주문 문의 조회
	getRequestList:async(query)=>{
		try{
			const resp = await api.get('/order/request', {params:{...query}})
			set({requestList: resp.data})
		}catch(e){
			console.log(e)
		}
	},
	// 내 주문 문의 조회
	getMyRequest: async()=>{
		try{
			const resp = await api.get('/order/request/me')
			set({myRequestList:resp.data})
		}catch(e){
			console.log(e)
		}
	},
	// 주문 문의 업데이트
	updateRequest:async(id, status)=>{
		try{
			const resp = await api.put(`/order/request/${id}`,{status})
			set({requestList:resp.data})
			get().getRequestList()
			uiStore.getState().showToastMessage('처리상태를 수정했습니다.', 'success')
		}catch(e){
			console.log(e)
		}
	}
}))


export default orderStore;