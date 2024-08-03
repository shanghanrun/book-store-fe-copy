import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentList from './CommentList';
import commentStore from './../../store/commentStore';

const CommentSection = ({ comments, bookId, deleteComment, user }) => {
  console.log('CommentsSection의 bookId', bookId)
  const {createComment, getCommentsByBook} = commentStore()
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    createComment({ content: newComment, bookId: bookId });
    setNewComment('');
  };

  useEffect(() => {
    getCommentsByBook(bookId);
  }, [comments.length]);

  return (
    <Box className="comment-section mt-4">
      {comments.length === 0 && <Typography variant="body1">아직 리뷰가 없습니다.</Typography>}
      <CommentList comments={comments} onDelete={deleteComment} user={user} />
      {/*<List>*/}
      {/*  {comments.map((comment, index) => (*/}
      {/*    <ListItem*/}
      {/*      key={index}*/}
      {/*      className="comment-item"*/}
      {/*      sx={{*/}
      {/*        marginBottom: '10px',*/}
      {/*        padding: '15px',*/}
      {/*        backgroundColor: 'white',*/}
      {/*        opacity: '70%',*/}
      {/*        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.3)',*/}
      {/*        borderRadius: '8px',*/}
      {/*      }}>*/}
      {/*      <ListItemText*/}
      {/*        primary={comment.userId.userName}*/}
      {/*        secondary={comment.content}*/}
      {/*        primaryTypographyProps={{ fontWeight: 'bold', color: '#333' }}*/}
      {/*        secondaryTypographyProps={{ color: '#555' }}*/}
      {/*      />*/}
      {/*      {comment.userId._id === user?._id && (*/}
      {/*        <ListItemSecondaryAction>*/}
      {/*          <IconButton edge="end" aria-label="delete" onClick={() => deleteComment(comment._id)}>*/}
      {/*            <DeleteIcon color="#537019" />*/}
      {/*          </IconButton>*/}
      {/*        </ListItemSecondaryAction>*/}
      {/*      )}*/}
      {/*    </ListItem>*/}
      {/*  ))}*/}
      {/*</List>*/}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Add a comment"
          multiline
          rows={2}
          variant="outlined"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          리뷰 달기
        </Button>
      </form>
    </Box>
  );
};

export default CommentSection;
