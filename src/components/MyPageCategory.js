import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  Link,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import userStore from '../store/userStore';

const MyPageCategory = () => {
  const navigate = useNavigate();
  const { user,loginWithToken } = userStore();
  const userLevel = ['bronze', 'silver', 'gold', 'platinum'];
  const [openPopup, setOpenPopup] = useState(false);
  const [anchorElShop, setAnchorElShop] = useState(null);
  const [anchorElInfo, setAnchorElInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery('(max-width:600px');

  useEffect(() => {
    if (!user) {
      loginWithToken();
    }
  }, []);

  const handleEventClick = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleShopMenuOpen = (event) => {
    setAnchorElShop(event.currentTarget);
  };

  const handleShopMenuClose = () => {
    setAnchorElShop(null);
  };

  const handleInfoMenuOpen = (event) => {
    setAnchorElInfo(event.currentTarget);
  };

  const handleInfoMenuClose = () => {
    setAnchorElInfo(null);
  };


  const myShoppingList = [
    { title: '주문내역/배송조회', link: '/mypage/order-list' },
    { title: '반품/교환 신청 및 조회', link: '/mypage/order-claim-list' },
    { title: '취소 주문 내역', link: '/mypage/order-cancel-list' },
    { title: '리뷰 관리', link: '/mypage/my-review' },
    { title: '찜한 도서', link: '/mypage/wishlist' },
  ];

  const myInfoList = [
    { title: '개인정보 수정', link: '/member/confirm-password' },
    { title: '이벤트 당첨 내역', action: handleEventClick },
    { title: '회원 탈퇴', link: '/member/account-deletion' },
  ];

  return (
    <>
      {isMobile ? (
        <Box>
          <AppBar position="sticky">
            <Grid container>
              <Grid item xs={6}>
                <Toolbar sx={{ bgcolor: 'white', textAlign: 'center' }}>
                  <IconButton
                    size="large"
                    edge="start"
                    // color="inherit"
                    aria-label="menu"
                    aria-controls="shop-menu-appbar"
                    aria-haspopup="true"
                    onClick={handleShopMenuOpen}>
                    {/* <MenuIcon /> */}
                    <Typography variant="subtitle2">주문정보</Typography>
                  </IconButton>
                  <Menu
                    id="shop-menu-appbar"
                    anchorEl={anchorElShop}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'bottom',
                    }}
                    keepMounted
                    open={Boolean(anchorElShop)}
                    onClose={handleShopMenuClose}>
                    {myShoppingList.map((item, index) => (
                      <MenuItem key={index} onClick={() => navigate(item.link)}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Menu>
                </Toolbar>
              </Grid>
              <Grid item xs={6}>
                <Toolbar sx={{ bgcolor: 'white' }}>
                  <IconButton
                    size="large"
                    edge="start"
                    // color="inherit"
                    aria-label="menu"
                    aria-controls="info-menu-appbar"
                    aria-haspopup="true"
                    onClick={handleInfoMenuOpen}>
                    {/* <MenuIcon /> */}
                    <Typography variant="subtitle2">회원정보</Typography>
                  </IconButton>
                  <Menu
                    id="info-menu-appbar"
                    anchorEl={anchorElInfo}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'bottom',
                    }}
                    keepMounted
                    open={Boolean(anchorElInfo)}
                    onClose={handleInfoMenuClose}>
                    {myInfoList.map((item, index) => (
                      <MenuItem key={index} onClick={item.link ? () => navigate(item.link) : item.action}>
                        {item.title}
                      </MenuItem>
                    ))}
                    <MenuItem onClick={() => navigate('/contact')}>1:1 문의</MenuItem>
                  </Menu>
                </Toolbar>
              </Grid>
            </Grid>
          </AppBar>

          {/* 이벤트 당첨 내역 팝업 */}
          <Dialog open={openPopup} onClose={handleClosePopup}>
            <DialogTitle>준비 중인 서비스입니다.</DialogTitle>
            <DialogContent>
              <DialogContentText>죄송합니다. 이벤트 당첨 내역 서비스는 준비 중입니다.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="primary">
                닫기
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <Box>
          {/* 유저 등급 */}
          <Grid container>
            <Box mt={2} p={2} border={1} borderRadius={4} borderColor="grey.400">
              <Typography variant="h6">나의 북두칠성 등급</Typography>
              <Box display="flex" mt={2}>
                { userLevel.map((level, index) => (
                      <Box
                        key={index}
                        mr={1.5}
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: user?.level === level ? '#3d643d' : '#f0f0f0',
                        }}>
                          <Typography variant="subtitle2" color="white">
                            {level}
                          </Typography>
                      </Box>
                    ))}
              </Box>
            </Box>
          </Grid>

          {/* 나의 쇼핑과 나의 정보 */}
          <Grid container>
            <Box mt={2} p={2} pl={3} pr={9} border={1} borderRadius={4} borderColor="grey.400">
              {/* 나의 쇼핑 */}
              <Typography color="primary">나의 쇼핑</Typography>
              <Box>
                {myShoppingList?.map((item, index) => (
                  <Box key={index} m={1} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Link href={item.link} underline="hover" color="inherit">
                      {item.title}
                    </Link>
                  </Box>
                ))}
              </Box>

              <Typography mt={2} mb={2} borderBottom={1} borderColor="grey.400" />
              {/* 나의 정보 */}
              <Typography color="primary">나의 정보</Typography>
              <Box mb={2}>
                {myInfoList?.map((item, index) => (
                  <Box m={1} key={index}>
                    {item.link ? (   // link인 경우
                      <Link href={item.link} underline="hover" color="inherit">
                        {item.title}
                      </Link>
                    ) : (     // action인 경우
                      <Typography variant="body1" color="inherit" sx={{ cursor: 'pointer' }} onClick={item.action}>
                        {item.title}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ width: '20ch', height: '30px', borderRadius: '10px' }}
                onClick={() => navigate('/contact')}>
                <Typography variant="subtitle2">1:1 문의</Typography>
              </Button>
            </Box>
          </Grid>

          {/* 이벤트 당첨 내역 팝업 */}
          <Dialog open={openPopup} onClose={handleClosePopup}>
            <DialogTitle>준비 중인 서비스입니다.</DialogTitle>
            <DialogContent>
              <DialogContentText>죄송합니다. 이벤트 당첨 내역 서비스는 준비 중입니다.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="primary">
                닫기
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default MyPageCategory;
