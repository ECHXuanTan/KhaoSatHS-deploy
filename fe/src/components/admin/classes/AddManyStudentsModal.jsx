import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import styles from '../styles/classes/AddManyStudentsModal.module.css';

const TEMPLATE_HEADERS = ['Mã Học Sinh'];
const SAMPLE_DATA = [{ 'Mã Học Sinh': '240327' }, { 'Mã Học Sinh': '240328' }];

const AddManyStudentsModal = ({ open, onClose, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_DATA);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    worksheet['!cols'] = [{ wch: 15 }];
    XLSX.writeFile(workbook, 'student_ids_template.xlsx');
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError('Vui lòng chỉ tải lên file Excel');
      return;
    }

    setLoading(true);
    setError('');
    setFile(selectedFile);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const studentIds = jsonData.map(row => row['Mã Học Sinh']?.toString()).filter(Boolean);
      
      if (studentIds.length === 0) {
        throw new Error('Không tìm thấy dữ liệu hợp lệ');
      }

      setPreview(studentIds.slice(0, 3));
    } catch (error) {
      setError('Lỗi đọc file: ' + error.message);
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const studentIds = jsonData.map(row => row['Mã Học Sinh']?.toString()).filter(Boolean);
      
      await onSubmit(studentIds);
      onClose();
      resetState();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setLoading(false);
    setError('');
    setPreview([]);
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm Nhiều Học Sinh</DialogTitle>
      <DialogContent>
        <div className={styles.uploadContainer}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
            className={styles.templateButton}
          >
            Tải File Mẫu
          </Button>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className={styles.fileInput}
            id="excel-upload"
            disabled={loading}
          />
          <label htmlFor="excel-upload" className={styles.uploadLabel}>
            <CloudUploadIcon className={styles.uploadIcon} />
            <Typography>{file ? file.name : 'Chọn File Excel'}</Typography>
          </label>

          {loading && (
            <div className={styles.progress}>
              <LinearProgress />
              <Typography variant="body2">Đang xử lý...</Typography>
            </div>
          )}

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          {preview.length > 0 && (
            <div className={styles.preview}>
              <Typography variant="subtitle2">Xem trước (3 dòng đầu):</Typography>
              <pre>{JSON.stringify(preview, null, 2)}</pre>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!file || loading}
        >
          Tải lên
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddManyStudentsModal;