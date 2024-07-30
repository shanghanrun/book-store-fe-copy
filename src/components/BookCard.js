import React, { useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as types from '../constants/book.constants';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import { pink } from '@mui/material/colors';
import { currencyFormat } from '../utils/number';

import userStore from './../store/userStore';
import favoriteStore from './../store/favoriteStore';
import cartStore from './../store/cartStore';
import uiStore from './../store/uiStore';
import bookStore from './../store/bookStore';

const BookCard = ({ book, favorite, sx }) => {
  const navigate = useNavigate();
  const { user } = userStore();
  const {setSelectedBook} = bookStore()
  const {addFavorite, deleteFavorite} = favoriteStore()
  const {addToCart} = cartStore()
  const {showToastMessage} = uiStore()

  const clickBookCard = (book) => {
    setSelectedBook(book);
    navigate(`/book/${book._id}`);
  };

  const handleFavoriteClick = () => {
    if (user) {
      addFavorite(book._id);
    } else {
      showToastMessage('로그인이 필요합니다!', 'error');
    }
  };

  const deleteFavoriteClick = () => {
    console.log('도서찜 취소합니다.')
    deleteFavorite(book._id);
  };

  const handleCartClick = () => {
    if (user) {
      addToCart(book._id); // 배송 정보 추가??
    } else {
      showToastMessage('로그인이 필요합니다!', 'error');
    }
  };

  return (
    <Card
      sx={{
        ...sx,
        width: 230,
        height: 370,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
      }}>
      <CardMedia
        component="img"
        image={book.cover}
        alt={book.title}
        sx={{
          height: 275,
          objectFit: 'cover',
          // borderTopLeftRadius: 3,
          // borderTopRightRadius: 3,
          cursor: 'pointer',
        }}
        onClick={() => clickBookCard(book)}
      />
      <CardContent sx={{ height: 95, width: '100%', padding: '8px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: '100%',
              textAlign: 'left',
              fontWeight: 'bold',
            }}>
            {book.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: '100%',
              textAlign: 'left',
            }}>
            {book.author}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <Typography variant="body2" color="text.primary">
              ₩ {currencyFormat(book.priceStandard)}
            </Typography>
            <Box>
              {favorite ? (
                <IconButton onClick={deleteFavoriteClick} sx={{ padding: '5px' }}>
                  <FavoriteBorderIcon fontSize="small" sx={{ color: pink[500] }} />
                </IconButton>
              ) : (
                <IconButton onClick={handleFavoriteClick} sx={{ padding: '5px'}}>
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton onClick={handleCartClick} sx={{ padding: '5px' }}>
                <ShoppingCartIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCard;
