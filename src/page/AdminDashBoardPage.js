import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Tabs, Tab } from '@mui/material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import '../style/adminDashboardPageStyles.css';
import AdminDashboardCard from '../components/AdminDashboardCard';
import { currencyFormat } from '../utils/number';

import UserPermissionsModal from '../components/UserPermissionsModal';
import AdminPermissionsModal from '../components/AdminPermissionsModal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import userStore from './../store/userStore';
import orderStore from './../store/orderStore';
import contactStore from './../store/contactStore';


const theme = createTheme({
  typography: {
    fontFamily: 'IBM Plex Sans KR, sans-serif',
  },
});

function AdminDashBoardPage() {
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ userName: '', email: '', password: '', role: 'admin' });
  const [selectedTab, setSelectedTab] = useState(0);
  const orderTableHead = ['주문번호', '주문일자', '구매자', '도서명', '총 주문액'];

  const {users, getAllUser,adminUser,registerAdmin, updateUserLevel, userUpdated, deleteAdmin} = userStore() 
  const {orderList, requestList,getOrderList, getRequestList} = orderStore()
  const {contacts,getAllContacts} = contactStore()

  const [userData, setUserData] = useState([]); // 일반유저 list
  const [adminData, setAdminData] = useState([]); // admin list
  const [monthlySales, setMonthlySales] = useState([]); // 월별 매출을 저장할 상태
  const [orderStatusCounts, setOrderStatusCounts] = useState([0, 0, 0, 0]); // 주문 상태 개수 저장

  useEffect(() => {
    // 페이지가 로드될 때 사용자와 어드민 데이터를 불러옴
    getAllUser(); 
    // adminUser(); 
    getOrderList(); 
    getAllContacts();
    getRequestList();
  }, [userUpdated]);

  useEffect(() => {
    if (users) {
      setUserData(users.filter((user) => user.role !== 'admin'));
      setAdminData(users.filter((user) => user.role === 'admin'));
    }
  }, [users, userUpdated]);

  // 월별 매출 계산 함수
  const calculateMonthlySales = (orderList) => {
    const sales = Array(12).fill(0); // 12개월을 0으로 초기화 [0,0,...]
    orderList.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.getMonth(); // 8월이면 7이라는 숫자 나온다.
      sales[month] += order.totalPrice; // sales[6]
    });

    // 3월과 4월의 가짜 매출 데이터 추가
    sales[2] = 50000; // 3월 매출
    sales[3] = 70000; // 4월 매출

    return sales;
  };

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  // 주문 상태 개수 계산 함수
  const calculateOrderStatusCounts = (orderList) => {
    const statusMapping = {
      '준비 중': 'preparing',
      '배송 중': 'shipping',
      '배송완료': 'delivered',
      '환불': 'refund',
    };

    const statusCounts = { preparing: 0, shipping: 0, delivered: 0, refund: 0 };

    orderList.forEach((order) => {
      const englishStatus = statusMapping[order.status];
      if (statusCounts[englishStatus] !== undefined) {
        statusCounts[englishStatus]++;
      }
    });

    return [statusCounts.preparing, statusCounts.shipping, statusCounts.delivered, statusCounts.refund];
  };

  // 주문 데이터가 변경될 때 월별 매출과 주문 상태 개수 계산
  useEffect(() => {
    if (orderList && orderList.length > 0) {
      const sales = calculateMonthlySales(orderList);
      setMonthlySales(sales);

      const statusCounts = calculateOrderStatusCounts(orderList);
      setOrderStatusCounts(statusCounts);
    }
  }, [orderList]);

  const orderStatusData = {
    labels: ['준비 중', '배송 중', '배송완료', '환불'],
    datasets: [
      {
        label: '주문 상태',
        data: orderStatusCounts, // 계산된 주문 상태 개수를 사용
        backgroundColor: ['#9BD5FF', '#FFC0CB', '#CDA7FE', '#FF7F7F'],
      },
    ],
  };

  const getMonthlySignups = (year, month) => {
    return userData.filter((user) => {
      const date = new Date(user.createdAt);
      return date.getFullYear() === year && date.getMonth() === month;
    }).length;
  };

  const today = new Date();
  const currentMonth = today.getMonth(); // 8월이면 7숫자 나온다.
  // console.log('currentMonth', currentMonth)
  const currentYear = today.getFullYear();

  const lastMonth = (currentMonth - 1 + 12) % 12;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const twoMonthsAgo = (currentMonth - 2 + 12) % 12;
  const twoMonthsAgoYear = currentMonth <= 1 ? currentYear - 1 : currentYear;

  const threeMonthsAgo = (currentMonth - 3 + 12) % 12;
  const threeMonthsAgoYear = currentMonth <= 2 ? currentYear - 1 : currentYear;

  const currentMonthSignups = getMonthlySignups(currentYear, currentMonth);
  const lastMonthSignups = getMonthlySignups(lastMonthYear, lastMonth);
  const twoMonthsAgoSignups = getMonthlySignups(twoMonthsAgoYear, twoMonthsAgo);
  const threeMonthsAgoSignups = getMonthlySignups(threeMonthsAgoYear, threeMonthsAgo);

  const signupData = {
    labels: [ monthNames[threeMonthsAgo], monthNames[twoMonthsAgo], monthNames[lastMonth], monthNames[currentMonth] ],
    datasets: [
      {
        label: `${currentYear}년 가입자 수`,
        data: [threeMonthsAgoSignups, twoMonthsAgoSignups, lastMonthSignups, currentMonthSignups],
        backgroundColor: ['#9BD5FF'],
        barThickness: 15,
      },
    ],
  };

  // 가짜 가입자 수 데이터 추가
  signupData.datasets[0].data[1] += 5; // 3월 가입자 수
  signupData.datasets[0].data[2] += 10; // 4월 가입자 수

  const salesData = {
    labels: monthNames,
    datasets: [
      {
        label: '총 매출',
        data: monthlySales, // 월별 매출 데이터를 사용
        borderColor: '#9BD5FF',
        fill: true,
      },
    ],
  };


  const handleUserChange = (id, event) => {
    const { name, value } = event.target;
    setUserData((prevData) => prevData.map((user) => (user._id === id ? { ...user, [name]: value } : user)));
  };

  const handleDelete = async (id) => {
     //이러면 여기서만 바뀌는데?? 데이터베이스도 바뀌어야..
    //! userStore에 deleteAdmin(userId)르르 만들고, 백엔드에서도 삭제하게 만들어야 될 것 같다.. 
    await deleteAdmin(id)
    setAdminData(adminData.filter((admin) => admin._id !== id));
    // setUserData(userData.filter((user) => user._id !== id));
    //useEffect에서 users의 값이 바뀌면 다시 로드한다.
    // userUpdated 디펜던시를 넣어서, 다시 로드하게 한다.
  };

  const handleAddAdmin = async() => {
    await registerAdmin(newAdmin);
    // setAdminData(users.filter((user) => user.role === 'admin'));
    // 생성후, 이 페이지의 newAdmin은 초기화
    setNewAdmin({ userName: '', email: '', password: '', role: 'admin' });
  };

  const handleUserEdit = (id) => {
    const user = userData.find((user) => user._id === id);
    if (user) {
      updateUserLevel(user._id, user.level);
    }
  };

  const adminCardContent = adminData.length > 0 ? `${adminData[0].userName} 외 ${adminData.length - 1}명` : 'No admins';
  const userCardContent = userData.length > 0 ? `Total: ${userData.length}명` : 'No users';

  // 신규주문:  주문한 것 중에서 '준비중'인 것
  const newOrders = orderList.filter((order) => order.status === '준비 중').length;
  // 환불주문: 주문한 것을 환불 요청해서, 환불처리한 것
  const refundOrders = orderList.filter((order) => order.status === '환불').length;
  // 환불/반품대기: 환불 요청한 것은 일단 '대기 중'
  const pendingContacts = requestList.filter((request) => request.request.status === '대기 중').length;

  // 신규가입: 이번달에 생성된 user들
  const newSignups = userData.filter((user) => {
    const date = new Date(user.createdAt);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  }).length;
  // 문의(1대1문의): contacts
  const inquiries = contacts.length;
  
  
  const shippingCounts = orderList.filter((order) => order.status === '배송 중').length;
  const deliveredCounts = orderList.filter((order) => order.status === '배송완료').length;
  

  const totalTasks = newOrders + refundOrders + pendingContacts + newSignups + inquiries;

  const taskItems = [
    { title: '신규 주문', count: newOrders },
    { title: '환불 주문', count: refundOrders },
    { title: '환불/반품 대기', count: pendingContacts },
    { title: '신규 가입', count: newSignups },
    { title: '문의', count: inquiries },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const filteredOrderList = orderList?.filter((order) => {
    switch (selectedTab) {
      case 0:
        return order.status === '준비 중';
      case 1:
        return order.status === '배송 중';
      case 2:
        return order.status === '배송완료';
      case 3:
        return order.status === '환불';
      default:
        return true;
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="root">
        <Container className="containerStyled" maxWidth="lg">
          <Box mb={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: '10px' }}>
                  오늘의 할일
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'red' }}>
                  {totalTasks}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {taskItems.map((item, index) => (
                  <Grid item key={index}>
                    <Typography variant="body1">
                      {item.title} {item.count}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
          <Grid container spacing={3}>
            {/* 매출 및 주문 상태 */}
            <Grid item xs={12} md={6}>
              <AdminDashboardCard title="총 매출" content={<Line data={salesData} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <AdminDashboardCard title="신규 가입 고객" content={<Bar data={signupData} />} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* 고객 문의 */}
            <Grid item xs={12}>
              <AdminDashboardCard title="고객 문의" content={<ContactTable contacts={contacts} />} />
            </Grid>

            <Grid item xs={12}>
              <AdminDashboardCard
                title="주문 상태"
                content={
                  <>
                    <Tabs value={selectedTab} onChange={handleTabChange} aria-label="order status tabs">
                      <Tab label={`준비 중 (${newOrders})`} />
                      <Tab label={`배송 중 (${shippingCounts})`} />
                      <Tab label={`배송완료 (${deliveredCounts})`} />
                      <Tab label={`환불 (${refundOrders})`} />
                    </Tabs>
                    <StatusTable orderTableHead={orderTableHead} orderData={filteredOrderList} />
                  </>
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <AdminDashboardCard title="사용자 권한 관리" content={userCardContent} onClick={()=>setOpenUserModal(true)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminDashboardCard title="어드민 권한 관리" content={adminCardContent} onClick={()=>setOpenAdminModal(true)} />
            </Grid>

            <UserPermissionsModal
              open={openUserModal}
              handleClose={()=>setOpenUserModal(false)}
              userData={userData}
              handleLevelChange={handleUserChange}
              // handleDelete={handleDelete}
              handleEdit={handleUserEdit}
            />

            <AdminPermissionsModal
              open={openAdminModal}
              handleClose={()=>setOpenAdminModal(false)}
              adminData={adminData}
              newAdmin={newAdmin}
              handleEmailChange={handleUserChange}
              handlePasswordChange={handleUserChange}
              handleNameChange={handleUserChange}
              handleRoleChange={handleUserChange}
              handleDelete={handleDelete}
              handleAddAdmin={handleAddAdmin}
              setNewAdmin={setNewAdmin}
            />
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}

const cellStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '150px',
};

// ContactTable 컴포넌트
const ContactTable = ({ contacts }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={cellStyle}>고객 이름</TableCell>
          <TableCell style={cellStyle}>상품 사진</TableCell>
          <TableCell style={cellStyle}>문의 내용</TableCell>
          <TableCell style={cellStyle}>문의 날짜</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {contacts?.map((contact) => (
          <TableRow key={contact?._id}>
            <TableCell style={cellStyle}>{contact?.userId?.userName}</TableCell>
            <TableCell style={cellStyle}>
              {' '}
              <img src={contact?.image} alt={contact?.inquiryContent} style={{ width: '70px', height: '50px' }} />
            </TableCell>
            <TableCell style={cellStyle}>{contact?.inquiryContent}</TableCell>
            <TableCell style={cellStyle}>{contact?.createdAt.slice(5, 10)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const StatusTable = ({ orderTableHead, orderData}) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {orderTableHead?.map((head, index) => (
            <TableCell style={cellStyle} key={index}>
              {head}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {orderData?.map((order) => (
          <TableRow key={order?._id}>
            <TableCell style={cellStyle}>{order?.orderNum}</TableCell>
            <TableCell style={cellStyle}>{order?.createdAt.slice(5, 10)}</TableCell>
            <TableCell style={cellStyle}>{order?.contact?.name}</TableCell>
            <TableCell style={cellStyle}>{order?.items?.map((item) => item?.bookId?.title).join(', ')}</TableCell>
            <TableCell style={cellStyle}>₩{currencyFormat(order?.totalPrice)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default AdminDashBoardPage;
