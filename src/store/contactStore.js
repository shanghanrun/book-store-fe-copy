import {create} from 'zustand'
import uiStore from './uiStore'

const contactStore = create((set,get)=>({
  	contacts: [],
  	contact: {},
  	userContacts: [],
	createContact:async(payload)=>{
		try{
			const resp = await api.post('/contact', payload)
			set({contact: resp.data})
			uiStore.getState().showToastMessage('문의사항이 정상적으로 접수되었습니다.', 'success')
		}catch(e){
			console.log(e)
		}
	},
	getContactsByUser:async()=>{
		try{
			const resp = await api.get('/contact/user')
			set({userContacts: resp.data})
		}catch(e){
			console.log(e)
		}
	},
	getAllContacts:async()=>{
		try{
			const resp = await api.get('/contact')
			set({contacts:resp.data})
		}catch(e){
			console.log(e)
		}
	}
}))


export default contactStore;