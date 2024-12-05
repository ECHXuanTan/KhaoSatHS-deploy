import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import styles from '../styles/students/CreateStudentModal.module.css'

const CreateStudentModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    base_class: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id.trim()) newErrors.id = 'Vui lòng nhập mã học sinh';
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên học sinh';
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.base_class.trim()) newErrors.base_class = 'Vui lòng nhập lớp';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData);
        resetForm();
      } catch (error) {
        setErrors({ submit: error.message });
      }
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
        [name]: undefined
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      base_class: ''
    });
    setErrors({});
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle>Thêm Học Sinh Mới</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={styles.dialogContent}>
          {errors.submit && (
            <Alert severity="error" className={styles.alert}>
              {errors.submit}
            </Alert>
          )}

          <TextField
            name="id"
            label="Mã học sinh"
            fullWidth
            value={formData.id}
            onChange={handleChange}
            error={!!errors.id}
            helperText={errors.id}
            className={styles.formField}
          />

          <TextField
            name="name"
            label="Họ và tên"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            className={styles.formField}
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            className={styles.formField}
          />

          <TextField
            name="base_class"
            label="Lớp"
            fullWidth
            value={formData.base_class}
            onChange={handleChange}
            error={!!errors.base_class}
            helperText={errors.base_class}
            className={styles.formField}
          />
        </DialogContent>

        <DialogActions className={styles.dialogActions}>
          <Button onClick={() => {
            resetForm();
            onClose();
          }}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Thêm mới
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateStudentModal;