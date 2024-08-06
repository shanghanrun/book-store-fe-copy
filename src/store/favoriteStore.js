import {create} from 'zustand'
import uiStore from './uiStore'
import api from './../utils/api';

const favoriteStore = create((set,get)=>({
	favorite:[],
	getFavorite:async()=>{
		try{
			const resp = await api.get('/favorite')
			// console.log('favorite :', resp)
			set({favorite: resp.data.favorite.favorite})
		}catch(e){
			console.log(e)
			uiStore.getState().showToastMessage(e, 'error')
		}
	},
	addFavorite:async(id)=>{
		try{
			const resp = await api.put(`/favorite/${id}`)
			console.log('addFavorite 실행됨 ')
			console.log('addFavorite', resp.data.favorite.favorite)
			set({favorite: resp.data.favorite.favorite})
			// await get().getFavorite(); // 업데이트함
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
			await get().getFavorite(); 
			// 이렇게 getFavorite()로 할 수도 있고, 위에서처럼 populate해서 보낸 데이터를 받아서 set할 수도 있다.
			
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