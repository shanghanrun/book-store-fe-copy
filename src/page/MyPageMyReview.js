import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Link, Container, Grid, useMediaQuery, Paper } from '@mui/material';
import MyPageCategory from '../components/MyPageCategory';
import commentStore from '../store/commentStore';
import userStore from './../store/userStore';

const MyPageMyReview = () => {
  const navigate = useNavigate();
  const { user } = userStore();
  const { userComments, getMyComments } = commentStore();
  const isMobile = useMediaQuery('(max-width:600px)');

  const comments = userComments? userComments : [];

  useEffect(() => {
    getMyComments();
  }, []);

  function gotoBook(bookId){
    navigate(`/book/${bookId}`)
  }

  // 중복된 책을 하나로 묶기 위한 작업
  // 하나의 책에 대해서 여러번 리뷰들을 달 수도 있다.
  // 화면에 보여줄 것은 각각의 책에 리뷰들을 넣어서 다시 분류해야 된다.
  // 그러므로 book을 중심으로, comment들을 다시 조합해서 넣어야 된다.
  const uniqueBooks = {};
  comments.forEach((comment) => {
    if (!uniqueBooks[comment.bookId._id]) {
      uniqueBooks[comment.bookId._id] = {
        ...comment.bookId,  // bookId로 populate된 book정보들
        reviews: [comment], // 새롭게 reviews필드 만들고,빈배열에 comment정보 넣기
      };
    } else {
      //해당 책에 대한 comment들을 선별해서 넣기
      if(comment.userId === user._id){
        uniqueBooks[comment.bookId._id].reviews.push(comment);
      }
      // uniqueBooks[comment.bookId._id].reviews.push(comments);
    }
  });
  // console.log('최초 uniqueBooks', uniqueBooks)
  // uniqueBooks 객체의 value값들을 뽑아 내기(배열로 변환)
  // uniqueBooks안에는 'comment.bookId._id'값의 key 들과 그에 해당하는 value들이 있다. value들은 {객체형태}, 바로 이 객체들만 뽑아 내는 것이다.
  const uniqueBookList = Object.values(uniqueBooks);
  console.log('uniqueBookList :', uniqueBookList)

  const cellStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '150px',
  };

  return (
    <Container>
      <Box sx={isMobile ? {} : { p: 3 }}>
        <Grid container mb={1} style={{ fontSize: '15px' }}>
          <Link href="/" underline="hover" color="inherit">
            welcome
          </Link>
          <Typography mr={1} ml={1}>{`>`}</Typography>
          <Link href="/mypage" underline="hover" color="primary" fontWeight="medium">
            mypage
          </Link>
        </Grid>

        {/* 마이페이지 */}
        <Grid container>
          <Typography variant="h4" gutterBottom fontWeight="medium">
            <Link href="/mypage" color="primary" sx={{ textDecoration: 'none' }}>
              마이페이지
            </Link>
          </Typography>
        </Grid>
        {isMobile ? (
          <>
            <Grid container mb={1} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Typography variant="subtitle2"> {user?.userName}님 오늘도 즐겁고 행복한 하루 보내세요.</Typography>
            </Grid>

            <Grid container mb={2} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Typography variant="subtitle2" display="inline">
                나의 북두칠성 등급:
              </Typography>
              <Box display="inline" ml={1}>
                <Typography variant="subtitle2" border={1} borderRadius={4} borderColor="primary.light" bgcolor="primary.light" color="white" p="2px">
                  {user?.level}
                </Typography>
              </Box>
            </Grid>
          </>
        ) : (
          <Grid container>
            <Typography variant="subtitle1">{user?.userName}님 오늘도 즐겁고 행복한 하루 보내세요.</Typography>
          </Grid>
        )}

        <Grid container>
          {/* 마이페이지 좌측 카테고리 */}
          <Grid item xs={12} md={3}>
            <MyPageCategory />
          </Grid>

          {/* 마이페이지 우측 정보 */}
          <Grid item md={9}>
            <Box sx={{ ml: isMobile ? 0 : 2 }} mt={2} mb={4}>
              {/* 광고 짧은 배너 */}
              <Typography
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  typography: isMobile ? 'subtitle2' : '',
                  mt: isMobile ? 3 : 1,
                }}
                mt={2}
                p={1}
                border={1}
                borderRadius={4}
                align="center">
                구매하신 책, 다 읽으셨다면 정가대비 최대 50% 지급받고 북두칠성에 판매하세요!
              </Typography>

              {/* 마이리뷰 */}
              <Typography variant="h6" mt={3}>
                마이리뷰
              </Typography>

              {/* 구분선 */}
              <Typography mt={2} mb={2} borderBottom={1} borderColor="grey.400" />

              {/* 나의 리뷰 나열 */}

              {isMobile ? (
                <Box>
                  {uniqueBookList.map((book) => (
                    <Box key={book._id} mt={5} mb={2}
                      onClick={()=>gotoBook(book._id)}
                      sx={{
                        cursor: 'pointer', // 포인터 커서로 변경
                        padding: '16px', // 여백 추가
                        border: '1px solid #ddd', // 테두리 추가
                        borderRadius: '8px', // 모서리 둥글게
                        transition: 'background-color 0.3s', // 배경색 변화에 대한 부드러운 전환 효과
                        '&:hover': {
                          backgroundColor: '#f0f0f0', // 호버 시 배경색 변경
                        },
                      }}
                    >
                      <Container>
                        <Grid container spacing={2} alignItems="center" component={Paper}>
                          {/* 이미지 (모바일 화면에서 왼쪽 정렬, 나머지는 오른쪽 정렬) */}
                          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <img src={book.cover} alt="Book Cover" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                          </Grid>

                          {/* 텍스트 정보 (모바일 화면에서 오른쪽 정렬) */}
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                              <Typography variant="h6" mb={1}>
                                {book.title}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary', mb: 1 }}>
                                {book.author} | {book.pubDate?.slice(0, 10)}
                              </Typography>
                              {book.reviews.map((comment) => (
                                <Typography key={comment._id} variant="body2" mb={1}>
                                  {comment.createdAt?.slice(0, 10)} | {comment.content}
                                </Typography>
                              ))}
                            </Box>
                          </Grid>
                        </Grid>
                      </Container>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box>
                  {uniqueBookList.map((book) => (
                    <Box mb={2} key={book._id} onClick={()=>gotoBook(book._id)}
                    sx={{
                      cursor: 'pointer', // 포인터 커서로 변경
                      padding: '16px', // 여백 추가
                      border: '1px solid #ddd', // 테두리 추가
                      borderRadius: '8px', // 모서리 둥글게
                      transition: 'background-color 0.3s', // 배경색 변화에 대한 부드러운 전환 효과
                      '&:hover': {
                        backgroundColor: '#f0f0f0', // 호버 시 배경색 변경
                      },
                    }}>
                      <Container>
                        <Grid container>
                          <Grid item md={4}>
                            <img src={book.cover} alt="Book Cover" style={{ maxWidth: '100%' }} />
                          </Grid>
                          <Grid item md={8}>
                            <Typography variant="h6">{book.title}</Typography>
                            <Typography sx={{ fontWeight: 'medium' }} style={{ marginTop: '5px', marginBottom: '10px' }} color="primary">
                              {book.author} | {book.pubDate?.slice(0, 10)}
                            </Typography>
                            {book.reviews.map((review) => (
                              <Typography key={review._id}>
                                {review.createdAt?.slice(0, 10)} | {review.content}
                              </Typography>
                            ))}
                          </Grid>
                        </Grid>
                      </Container>
                      <Typography mb={2} borderBottom={1} borderColor="grey.200" />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MyPageMyReview;
