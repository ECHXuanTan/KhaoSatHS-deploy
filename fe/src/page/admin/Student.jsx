import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TablePagination,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Dialog,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigation } from '../../components/admin/common/NavigationContext';
import {
  getAllStudents,
  createStudent,
  deleteStudent,
  updateStudent
} from '../../services/studentServices';
import CreateStudentModal from '../../components/admin/students/CreateStudentModal';
import EditStudentModal from '../../components/admin/students/EditStudentModal';
import ExcelUploadModal from '../../components/admin/students/ExcelUploadModal';
import styles from '../../styles/admin/Students.module.css';

const LoadingState = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: 2 
    }}
  >
    <CircularProgress size={40} thickness={4} />
    <Typography variant="body1" color="textSecondary">
      Đang tải...
    </Typography>
  </Box>
);

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, loading }) => (
  <Dialog open={open} onClose={() => !loading && onClose()}>
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Xác nhận xóa
      </Typography>
      <Typography variant="body1" paragraph>
        Bạn có chắc chắn muốn xóa học sinh này?
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </Stack>
    </Box>
  </Dialog>
);

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const { isNavExpanded } = useNavigation();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, selectedClass, students]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getAllStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Không thể tải dữ liệu học sinh:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchQuery) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(student => 
        student.base_class === selectedClass
      );
    }

    setFilteredStudents(filtered);
    setPage(0);
  };

  const getUniqueClasses = () => {
    const classes = new Set(students.map(student => student.base_class));
    return Array.from(classes).sort();
  };

  const handleCreateStudent = async (studentData) => {
    try {
      await createStudent(studentData);
      setIsCreateModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error('Không thể tạo học sinh:', error);
      throw error;
    }
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteStudent(studentToDelete.id);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error) {
      console.error('Không thể xóa học sinh:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={`${styles.pageContainer} ${isNavExpanded ? '' : styles.expanded}`}>
      <div className={styles.header}>
        <h1>Quản Lý Học Sinh</h1>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<UploadIcon />}
            onClick={() => setIsExcelModalOpen(true)}
          >
            Nhập từ Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Thêm Học Sinh Mới
          </Button>
        </Stack>
      </div>

      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Tìm kiếm theo tên hoặc mã học sinh"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 300 } }}
          />
          <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <InputLabel>Lớp</InputLabel>
            <Select
              value={selectedClass}
              label="Lớp"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {getUniqueClasses().map((className) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {isLoading ? (
        <LoadingState />
      ) : (
        <Paper className={styles.tableContainer}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Học Sinh</TableCell>
                  <TableCell>Họ và Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Lớp</TableCell>
                  <TableCell align="right">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.base_class}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => setSelectedStudent(student.id)}
                          title="Chỉnh sửa"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(student)}
                          title="Xóa"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Paper>
      )}

      <CreateStudentModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateStudent}
      />

      <EditStudentModal
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onSuccess={fetchStudents}
        studentId={selectedStudent}
      />

      <ExcelUploadModal
        open={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onSuccess={fetchStudents}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Students;