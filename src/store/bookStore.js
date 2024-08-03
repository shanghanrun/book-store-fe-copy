import {create} from 'zustand'
import api from '../utils/api';
import uiStore from './uiStore'

const bookStore = create((set,get)=>({
	bookList:[],
	groupBooks:[],
	categoryBooks:[],
	getBooksError: null,
	getBooksLoading:false,
	selectedBook: null,
	getBookByCategoryError: null,
	getBookByCategoryLoading: null,
	bookGroup:'',
	otherBooksByAuthor:[],
	loading:true,
	error:'',
	setSelectedBook:(book)=>{
		set({selectedBook: book})
	},
	createBook:async(bookForm)=>{
		try{
			const response = await api.post('/book', bookForm);
			uiStore.getState().showToastMessage('도서 상품을 추가했습니다.', 'success');
			get().getBookList();
		}catch(e){
			uiStore.getState().showToastMessage(e.error, 'error')
		}
	},
	getBookList:async(query)=>{
		try{
			const resp = await api.get('/book', {
				params:{...query}
			})
			// console.log('getBookList의 resp.data', resp.data)
			console.log('bookList', resp.data.books)// books였다!
			set({bookList: resp.data.books})
		}catch(e){
			console.log(e.error)
		}
	},
	getBookListByGroup:async(bookGroup,query)=>{
		try{
			const resp = await api.get(`/book/group/${bookGroup}`, {
			params: { query },
			});
			set({groupBooks: resp.data.data})
		}catch(e){

		}
	},
	getBookListByCategory:async(categoryId)=>{
		try{
			const resp = await api.get(`/book/category/${categoryId}`);
			set({categoryBooks: resp.data.data})
		}catch(e){

		}
	},
	getBookDetailById:async(bookId)=>{
		try{
			const resp = await api.get(`book/detail/${bookId}`);
			// console.log('getBookDetail..resp.data', resp.data)
			// console.log('reap.data.book:', resp.data.data.book)

			set({
				selectedBook: resp.data.data.book,
				otherBooksByAuthor:resp.data.data.otherBooksByAuthor
			})
		}catch(e){
			uiStore.getState().showToastMessage(e.error,'error')
		}
	},
	deleteBook:async(id)=>{
		try{
			const resp = await api.delete(`/book/${id}`);
			get().getBookList()
		}catch(e){

		}
	},
	updateBook:async(bookForm,id)=>{
		try{
			const resp = await api.put(`/book/${id}`, bookForm);
			get().getBookList()
		}catch(e){

		}
		
	},
	setBookGroup:()=>{},
	resetBookListByCategory:()=>{}

}))

export default bookStore;