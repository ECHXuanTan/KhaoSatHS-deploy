import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { updateTeacher } from '../../../services/teacherServices';

const UpdateTeacherModal = ({ open, onClose, onSubmit, teacher }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    department_id: ''
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        email: teacher.email,
        name: teacher.name,
        department_id: teacher.department_id
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      await updateTeacher(teacher.id, formData);
      onSubmit();
    } catch (error) {
      console.error('Không thể cập nhật giáo viên:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cập Nhật Giáo Viên</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          margin="dense"
          label="Họ và Tên"
          type="text"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
        />
        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel>Tổ Bộ Môn</InputLabel>
          <Select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            label="Tổ Bộ Môn"
          >
            <MenuItem value={1}>Toán học</MenuItem>
            <MenuItem value={2}>Vật lý</MenuItem>
            <MenuItem value={3}>Hóa học</MenuItem>
            <MenuItem value={4}>Sinh học</MenuItem>
            <MenuItem value={5}>Ngữ văn</MenuItem>
            <MenuItem value={6}>Tin học</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Cập Nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTeacherModal;
