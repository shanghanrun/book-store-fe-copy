import React, { useEffect } from 'react';
import { Box, Typography, Paper, Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { currencyFormat } from '../utils/number';
import paymentIcon from '../assets/payment_icon_yellow_large.png';
import orderStore from './../store/orderStore';
import cartStore from '../store/cartStore';

const OrderReceipt = ({ finalTotalPrice, hasSelectedItems, cartItems, handleCheckout, sticky, shippingInfo = {}, cardInfo = {}, errors, setErrors, paymentMethod }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {getCart} = cartStore()
  const {createOrder} = orderStore()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const shippingFee = hasSelectedItems ? (finalTotalPrice > 100000 ? 0 : 2500) : 0;
  const pointsEarned = finalTotalPrice * 0.05;
  const grandTotal = finalTotalPrice + shippingFee;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePaymentSuccess = async () => {
    const newErrors = {};
    if (!shippingInfo.name) newErrors.name = '이름를 입력해 주세요';
    if (!shippingInfo.zipCode) newErrors.zipCode = '우편번호를 입력해 주세요';
    if (!shippingInfo.address1) newErrors.address1 = '주소를 입력해 주세요';
    if (!shippingInfo.phone) newErrors.phone = '전화번호를 입력해 주세요';
    if (!shippingInfo.email) newErrors.email = '이메일를 입력해 주세요';
    if (location.pathname.includes('/payment')) {
      if(paymentMethod === 'creditCard'){
        if (!cardInfo.cardType) newErrors.cardType = '정보를 입력해 주세요';
        if (!cardInfo.cardNumber) newErrors.cardNumber = '정보를 입력해 주세요';
        if (!cardInfo.expiryDate) newErrors.expiryDate = '정보를 입력해 주세요';
        if (!cardInfo.cvc) newErrors.cvc = '정보를 입력해 주세요';
      }
    }
    console.log(newErrors, 'newErrors');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirmOrder = async () => {
    const { name, zipCode, address1, address2, phone, email } = shippingInfo;
    const data = {
      totalPrice: grandTotal,
      shipTo: { zipCode, address1, address2 },
      contact: { name, phone, email },
      orderItems: cartItems.map((item) => {
        return {
          bookId: item.bookId._id,
          qty: item.qty,
          price: item.bookId.priceSales,
        };
      }),
    };
    try {
      
      // const response = await createOrder(data);
      await createOrder(data)
      // createOrder는 자체적으로 return이 없다.
      
      // await getCart(); 이것은 필요 없을 것 같다.
      // 차라리 cart를 비워야 될 것 같다.. 나중에 추가

      let method;
      if(paymentMethod ==='creditCart'){
        method = cardInfo.cardType
      } else if(paymentMethod ==='transfer'){
        method = 'transfer'
      } else {
        method = 'phonePayment'
      }

      navigate('/payment/success', { //OrderCompletePage
        state: {
          shippingInfo,
          grandTotal,
          paymentMethod: method,
        },
      });
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };
  const handleKakaoPaymentSuccess = () => {
    const newErrors = {};
    if (!shippingInfo.name) newErrors.name = '이름를 입력해 주세요';
    if (!shippingInfo.zipCode) newErrors.zipCode = '우편번호를 입력해 주세요';
    if (!shippingInfo.address1) newErrors.address1 = '주소를 입력해 주세요';
    if (!shippingInfo.phone) newErrors.phone = '전화번호를 입력해 주세요';
    if (!shippingInfo.email) newErrors.email = '이메일를 입력해 주세요';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const { IMP } = window;
    IMP.init('imp58548074');
    IMP.request_pay(
      {
        pg: 'kakaopay', // 카카오페이
        paymentMethod: 'Kakao Pay',
        merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
        name: '주문명: 결제 테스트',
        amount: grandTotal, // 결제금액
        buyer_email: shippingInfo.email,
        buyer_name: shippingInfo.name,
        buyer_tel: shippingInfo.phone,
        buyer_addr: `${shippingInfo.address1} ${shippingInfo.address2}`,
        buyer_postcode: shippingInfo.zipCode,
      },
      async (response) => {
        if (response.success) {
          // 결제 성공
          const { name, zipCode, address1, address2, phone, email } = shippingInfo;
          const data = {
            totalPrice: grandTotal,
            shipTo: { zipCode, address1, address2 },
            contact: { name, phone, email },
            orderList: cartItems.map((item) => {
              return {
                bookId: item.bookId._id,
                qty: item.qty,
                price: item.bookId.priceSales,
              };
            }),
          };
          try {
            const response = await createOrder(data);
            await getCart();
            navigate('/payment/success', {
              state: {
                shippingInfo,
                grandTotal,
                paymentMethod: 'Kakao Pay',
              },
            });
          } catch (error) {
            console.error('Order creation failed:', error);
          }
        } else {
          // 결제 실패
          console.error('Payment failed:', response.error_msg);
        }
      },
    );
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: '16px',
          width: '100%',
          maxWidth: '600px',
          borderRadius: '10px',
          position: sticky ? 'sticky' : 'static',
          top: sticky ? '20px' : 'auto',
        }}>
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
          Order Summary
        </Typography>
        <Divider />
        <Box mt={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1">총 상품 금액:</Typography>
            <Typography variant="body1">₩{currencyFormat(finalTotalPrice)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1">배송비:</Typography>
            <Typography variant="body1">₩{currencyFormat(shippingFee)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1">적립금:</Typography>
            <Typography variant="body1">₩{currencyFormat(pointsEarned)}</Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
            <Typography variant="h6">최종 결제 금액:</Typography>
            <Typography variant="h6">₩{currencyFormat(grandTotal)}</Typography>
          </Box>

          {location.pathname.includes('/cart') && cartItems.length > 0 && (
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleCheckout}>
              주문하기
            </Button>
          )}
          {location.pathname.includes('/payment') && (
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handlePaymentSuccess}>
              결제하기
            </Button>
          )}
          {location.pathname.includes('/payment') && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, p: 0, backgroundColor: '#FFEB00', '&:hover': { backgroundColor: '#FFEB00' } }}
              onClick={handleKakaoPaymentSuccess}>
              <img src={paymentIcon} alt="Kakao Pay" style={{ width: '30%', height: 'auto' }} />
            </Button>
          )}
        </Box>
      </Paper>
      {/* 모달 컴포넌트 추가 */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>정보 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>주문을 완료하려면 다음 정보를 확인해 주세요.</DialogContentText>
          <Typography>이름: {shippingInfo.name}</Typography>
          <Typography>
            주소: {shippingInfo.zipCode} {shippingInfo.address1}
          </Typography>
          <Typography>전화번호: {shippingInfo.phone}</Typography>
          <Typography>이메일: {shippingInfo.email}</Typography>
          {location.pathname.includes('/payment') && (paymentMethod ==='creditCard') && (
            <>
              <Typography>카드 종류: {cardInfo.cardType}</Typography>
              <Typography>카드 번호: {cardInfo.cardNumber}</Typography>
              <Typography>유효 기간: {cardInfo.expiryDate}</Typography>
              <Typography>CVC: {cardInfo.cvc}</Typography>
            </>
          )}
          {location.pathname.includes('/payment') &&(paymentMethod ==='transfer') && (
            <Typography>결제방법: 무통장입금</Typography>
          )}
          {location.pathname.includes('/payment') &&(paymentMethod ==='phonePayment') && (
            <Typography>결제방법: 휴대폰 결제</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            수정
          </Button>
          <Button onClick={handleConfirmOrder} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderReceipt;
