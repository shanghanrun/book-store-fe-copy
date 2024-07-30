import React, { useEffect } from 'react';
import NavBar from '../components/Navbar';
import { useLocation } from 'react-router';
import ToastMessage from '../components/ToastMessage';
import userStore from '../store/userStore';
import bookStore from '../store/bookStore';
import cartStore from '../store/cartStore';

import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer/Footer';
import CategoryBar from '../components/CategoryBar';
import { Box, Typography, useMediaQuery } from '@mui/material';
import uiStore from '../store/uiStore';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const {user, loginWithToken} = userStore();
  const {getCart} = cartStore()
  const { bookList, bookGroup, getBookList } = bookStore()
  console.log('bookList', bookList)
  const {toastMessage} = uiStore()

  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    loginWithToken();
    console.log('bookList 불러오기...')
  }, []);

  useEffect(() => {
    if (user) {
      // getCartQty();
      getCart(); // 이걸 하면 알아서 cartItemCount도 얻어진다.
    }
  }, [user]);

  useEffect(() => {
    if (bookGroup) {
      getBookList({ queryType: bookGroup })
    } else {
      getBookList({})
    }
  }, [bookGroup]);

  return (
    <Box>
      <ToastMessage toastMessage={toastMessage}/>
      {!location.pathname.includes('member') && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#035036',
            height: '60px',
            p: 1,
            textAlign: 'center',
          }}>
          <Typography sx={{ margin: 0, color: '#fff', fontSize: isMobile ? '0.875rem' : '1rem' }}>
            10만원 이상 주문 시 모든 주문 무료 배송 (Standard Shipping)
          </Typography>
        </Box>
      )}
      {location.pathname.includes('admin') ? (
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
            {children}
          </Box>
        </Box>
      ) : location.pathname.includes('member') ? (
        <Box sx={{ mt: 2 }}>{children}</Box>
      ) : (
        <Box>
          <NavBar user={user} />
          <CategoryBar bookList={bookList} />
          <Box sx={{ mt: 2 }}>{children}</Box>
        </Box>
      )}
      {!location.pathname.includes('member') && <Footer />}
    </Box>
  );
};

export default AppLayout;
