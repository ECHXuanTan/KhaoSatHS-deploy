import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingState = () => {
  const styles = {
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: '16px',
    },
    loadingText: {
      color: '#666',
      fontSize: '16px',
    },
  };

  return (
    <Box style={styles.loadingContainer}>
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body1" style={styles.loadingText}>
        Đang tải...
      </Typography>
    </Box>
  );
};

export default LoadingState;
