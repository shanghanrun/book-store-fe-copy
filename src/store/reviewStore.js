import {create} from 'zustand'
import api from './../utils/api';

const reviewStore = create((set,get)=>({
	reviews: [],
	userReviews: [],
	reviewsUpdated:false,
	createReview:async({content,bookId})=>{
		console.log('createReview')
		console.log('content:', content);
		console.log('bookId', bookId)
		try{
			const resp= await api.post('/reviews', {content,bookId})
			console.log('review resp', resp)
			set({
				reviews: [...get().reviews, resp.data.review],
				reviewsUpdated:!get().reviewUpdated
			}) //기존 comments에 추가해야 된다.
			uiStore.getState().showToastMessage('리뷰가 성공적으로 추가됐습니다.', 'success')
		}catch(e){
			console.log(e)
		}
	},
	getReviewsByBook:async(bookId)=>{
		try{
			const resp = await api.get(`/reviews/book/${bookId}`)
			console.log('resp', resp)
			set({
				reviews:resp.data.reviews,
				reviewsUpdated:!get().reviewsUpdated
			})
		}catch(e){
			console.log(e)
		}
	},
	deleteReview:async(reviewId, bookId)=>{
		try{
			const resp = await api.delete(`/reviews/${reviewId}`)
			console.log('삭제성공')
			get().getReviewsByBook(bookId) // 댓글 삭제후 목록갱신
		}catch(e){
			console.log(e)
		}
	},
	getMyReviews:async()=>{
		try{
			const resp = await api.get('/reviews')
			console.log('resp', resp)
			set({userReviews: resp.data.reviews})
		}catch(e){
			console.log(e)
		}
	}
}))

export default reviewStore;