import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useMediaQuery } from '@mui/system';
import { Grid } from '@mui/material';
import bookStore from './../store/bookStore';

const NewButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
}));

const AdminPageSearchBox = ({ searchQuery, setSearchQuery, fields, resetSearch, handleOpenNewDialog }) => {
  const [selectedField, setSelectedField] = useState(fields[1]); // title
  const [inputValue, setInputValue] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');
  const {getBookList} = bookStore()

  const handleChange = (event) => {
    const value = event.target.value;
    if (fields.includes(value)) {
      setSelectedField(value);
    } else {
      setSelectedField(fields[1]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();//기본 엔터키 동작방지
      if(inputValue.trim() === ''){
        //빈 문자열일 경우 모든 항목을 검색
        setSearchQuery({});
        getBookList({})
      } else{
        //입력된 검색어로 검색
        setSearchQuery({ ...searchQuery, [selectedField]: inputValue });
      }
      setInputValue('') // 검색란 비우기
    }
  };


  return (
    <>
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NewButton variant="contained" onClick={handleOpenNewDialog}>
            New
          </NewButton>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            noValidate
            autoComplete="off"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid item xs={3}>
                <TextField 
                  select 
                  label="Search by" 
                  value={selectedField} 
                  onChange={handleChange} 
                  variant="standard" 
                  sx={{ width: '100%' }}
                  InputProps={{
                    startAdornment:(
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                >
                  {fields.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  label={`Search ${selectedField}`}
                  variant="standard"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Box>
            <Grid item xs={12} mb={2}>
              <Button variant="contained" color="secondary" onClick={resetSearch} sx={{ width: '100%' }}>
                초기화
              </Button>
            </Grid>
          </Box>
        </Box>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <NewButton variant="contained" sx={{ mt: 2, height: '5ch' }} onClick={handleOpenNewDialog}>
            New
          </NewButton>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { mt: 1 } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField 
                select 
                label="Search by" 
                value={selectedField} 
                onChange={handleChange} 
                variant="standard" 
                sx={{ mt: 1, width: '11ch' }}
                InputProps={{
                    startAdornment:(
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
              >
                {fields.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={`Search ${selectedField}`}
                variant="standard"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ mt: 1, width: '25ch' }}
              />
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default AdminPageSearchBox;