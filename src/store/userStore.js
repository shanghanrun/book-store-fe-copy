import {create} from 'zustand'
import api from '../utils/api'
import uiStore from './uiStore'
import cartStore from './cartStore' 

const userStore =create((set,get)=>({
	user:null,
	users:[],
	error:'',
	loading: true,
	userUpdated:false,
	
	loginWithToken: async ()=> {
		// const token= sessionStorage.getItem('token') 이것 필요없다. api에서 알아서 해더에 넣도록 설정해 두었다.
		//그럼에도 불구하고, token값을 불러와서 token이 없을 경우에는 불필요한 백엔드 요청을 안하도록 하는 것이 좋다.
		const token = sessionStorage.getItem('token')
		if(!token) return;

		try{
			const resp = await api.get('/user/me')
			const u = resp.data.user
			// const credit = u.credit
			// const coupon = u.coupon
			set({
				user: u,
				// credit: credit,
				// coupon: coupon
			})
		} catch(e){
			console.log('e.error:', e.error)
			// set({error:e.error}) 이걸 안해야 Login페이지에 쓸데없는 에러메시지가 안나온다.
			set({error: ''})
			// this.logout()  zustand this사용 못한다.
			// invalid한 토큰삭제,user null로
			sessionStorage.clear()
			set({user:null})
			get().logout()
		}
	},
	loginWithEmail: async ({email,password})=>{
		try{
			const resp = await api.post('/auth/login', {email,password})
			const u = resp.data.user
			const t = resp.data.token
			// const credit = u.credit
			// const coupon = u.coupon
			set({
				user: u,
				// credit: credit,
				// coupon: coupon
			})
			sessionStorage.setItem('token',t)
			uiStore.getState().showToastMessage("로그인 하셨습니다.", 'success')
		} catch(e){
			console.log('e :', e)
			// 아래부분은 확인해 봐야 됨. e.message인지 여부...
			// set({error: e.error})
			// uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	logout:()=> {   
		sessionStorage.clear()
		set({user:null})
		uiStore.getState().showToastMessage("로그아웃", 'success')
		cartStore.getState().zeroCartItemCount()
	},
	loginWithGoogle: async (token)=>{
		try{
			const resp = await api.post('/auth/google', {token})
			const u = resp.data.user
			const t = resp.data.token
			// const credit = u.credit
			// const coupon = u.coupon
			set({
				user: u,
				// credit: credit,
				// coupon: coupon
			})
			sessionStorage.setItem('token',t)
		}catch(e){
			console.log('e.error:', e.error)
			// set({error: e.error})
			// uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	registerUser: async({email, userName, password, role, level, address, phone }, navigate)=>{
		try{
			const resp = await api.post('/user', {email, userName, password, role, level, address, phone})
			console.log('회원등록 성공')
			// set({user: resp.data.data})
			
			const users = get().users; 		
			set({
				users: [...users, resp.data],
				userUpdated: !get().userUpdated
			})
			uiStore.getState().showToastMessage('회원가입을 완료했습니다.', 'success')
			navigate('/login')

		}catch(e){
			console.log(e.error)
			uiStore.getState().showToastMessage('회원가입실패','error')
		}
	},
	
	// 어드민 대시보드에서 어드민 계정 생성
	registerAdmin:async({email,userName,password, role})=>{
		try{
			const resp = await api.post('/user', {email,userName,password,role});
			set({user:resp.data.user})
			uiStore.getState().showToastMessage(`${userName}님을 관리자로 추가했습니다.`, 'success');
			getAllUser();
		}catch(e){

		}
	},
	removeUser:async()=>{}, //회원탈퇴할 경우...

	// 어드민 대쉬보드에서 관리자를 get해서 보여주기
	adminUser:async()=>{
		try{
			const resp = await api.get('/user/admin');
			set({users: resp.data.users})
			getAllUser()
		}catch(e){
			console.log(e)
		}
	},

	updateUserLevel:async()=>{
		try{
			const resp = await api.put(`/user/${id}`, {level});
			set({user: resp.data.user})
			uiStore.getState().showToastMessage(`${level} 등급으로 변경 성공!`, 'success')
		}catch(e){
			console.log(e)
		}
	},
	confirmPassword:async(password,navigate)=>{
		try{
			const resp = await api.post('/user/confirmPassword', {password})
			set({user: resp.data.user})
			navigate('/member/user-info')
		}catch(e){
			console.log(e)
		}
	},
	//회원 정보 수정 요청
	userInfoChange:async(id,newUserInfo)=>{
		try{
			const resp = await api.put(`/user/myInfo/${id}`, newUserInfo)
			set({user: resp.data.user})
		}catch(e){
			console.log(e)
		}
	},
	deleteUser:async(id, password,navigate)=>{
		try{
			const resp = await api.post(`/user/delete/${id}`, {password})
			set({user: null});
			get().logout()
			navigate('/')
			uiStore.getState().showToastMessage('회원탈퇴를 완료했습니다.', 'success')
		}catch(e){
			console.log(e)
		}
	},


}))

export default userStore;