import React from 'react';
import Box from '@mui/material/Box';
import CloseIcon from "@mui/icons-material/Close";

const Tags = ({ tag, onDelete }) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        backgroundColor: 'primary.main',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: 600,
        padding: '0.25rem 0.75rem',
        borderRadius: '999px', // Full pill shape
        margin: '0.25rem', // Adds space between tags
      }}
    >
      {tag}
      <CloseIcon 
        sx={{ marginLeft: '0.5rem', cursor: 'pointer' }} 
        onClick={() => onDelete(tag)} // Call delete function when clicked
      />
    </Box>
  );
};

export default Tags;
