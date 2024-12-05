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
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import { createManyStudents } from '../../../services/studentServices';
import styles from '../styles/students/ExcelUploadModal.module.css';

const TEMPLATE_HEADERS = [
  { field: 'id', label: 'Mã Học Sinh' },
  { field: 'email', label: 'Email' },
  { field: 'name', label: 'Họ và Tên' },
  { field: 'base_class', label: 'Lớp' },
];

const SAMPLE_DATA = [
  { id: '240327', email: 'student1@ptnk.edu.vn', name: 'Nguyễn Văn A', base_class: '10 Anh' },
  { id: '240328', email: 'student2@ptnk.edu.vn', name: 'Trần Thị B', base_class: '10 Tin' },
];

const HEADER_MAPPING = {
  'Mã Học Sinh': 'id',
  'Email': 'email',
  'Họ và Tên': 'name',
  'Lớp': 'base_class'
};

const ExcelUploadModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_DATA);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const headers = TEMPLATE_HEADERS.map(h => h.label);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    const maxWidths = headers.map(h => ({ wch: h.length + 5 }));
    worksheet['!cols'] = maxWidths;

    XLSX.writeFile(workbook, 'student_template.xlsx');
  };

  const processExcelData = (worksheet) => {
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length < 2) return [];

    const headers = data[0];
    const rows = data.slice(1);

    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        const mappedField = HEADER_MAPPING[header];
        if (mappedField && row[index] !== undefined) {
          obj[mappedField] = row[index].toString();
        }
      });
      return obj;
    }).filter(row => Object.keys(row).length > 0);
  };

  const validateStudent = (student) => {
    const errors = [];
    if (!student.id) errors.push('Missing ID');
    if (!student.email) {
      errors.push('Missing email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
      errors.push('Invalid email format');
    }
    if (!student.name) errors.push('Missing name');
    if (!student.base_class) errors.push('Missing class');
    return errors;
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError('Vui lòng chỉ tải lên file Excel (.xlsx hoặc .xls)');
      return;
    }

    setLoading(true);
    setError('');
    setFile(selectedFile);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = processExcelData(worksheet);

      const validationErrors = [];
      jsonData.forEach((student, index) => {
        const rowErrors = validateStudent(student);
        if (rowErrors.length) {
          validationErrors.push(`Dòng ${index + 2}: ${rowErrors.join(', ')}`);
        }
      });

      if (validationErrors.length) {
        setError(validationErrors.join('\n'));
        setFile(null);
      } else {
        setPreview(jsonData.slice(0, 3));
      }
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
    setError('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = processExcelData(worksheet);

      await createManyStudents(jsonData);
      onSuccess();
      onClose();
      resetState();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
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
      <DialogTitle>Import Danh Sách Học Sinh</DialogTitle>
      <DialogContent>
        <div className={styles.uploadContainer}>
          <Button
            variant="outlined"
            color="primary"
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

export default ExcelUploadModal;