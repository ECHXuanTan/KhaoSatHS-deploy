import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import styles from '../styles/classes/AddStudentModal.module.css';

const AddStudentModal = ({ open, onClose, onSubmit }) => {
  const [studentId, setStudentId] = useState('');
  
  const handleSubmit = async () => {
    await onSubmit(studentId);
    setStudentId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm Học Sinh</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Mã Học Sinh"
          fullWidth
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className={styles.input}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentModal;