import React, { useState, useEffect } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import * as types from '../../constants/cart.constants';

import styled from 'styled-components';
import { currencyFormat } from '../../utils/number';
// import { fontSize } from '@mui/system';
import cartStore from '../../store/cartStore';

const TaxDeductionLabel = styled.div`
  border: 1px solid;
  padding: 0;
  width: fit-content;
  font-size: 0.875rem;
`;

const BookBasicInfo = ({ title, author, publisher, price }) => {
  const {quantity, setCartQuantity} = cartStore()
  const [q, setQ] = useState(quantity);
  

  useEffect(() => {
    setCartQuantity(q);
  }, [q,setCartQuantity]);

  const handleDecrease = () => {
    setQ((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQ((prev) => prev + 1);
  };

  return (
    <Box>
      <TaxDeductionLabel>
        <Typography sx={{ p: '2px' }}> 소득공제</Typography>
      </TaxDeductionLabel>
      <Typography variant="h4" sx={{ flexGrow: 1, mt: 0, mb: 3, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'grey' }}>
        {author}
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 1}}>
        {publisher}
      </Typography>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        ₩ {currencyFormat(price)}
      </Typography>
      {/* <Box display="flex" alignItems="center" border={1} borderRadius={4} width="fit-content" p={1} mb={5}>
        <IconButton onClick={handleDecrease} size="small">
          <RemoveIcon />
        </IconButton>
        <Typography variant="body1" mx={2}>
          {quantity}
        </Typography>
        <IconButton onClick={handleIncrease} size="small">
          <AddIcon />
        </IconButton>
      </Box> */}
    </Box>
  );
};

export default BookBasicInfo;
