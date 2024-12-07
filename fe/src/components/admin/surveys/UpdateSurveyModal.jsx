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
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';

const UpdateSurveyModal = ({ open, onClose, onUpdate, survey }) => {
  const [formData, setFormData] = useState({
    subject_id: '',
    form_url: '',
    start_date: null,
    end_date: null,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (survey) {
      setFormData({
        subject_id: survey.subject_id || '',
        form_url: survey.form_url || '',
        start_date: survey.start_date ? format(new Date(survey.start_date), 'yyyy-MM-dd') : '',
        end_date: survey.end_date ? format(new Date(survey.end_date), 'yyyy-MM-dd') : '',
        is_active: survey.is_active
      });
    }
  }, [survey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onUpdate(survey.id, formData);
      onClose();
    } catch (error) {
      setError(error.message || 'Không thể cập nhật khảo sát');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '8px',
          padding: '16px'
        }
      }}
    >
      <DialogTitle style={{ fontSize: '24px', fontWeight: 500 }}>
        Cập Nhật Khảo Sát
      </DialogTitle>
      
      <DialogContent style={{ paddingTop: '20px' }}>
        {error && (
          <Alert 
            severity="error" 
            style={{ marginBottom: '16px' }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            fullWidth
            label="Đường dẫn Google Form"
            value={formData.form_url}
            onChange={(e) => setFormData(prev => ({ ...prev, form_url: e.target.value }))}
          />

          <div style={{ display: 'flex', gap: '16px' }}>
            <TextField
              type="date"
              label="Ngày bắt đầu"
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
              value={formData.end_date || ''}
              onChange={(e) => handleDateChange('end_date', e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>

          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value }))}
              label="Trạng thái"
            >
              <MenuItem value={true}>Đang hoạt động</MenuItem>
              <MenuItem value={false}>Đã đóng</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>

      <DialogActions style={{ padding: '16px' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          style={{ marginRight: '8px' }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ minWidth: '100px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateSurveyModal;