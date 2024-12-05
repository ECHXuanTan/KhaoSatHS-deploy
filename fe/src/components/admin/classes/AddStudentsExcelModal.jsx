import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import styles from '../styles/classes/AddStudentsExcelModal.module.css';
import { addStudentsToMultipleClasses } from '../../../services/classServices';

const AddStudentsExcelModal = ({ open, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const processExcelFile = async (file) => {
    setIsProcessing(true);
    setError(null);

    try {
      const data = await readExcelFile(file);
      const classStudentMap = processData(data);
      await addStudentsToMultipleClasses(classStudentMap);
      onSuccess?.();
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            throw new Error('File Excel không có dữ liệu');
          }
          
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Không thể đọc file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const processData = (data) => {
    const classStudentMap = {};

    data.forEach(row => {
      if (!row['Mã Lớp'] || !row['Mã Học Sinh']) {
        throw new Error('File Excel thiếu cột "Mã Lớp" hoặc "Mã Học Sinh"');
      }

      const classId = row['Mã Lớp'].toString().trim();
      const studentId = row['Mã Học Sinh'].toString().trim();

      if (!classStudentMap[classId]) {
        classStudentMap[classId] = [];
      }
      
      if (!classStudentMap[classId].includes(studentId)) {
        classStudentMap[classId].push(studentId);
      }
    });

    if (Object.keys(classStudentMap).length === 0) {
      throw new Error('Không tìm thấy dữ liệu hợp lệ trong file');
    }

    return classStudentMap;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExtension)) {
      setError('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    processExcelFile(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Mã Lớp': 'Ch_11 SINHLN',
        'Mã Học Sinh': '240440'
      },
      {
        'Mã Lớp': 'Ch_11 SINHLN',
        'Mã Học Sinh': '240441'
      },
      {
        'Mã Lớp': 'Ch_11SINH',
        'Mã Học Sinh': '240501'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_them_hoc_sinh.xlsx');
  };

  return (
    <Dialog open={open} onClose={!isProcessing ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm Học Sinh Vào Lớp Từ Excel</DialogTitle>
      <DialogContent>
        <Box className={styles.content}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Lỗi</AlertTitle>
              {error}
            </Alert>
          )}

          <Typography gutterBottom>
            Tải lên file Excel với các cột sau:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 2 }}>
            • Mã Lớp (bắt buộc)<br />
            • Mã Học Sinh (bắt buộc)
          </Typography>

          <Button
            variant="text"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
            sx={{ mb: 2 }}
          >
            Tải file mẫu
          </Button>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="excel-upload"
            disabled={isProcessing}
          />
          
          <label htmlFor="excel-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={isProcessing}
              fullWidth
            >
              Chọn File Excel
            </Button>
          </label>

          {isProcessing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentsExcelModal;