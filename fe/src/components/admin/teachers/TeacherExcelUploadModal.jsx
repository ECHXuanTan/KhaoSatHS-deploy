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
  Box
} from '@mui/material';
import CloudUpload from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import { createManyTeachers } from '../../../services/teacherServices';

const TEMPLATE_HEADERS = [
  { field: 'email', label: 'Email' },
  { field: 'name', label: 'Họ và Tên' },
  { field: 'department_id', label: 'Mã Tổ Bộ Môn' }
];

const SAMPLE_DATA = [
  { email: 'giaovien1@ptnk.edu.vn', name: 'Nguyễn Văn A', department_id: '1' },
  { email: 'giaovien2@ptnk.edu.vn', name: 'Trần Thị B', department_id: '1' }
];

const HEADER_MAPPING = {
  'Email': 'email',
  'Họ và Tên': 'name',
  'Mã Tổ Bộ Môn': 'department_id'
};

const DEPARTMENT_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const TeacherExcelUploadModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_DATA);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers');

    const headers = TEMPLATE_HEADERS.map(h => h.label);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    const maxWidths = headers.map(h => ({ wch: h.length + 5 }));
    worksheet['!cols'] = maxWidths;

    XLSX.writeFile(workbook, 'teachers_template.xlsx');
  };

  const validateEmails = (data) => {
    const emails = new Set();
    const duplicates = new Set();
    
    const errors = [];
    data.forEach((item, index) => {
      if (!item.email) {
        errors.push(`Dòng ${index + 2}: Thiếu email`);
      } else if (emails.has(item.email)) {
        duplicates.add(`Dòng ${index + 2}: ${item.email}`);
      }
      emails.add(item.email);
    });

    if (duplicates.size > 0) {
      errors.push(`Email trùng lặp: ${Array.from(duplicates).join(', ')}`);
    }

    return errors;
  };

  const validateData = (data) => {
    const errors = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2;

      if (!row.name || row.name.trim().length === 0) {
        errors.push(`Dòng ${rowNumber}: Thiếu họ tên`);
      } else if (row.name.length > 100) {
        errors.push(`Dòng ${rowNumber}: Họ tên không được vượt quá 100 ký tự`);
      }

      if (!row.department_id) {
        errors.push(`Dòng ${rowNumber}: Thiếu mã tổ bộ môn`);
      } else if (!DEPARTMENT_IDS.includes(row.department_id)) {
        errors.push(`Dòng ${rowNumber}: Mã tổ bộ môn không hợp lệ`);
      }
    });

    const emailErrors = validateEmails(data);
    errors.push(...emailErrors);

    return errors;
  };

  const processExcelData = (worksheet) => {
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length < 2) {
      throw new Error('File không có dữ liệu');
    }

    const headers = data[0];
    const requiredHeaders = Object.keys(HEADER_MAPPING);
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      throw new Error(`File thiếu các cột: ${missingHeaders.join(', ')}`);
    }

    const rows = data.slice(1).filter(row => row.length > 0);
    if (rows.length === 0) {
      throw new Error('File không có dữ liệu');
    }

    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        const mappedField = HEADER_MAPPING[header];
        if (mappedField && row[index] !== undefined) {
          obj[mappedField] = String(row[index]).trim();
        }
      });
      return obj;
    });
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

      const validationErrors = validateData(jsonData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      setPreview(jsonData.slice(0, 3));
    } catch (error) {
      setError(error.message || 'Lỗi xử lý file');
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
      
      await createManyTeachers(jsonData);
      onSuccess();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setError('');
      setPreview([]);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>Nhập Danh Sách Giáo Viên từ Excel</DialogTitle>
      <DialogContent>
        <Stack 
          spacing={2} 
          sx={{ 
            padding: '16px 0',
            '@media (max-width: 600px)': {
              padding: '8px 0'
            }
          }}
        >
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
            sx={{ alignSelf: 'flex-start' }}
          >
            Tải Template Excel
          </Button>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="teacher-excel-upload"
            disabled={loading}
          />

          <Box
            component="label"
            htmlFor="teacher-excel-upload"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: { xs: '16px', md: '20px' },
              border: '2px dashed #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease',
              '&:hover': {
                borderColor: '#1976d2'
              }
            }}
          >
            <CloudUpload 
              sx={{ 
                fontSize: { xs: 36, md: 48 },
                color: '#757575',
                mb: 1
              }}
            />
            <Typography>{file ? file.name : 'Chọn File Excel'}</Typography>
          </Box>

          {loading && (
            <Box sx={{ width: '100%', my: 2 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Đang xử lý...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert 
              severity="error"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {error}
            </Alert>
          )}

          {preview.length > 0 && (
            <Box sx={{
              mt: 2,
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1
            }}>
              <Typography variant="subtitle2">
                Xem trước (3 dòng đầu):
              </Typography>
              <Box
                component="pre"
                sx={{
                  mt: 1,
                  p: 1,
                  bgcolor: 'white',
                  borderRadius: 1,
                  overflowX: 'auto'
                }}
              >
                {JSON.stringify(preview, null, 2)}
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: { xs: '12px 16px', md: '16px 24px' } }}>
        <Button onClick={handleClose} disabled={loading}>
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

export default TeacherExcelUploadModal;