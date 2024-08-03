import React, { Fragment } from 'react';
import { Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CommentList = ({ comments, onDelete, user }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('kr-KR');
  };

  return (
    <List>
      {comments.map((comment) => (
        <ListItem key={comment._id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar>{comment.userId.userName?.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary={comment.content} // primary에는 간단한 텍스트만 포함
            secondary={`작성자: ${comment.userId.userName}`}
          />
          <ListItemSecondaryAction>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ marginRight: '16px' }}>
                {comment.createdAt.slice(0, 10)}
              </Typography>
              {comment.userId._id === user?._id && (
                <IconButton aria-label="delete" onClick={() => onDelete(comment._id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </ListItemSecondaryAction>
          {/* <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 5 }}>
                  <Typography variant="body2" color="text.primary">
                    {comment.content}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ marginRight: '16px' }}>
                    {comment.createdAt.slice(0, 10)}
                  </Typography>
                  {comment.userId._id === user?._id && (
                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(comment._id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            }
          /> */}
        </ListItem>
      ))}
    </List>
  );
};
export default CommentList;
