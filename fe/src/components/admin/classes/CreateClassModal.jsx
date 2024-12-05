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
  FormHelperText,
} from '@mui/material';
import { getAllSubjects } from '../../../services/subjectServices';
import styles from '../styles/classes/CreateClassModal.module.css';

const SEMESTERS = ['Học kỳ 1', 'Học kỳ 2'];
const GRADES = [10, 11, 12];

const CreateClassModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    subject_id: '',
    grade: '',
    semester: '',
  });

  const [errors, setErrors] = useState({});
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (open) {
      fetchSubjects();
      resetForm();
    }
  }, [open]);

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Không thể tải danh sách môn học:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      subject_id: '',
      grade: '',
      semester: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id.trim()) {
      newErrors.id = 'Vui lòng nhập mã lớp';
    }
    if (!formData.subject_id) {
      newErrors.subject_id = 'Vui lòng chọn môn học';
    }
    if (!formData.grade) {
      newErrors.grade = 'Vui lòng chọn khối';
    }
    if (!formData.semester) {
      newErrors.semester = 'Vui lòng chọn học kỳ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
      resetForm();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
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
        Thêm Lớp Học Mới
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={styles.dialogContent}>
          <TextField
            name="id"
            label="Mã lớp"
            fullWidth
            value={formData.id}
            onChange={handleChange}
            error={!!errors.id}
            helperText={errors.id}
            className={styles.formField}
          />

          <FormControl 
            fullWidth 
            error={!!errors.subject_id}
            className={styles.formField}
          >
            <InputLabel>Môn học</InputLabel>
            <Select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              label="Môn học"
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
            {errors.subject_id && (
              <FormHelperText>{errors.subject_id}</FormHelperText>
            )}
          </FormControl>

          <FormControl 
            fullWidth 
            error={!!errors.grade}
            className={styles.formField}
          >
            <InputLabel>Khối</InputLabel>
            <Select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              label="Khối"
            >
              {GRADES.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  Khối {grade}
                </MenuItem>
              ))}
            </Select>
            {errors.grade && (
              <FormHelperText>{errors.grade}</FormHelperText>
            )}
          </FormControl>

          <FormControl 
            fullWidth 
            error={!!errors.semester}
            className={styles.formField}
          >
            <InputLabel>Học kỳ</InputLabel>
            <Select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              label="Học kỳ"
            >
              {SEMESTERS.map((semester) => (
                <MenuItem key={semester} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
            {errors.semester && (
              <FormHelperText>{errors.semester}</FormHelperText>
            )}
          </FormControl>
        </DialogContent>

        <DialogActions className={styles.dialogActions}>
          <Button onClick={onClose} className={styles.cancelButton}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            className={styles.submitButton}
          >
            Tạo mới
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateClassModal;