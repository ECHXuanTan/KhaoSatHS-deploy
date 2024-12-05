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
  FormControlLabel,
  Switch,
  Chip,
  Box
} from '@mui/material';
import { getAllSubjects } from '../../../services/subjectServices';
import styles from '../styles/surveys/CreateSurveyModal.module.css';

const GRADES = [10, 11, 12];

const CreateSurveyModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'GENERAL',
    subject_id: '',
    grades: [],
    form_url: '',
    sheet_url: '',
    start_date: null,
    end_date: null,
    is_active: true,
    questions: []
  });

  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSubjects();
    }
  }, [open]);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Không thể tải danh sách môn học:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      grades: name === 'type' && value === 'GENERAL' ? [] : prev.grades
    }));
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      is_active: e.target.checked
    }));
  };

  const handleGradeToggle = (grade) => {
    setFormData(prev => {
      const grades = prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade].sort();
      return { ...prev, grades };
    });
  };

  const isGradeSelected = (grade) => {
    return formData.grades.includes(grade);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      name: '',
      type: 'GENERAL',
      subject_id: '',
      grades: [],
      form_url: '',
      sheet_url: '',
      start_date: null,
      end_date: null,
      is_active: true,
      questions: []
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle className={styles.dialogTitle}>
        Tạo Khảo Sát Mới
      </DialogTitle>
      <DialogContent dividers>
        <div className={styles.formGroup}>
          <TextField
            name="name"
            label="Tên khảo sát"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </div>

        <div className={styles.formRow}>
          <FormControl fullWidth>
            <InputLabel>Loại khảo sát</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              label="Loại khảo sát"
            >
              <MenuItem value="GENERAL">Chung</MenuItem>
              <MenuItem value="SUBJECT_SPECIFIC">Theo môn</MenuItem>
            </Select>
          </FormControl>

          {formData.type === 'SUBJECT_SPECIFIC' && (
            <>
              <FormControl fullWidth>
                <InputLabel>Môn học</InputLabel>
                <Select
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleInputChange}
                  label="Môn học"
                  required={formData.type === 'SUBJECT_SPECIFIC'}
                  disabled={isLoading}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </div>

        {formData.type === 'SUBJECT_SPECIFIC' && (
          <div className={styles.formGroup}>
            <Box sx={{ mt: 2 }}>
              <InputLabel sx={{ mb: 1 }}>Chọn khối</InputLabel>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {GRADES.map((grade) => (
                  <Chip
                    key={grade}
                    label={`Khối ${grade}`}
                    onClick={() => handleGradeToggle(grade)}
                    color={isGradeSelected(grade) ? "primary" : "default"}
                    variant={isGradeSelected(grade) ? "filled" : "outlined"}
                    clickable
                    sx={{ p: 2 }}
                  />
                ))}
              </Box>
            </Box>
          </div>
        )}

        <div className={styles.formGroup}>
          <TextField
            name="form_url"
            label="Link Google Form"
            value={formData.form_url}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </div>

        <div className={styles.formGroup}>
          <TextField
            name="sheet_url"
            label="Link Google Sheet"
            value={formData.sheet_url}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </div>

        <div className={styles.formRow}>
          <TextField
            type="date"
            label="Ngày bắt đầu"
            name="start_date"
            value={formData.start_date || ''}
            onChange={(e) => handleDateChange('start_date', e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="date"
            label="Ngày kết thúc"
            name="end_date"
            value={formData.end_date || ''}
            onChange={(e) => handleDateChange('end_date', e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={handleSwitchChange}
                name="is_active"
                color="primary"
              />
            }
            label="Kích hoạt khảo sát"
          />
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
          disabled={
            formData.type === 'SUBJECT_SPECIFIC' && 
            (formData.grades.length === 0 || !formData.subject_id)
          }
        >
          Tạo khảo sát
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSurveyModal;