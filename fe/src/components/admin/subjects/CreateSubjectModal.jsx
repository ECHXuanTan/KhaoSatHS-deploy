// src/components/admin/subjects/CreateSubjectModal.jsx
import React, { useState } from 'react';
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
  MenuItem
} from '@mui/material';
import styles from '../styles/subjects/CreateSubjectModal.module.css';

const CreateSubjectModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department_id: ''
  });

  const departments = [
    { id: 1, name: 'Toán học' },
    { id: 2, name: 'Vật lý' },
    { id: 3, name: 'Sinh học' },
    { id: 4, name: 'Hóa học' },
    { id: 5, name: 'Ngữ văn' },
    { id: 6, name: 'Tin học' },
    { id: 7, name: 'Khoa học Xã hội' },
    { id: 8, name: 'Tiếng Anh' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      id: '',
      name: '',
      department_id: ''
    });
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
        Thêm Môn Học Mới
      </DialogTitle>
      <DialogContent dividers>
        <div className={styles.formGroup}>
          <TextField
            name="id"
            label="Mã môn học"
            value={formData.id}
            onChange={handleInputChange}
            fullWidth
            required
            placeholder="VD: TOAN, LY, HOA"
          />
        </div>

        <div className={styles.formGroup}>
          <TextField
            name="name"
            label="Tên môn học"
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
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!formData.id || !formData.name || !formData.department_id}
        >
          Thêm môn học
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSubjectModal;