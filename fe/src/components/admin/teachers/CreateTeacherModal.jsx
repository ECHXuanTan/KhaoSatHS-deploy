// components/admin/teachers/CreateTeacherModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import styles from '../styles/teachers/CreateTeacherModal.module.css';
import { getAllDepartments } from '../../../services/departmentServices';

const CreateTeacherModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    department_id: ''
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);
    } catch (error) {
      setError('Không thể tải danh sách tổ bộ môn');
      console.error('Error fetching departments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit(formData);
      setFormData({
        email: '',
        name: '',
        department_id: ''
      });
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tạo giáo viên');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const isFormValid = () => {
    return (
      formData.email && 
      formData.name && 
      formData.department_id && 
      isValidEmail(formData.email)
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle className={styles.dialogTitle}>
        Thêm Giáo Viên Mới
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" className={styles.alert}>
            {error}
          </Alert>
        )}

        <div className={styles.formGroup}>
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
            error={formData.email && !isValidEmail(formData.email)}
            helperText={formData.email && !isValidEmail(formData.email) 
              ? "Email không hợp lệ" 
              : ""
            }
          />
        </div>

        <div className={styles.formGroup}>
          <TextField
            name="name"
            label="Họ và tên"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </div>

        <div className={styles.formGroup}>
          <FormControl fullWidth required>
            <InputLabel>Tổ bộ môn</InputLabel>
            <Select
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              label="Tổ bộ môn"
            >
              {departments.map(dept => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Thêm giáo viên'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTeacherModal;