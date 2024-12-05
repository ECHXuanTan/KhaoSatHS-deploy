import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress
} from '@mui/material';
import { getUserById, updateUser } from '../../../services/userServices';

const EditUserModal = ({ open, onClose, onSuccess, userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userId && open) {
      fetchUserData();
    }
  }, [userId, open]);

  const fetchUserData = async () => {
    setFetchLoading(true);
    try {
      const userData = await getUserById(userId);
      setFormData({
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Không thể tải thông tin người dùng'
      }));
      handleClose();
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.role) {
      newErrors.role = 'Vui lòng chọn vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateUser(userId, formData);
      onSuccess();
      handleClose();
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
    });
    setErrors({});
    onClose();
  };

  if (fetchLoading) {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          gap: '16px'
        }}>
          <CircularProgress />
          <div>Đang tải thông tin...</div>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <form 
        onSubmit={handleSubmit} 
        style={{ width: '100%' }}
      >
        <DialogTitle>Chỉnh Sửa Thông Tin Người Dùng</DialogTitle>
        <DialogContent>
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '12px 0',
              minHeight: '300px',
              '@media (max-width: 600px)': {
                gap: '16px',
                minHeight: 'auto'
              }
            }}
          >
            <TextField
              name="name"
              label="Họ và Tên"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Vai trò"
                required
              >
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>Giáo viên</MenuItem>
                <MenuItem value={3}>Phụ huynh</MenuItem>
                <MenuItem value={4}>Học sinh</MenuItem>
              </Select>
            </FormControl>
            {errors.submit && (
              <div style={{
                color: '#d32f2f',
                fontSize: '0.875rem',
                marginTop: '8px',
                textAlign: 'center'
              }}>
                {errors.submit}
              </div>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{
          padding: '16px 24px',
          '@media (max-width: 600px)': {
            padding: '12px 16px'
          }
        }}>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserModal;