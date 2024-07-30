import React, { useEffect } from 'react';
import { Button, Box } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { pink } from '@mui/material/colors';

import cartStore from '../../store/cartStore';
import uiStore from './../../store/uiStore';
import favoriteStore from './../../store/favoriteStore';

const BookToCart = ({ favorite, selectedBook, fullAddress, deliveryInfo, deliveryAddress, user }) => {
  const { addToCart } = cartStore();
  const { addFavorite, deleteFavorite} = favoriteStore()
  const {showToastMessage} = uiStore()

  const handleAddToCart = () => {
    if (user) {
      addToCart(selectedBook._id); // 배송 정보 추가??
    } else {
      showToastMessage('로그인이 필요합니다!', 'error');
    }
  };

  const handleFavoriteClick = () => {
    if (user) {
      addFavorite(selectedBook._id);
    } else {
      showToastMessage('로그인이 필요합니다!', 'error');
    }
  };
  const deleteFavoriteClick = () => {
    if (user) {
      deleteFavorite(selectedBook._id);
    } else {
      showToastMessage('로그인이 필요합니다!', 'error');
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Button onClick={handleAddToCart} variant="contained" color="primary" startIcon={<AddShoppingCartIcon />} sx={{ height: '60px', flexGrow: 1 }}>
        ADD TO CART
      </Button>
      {favorite ? (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FavoriteBorderIcon sx={{ color: pink[500] }} />}
          sx={{ height: '60px', flexGrow: 1 }}
          onClick={deleteFavoriteClick}>
          WISH
        </Button>
      ) : (
        <Button variant="outlined" color="primary" startIcon={<FavoriteBorderIcon />} sx={{ height: '60px', flexGrow: 1 }} onClick={handleFavoriteClick}>
          WISH
        </Button>
      )}
    </Box>
  );
};

export default BookToCart;
