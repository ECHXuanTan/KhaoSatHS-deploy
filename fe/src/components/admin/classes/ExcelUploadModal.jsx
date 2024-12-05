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
import { createManyClasses } from '../../../services/classServices';
import styles from '../styles/classes/ExcelUploadModal.module.css';

const TEMPLATE_HEADERS = [
  { field: 'id', label: 'Mã Lớp' },
  { field: 'subject_id', label: 'Mã Môn Học' },
  { field: 'grade', label: 'Khối' },
  { field: 'semester', label: 'Học Kỳ' },
];

const SAMPLE_DATA = [
  { id: 'L12A1', subject_id: 'MATH', grade: 12, semester: 'Học kỳ 1' },
  { id: 'L12A2', subject_id: 'PHY', grade: 12, semester: 'Học kỳ 1' },
];

const HEADER_MAPPING = {
  'Mã Lớp': 'id',
  'Mã Môn Học': 'subject_id',
  'Khối': 'grade',
  'Học Kỳ': 'semester'
};

const ExcelUploadModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_DATA);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Classes');

    const headers = TEMPLATE_HEADERS.map(h => h.label);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    const maxWidths = headers.map(h => ({ wch: h.length + 5 }));
    worksheet['!cols'] = maxWidths;

    XLSX.writeFile(workbook, 'class_template.xlsx');
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
          obj[mappedField] = mappedField === 'grade' ? Number(row[index]) : row[index];
        }
      });
      return obj;
    }).filter(row => Object.keys(row).length > 0);
  };

  const validateRow = (row) => {
    const errors = [];
    const required = ['id', 'subject_id', 'grade', 'semester'];
    
    required.forEach(field => {
      if (!row[field]) errors.push(`Missing ${field}`);
    });

    if (row.grade && !Number.isInteger(Number(row.grade))) {
      errors.push('Grade must be a number');
    }

    return errors;
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload only Excel files (.xlsx or .xls)');
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
      jsonData.forEach((row, index) => {
        const rowErrors = validateRow(row);
        if (rowErrors.length) {
          validationErrors.push(`Row ${index + 2}: ${rowErrors.join(', ')}`);
        }
      });

      if (validationErrors.length) {
        setError(validationErrors.join('\n'));
        setFile(null);
      } else {
        setPreview(jsonData.slice(0, 3));
      }
    } catch (error) {
      setError('Error reading file: ' + error.message);
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

      await createManyClasses(jsonData);
      onSuccess();
      onClose();
      resetState();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const resetState = () => {
    setFile(null);
    setLoading(false);
    setError('');
    setPreview([]);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import Classes from Excel</DialogTitle>
      <DialogContent>
        <div className={styles.uploadContainer}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
            className={styles.templateButton}
          >
            Download Template
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
            <Typography>{file ? file.name : 'Select Excel File'}</Typography>
          </label>

          {loading && (
            <div className={styles.progress}>
              <LinearProgress />
              <Typography variant="body2">Processing...</Typography>
            </div>
          )}

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          {preview.length > 0 && (
            <div className={styles.preview}>
              <Typography variant="subtitle2">Preview (first 3 rows):</Typography>
              <pre>{JSON.stringify(preview, null, 2)}</pre>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!file || loading}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelUploadModal;