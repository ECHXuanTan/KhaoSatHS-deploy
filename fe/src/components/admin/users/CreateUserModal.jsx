import React, { useState } from 'react';
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

const CreateUserModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (!formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
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
      password: ''
    });
    setErrors({});
    onClose();
  };

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
        <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
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
            <TextField
              name="password"
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              required
            />
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
              'Tạo người dùng'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUserModal;