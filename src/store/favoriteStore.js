import {create} from 'zustand'
import uiStore from './uiStore'
import api from './../utils/api';

const favoriteStore = create((set,get)=>({
	favorite:[],
	getFavorite:async()=>{
		try{
			const resp = await api.get('/favorite')
			set({favorite: resp.data})
		}catch(e){
			console.log(e)
			uiStore.getState().showToastMessage(e, 'error')
		}
	},
	addFavorite:async(id)=>{
		try{
			const resp = await api.put(`/favorite/${id}`)
			set({favorite: resp.data})
			uiStore.getState().showToastMessage('도서를 찜했습니다.', 'success')
		}catch(e){
			console.log(e)
			uiStore.getState().showToastMessage(e, 'error')
		}
	},
	deleteFavorite:async(id)=>{
		try{
			const resp = await api.delete(`/favorite/${id}`)
			// set({favorite: resp.data}) 돌려받는 데이터 없음...
			uiStore.getState().showToastMessage('도서의 찜하기를 취소했습니다.', 'success')
		}catch(e){
			console.log(e)
			uiStore.getState().showToastMessage(e, 'error')
		}
	},
	clearFavorite:()=>{
		set({favorite:[]})
	}
}))

export default favoriteStore;