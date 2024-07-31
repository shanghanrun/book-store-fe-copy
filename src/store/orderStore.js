import {create} from 'zustand'
import uiStore from './uiStore'
import api from '../utils/api';

const orderStore = create((set,get)=>({
	orderList: [],
	myOrderList: [],
	selectedOrder: null,
	orderNum: '',
	requestList: [],
	myRequestList: [],
	selectedRequest: null,
	setSelectedOrder:(order)=>{set({selectedOrder: order})},
	createOrder:async(payload)=>{
		console.log('createOrder 실행됨')
		try{
			const resp = await api.post('/order', payload)
			console.log('resp :', resp)
			set({
				myOrderList:[...get().myOrderList, resp.data.newOrder],
				orderNum:resp.data.orderNum
			})
		}catch(e){
			console.log(e)
		}
	},
	// 내주문 조회
	getMyOrder:async(query)=>{
		try{
			const resp = await api.get('/order/me', {params:{...query}})
			set({myOrderList: resp.data.orders})
		}catch(e){
			console.log(e)
		}
	},
	// 쿼리를 바탕으로 모든 주문 조회 (query에 userName 들어간다.)
	getOrderList:async(query)=>{
		try{
			const resp = await api.get('/order',{params:{...query}})
			set({orderList: resp.data.orders})
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
			set({requestList: resp.data.order})
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
			set({myRequestList: resp.data.requests})
		}catch(e){
			console.log(e)
		}
	},
	// 내 주문 문의 조회
	getMyRequest: async()=>{
		try{
			const resp = await api.get('/order/request/me')
			set({myRequestList:resp.data.requests})
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