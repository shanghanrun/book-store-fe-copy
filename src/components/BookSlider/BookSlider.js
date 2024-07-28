import React, { useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import BookCard from '../BookCard';

import Carousel from 'react-multi-carousel';

import 'react-multi-carousel/lib/styles.css';
import './BookSlider.css';
import CustomRightArrow from './CustomRightArrow';
import CustomLeftArrow from './CustomLeftArrow';
import userStore from './../../store/userStore';
import favoriteStore from './../../store/favoriteStore';

const BookSlider = ({ bookList, isMobile }) => {
  const { favorite, getFavorite } = favoriteStore();
  const { user } = userStore();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 7,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    if (user) {
      getFavorite();
    }
  }, [user]);

  return (
    <Box sx={{ height: 'auto', justifyContent: 'center' }}>
      <Carousel containerClass="carousel-container" responsive={responsive} customLeftArrow={<CustomLeftArrow />} customRightArrow={<CustomRightArrow />}>
        {bookList.map((book, index) => (
          <Box key={index} sx={{ padding: 2 }}>
            {favorite && (<BookCard book={book} favorite={favorite.some((fav) => fav._id === book._id)} />)}
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};
export default BookSlider;
