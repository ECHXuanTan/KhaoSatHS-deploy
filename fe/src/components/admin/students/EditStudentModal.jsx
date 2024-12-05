import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { getStudentById, updateStudent } from '../../../services/studentServices';
import styles from '../styles/students/EditStudentModal.module.css';

const EditStudentModal = ({ open, onClose, onSuccess, studentId }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    base_class: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (open && studentId) {
      fetchStudentData();
    }
  }, [open, studentId]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const data = await getStudentById(studentId);
      setFormData({
        id: data.id,
        name: data.name,
        email: data.email,
        base_class: data.base_class,
      });
    } catch (error) {
      setErrors({ submit: 'Không thể tải thông tin học sinh' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
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
      setSubmitLoading(true);
      try {
        await updateStudent(studentId, formData);
        onSuccess();
        onClose();
      } catch (error) {
        setErrors({ submit: error.message || 'Có lỗi xảy ra khi cập nhật' });
      } finally {
        setSubmitLoading(false);
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

  if (loading) {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogContent className={styles.loadingContent}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={!submitLoading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle>Chỉnh Sửa Thông Tin Học Sinh</DialogTitle>
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
            disabled
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
          <Button 
            onClick={onClose}
            disabled={submitLoading}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <CircularProgress size={20} color="inherit" className={styles.buttonProgress} />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditStudentModal;