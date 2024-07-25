import {create} from 'zustand'
import api from './../utils/api';

const categoryStore = create((set,get)=>({
	categories: [],
  	getCategoriesError: null,
  	getCategoriesLoading: false,
 	selectedCategory: null,
  	selectedCategoryPath: null,
  	selectedCategoryId: null,
	getCategoryList:async(query)=>{
		try{
			const resp = await api.get('/category',{
			params:{...query},
			})
			set({categories: resp.data})
		}catch(e){
			set({getCategoriesError: e})
			console.error(e)
		}
	},
	setSelectedCategory:(category)=>{
		set({selectedCategory: category})
	},
	setSelectedCategoryPath:(category)=>{
		set({selectedCategoryPath: category})
	},
	setSelectedCategoryId:(id)=>{
		set({selectedCategoryId: id})
	}
}))

export default categoryStore;