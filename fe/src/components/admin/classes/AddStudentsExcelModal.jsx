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
      console.log('Data from Excel:', data); // Log the raw data for debugging
      const classStudentMap = processData(data);
      console.log('Processed Class-Student Map:', classStudentMap); // Log processed data for debugging
      await addStudentsToMultipleClasses(classStudentMap);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error during file processing:', error); // Log error for debugging
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
  
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log('Raw Excel Data:', jsonData);
  
          if (jsonData.length === 0) {
            throw new Error('File Excel không có dữ liệu');
          }
  
          const [headerRow, ...dataRows] = jsonData;
  
          console.log('Header Row:', headerRow);
          console.log('Data Rows:', dataRows);
  
          // Ensure the header row contains the required keys
          const normalizedHeaderRow = headerRow.map((header) => header?.trim().toLowerCase());
          if (!normalizedHeaderRow.includes('mã lớp') || !normalizedHeaderRow.includes('mã học sinh')) {
            throw new Error('File Excel thiếu cột "Mã Lớp" hoặc "Mã Học Sinh"');
          }
  
          // Map data rows into objects using the header row
          const processedData = dataRows.map((row, index) => {
            const rowData = {};
            headerRow.forEach((header, colIndex) => {
              rowData[header?.trim()] = row[colIndex];
            });
            rowData.__rowNum__ = index + 2; // Add row number for debugging
            return rowData;
          });
  
          console.log('Processed Data:', processedData);
          resolve(processedData);
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
  
    data.forEach((row, index) => {
      console.log(`Processing row ${index + 1}:`, row); // Log each row for debugging
  
      // Normalize keys for dynamic matching
      const normalizedKeys = Object.keys(row).reduce((acc, key) => {
        acc[key.trim().toLowerCase()] = key; // Map normalized keys to original keys
        return acc;
      }, {});
  
      console.log('Normalized Keys:', normalizedKeys); // Log normalized keys
  
      // Dynamically find keys for "Mã Lớp" and "Mã Học Sinh"
      const classKey = normalizedKeys['mã lớp'];
      const studentKey = normalizedKeys['mã học sinh'];
  
      if (!classKey || !studentKey) {
        throw new Error('File Excel thiếu cột "Mã Lớp" hoặc "Mã Học Sinh"');
      }
  
      const classId = row[classKey]?.toString().trim();
      const studentId = row[studentKey]?.toString().trim();
  
      if (!classId || !studentId) {
        throw new Error(`Dòng ${index + 1} thiếu dữ liệu ở cột "Mã Lớp" hoặc "Mã Học Sinh"`);
      }
  
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
        'Mã Học Sinh': '240440',
      },
      {
        'Mã Lớp': 'Ch_11 SINHLN',
        'Mã Học Sinh': '240441',
      },
      {
        'Mã Lớp': 'Ch_11SINH',
        'Mã Học Sinh': '240501',
      },
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
