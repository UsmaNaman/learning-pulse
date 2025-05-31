import React from 'react';
import { Avatar } from '@mui/material';

/**
 * StudentAvatar component displays an appropriate avatar for each student
 * 
 * @param {string} studentId - ID of the student
 * @param {string} name - Name of the student for fallback
 * @param {object} sx - Additional styling
 */
const StudentAvatar = ({ studentId, name, sx = {} }) => {
  // Get first letter of name for fallback
  const firstLetter = name ? name.charAt(0) : 'S';
  
  // Map student IDs to consistent avatar colors
  const getAvatarColor = (id) => {
    const colorMap = {
      'john': '#3f51b5', // indigo
      'ava': '#9c27b0',  // purple
      'david': '#2196f3', // blue
      'fatima': '#e91e63', // pink
      'liam': '#009688'  // teal
    };
    
    return colorMap[id] || '#757575'; // default gray
  };

  return (
    <Avatar 
      sx={{ 
        bgcolor: getAvatarColor(studentId),
        ...sx 
      }}
    >
      {firstLetter}
    </Avatar>
  );
};

export default StudentAvatar;