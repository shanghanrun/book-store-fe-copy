import {create} from 'zustand'
import api from './../utils/api';

const commentStore = create((set,get)=>({
	comments: [],
	userComments: [],
	commentsUpdated:false,
	createComment:async({content,bookId})=>{
		console.log('createComment')
		console.log('content:', content);
		console.log('bookId', bookId)
		try{
			const resp= await api.post('/comments', {content,bookId})
			console.log('comment resp', resp)
			set({
				comments: [...get().comments, resp.data.comment],
				commentsUpdated:!get().commentUpdated
			}) //기존 comments에 추가해야 된다.
			uiStore.getState().showToastMessage('리뷰가 성공적으로 추가됐습니다.', 'success')
		}catch(e){
			console.log(e)
		}
	},
	getCommentsByBook:async(bookId)=>{
		try{
			const resp = await api.get(`/comments/book/${bookId}`)
			console.log('resp', resp)
			set({
				comments:resp.data.comments,
				commentsUpdated:!get().commentsUpdated
			})
		}catch(e){
			console.log(e)
		}
	},
	deleteComment:async(commentId, bookId)=>{
		try{
			const resp = await api.delete(`/comments/${commentId}`)
			console.log('삭제성공')
			get().getCommentsByBook(bookId) // 댓글 삭제후 목록갱신
		}catch(e){
			console.log(e)
		}
	},
	getMyComments:async()=>{
		try{
			const resp = await api.get('/comments')
			console.log('resp', resp)
			set({userComments: resp.data.comments})
		}catch(e){
			console.log(e)
		}
	}
}))

export default commentStore;