import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, TablePagination, Stack,
  Snackbar, Alert, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getClassStudents, 
  addStudentToClass, 
  addManyStudentsToClass,
  removeStudentFromClass,
  removeAllStudentsFromClass 
} from '../../services/classServices';
import { useNavigation } from '../../components/admin/common/NavigationContext';
import LoadingState from '../../components/admin/common/LoadingState';
import AddStudentModal from '../../components/admin/classes/AddStudentModal';
import AddManyStudentsModal from '../../components/admin/classes/AddManyStudentsModal';
import styles from '../../styles/admin/ClassStudents.module.css';

const ClassStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddManyModalOpen, setIsAddManyModalOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { isNavExpanded } = useNavigation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchStudents();
  }, [id]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getClassStudents(id);
      setStudents(data);
    } catch (error) {
      setToast({
        open: true,
        message: 'Không thể tải danh sách học sinh',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (studentId) => {
    try {
      await addStudentToClass(id, studentId);
      fetchStudents();
      setToast({
        open: true,
        message: 'Thêm học sinh thành công',
        severity: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.error || 'Không thể thêm học sinh',
        severity: 'error'
      });
    }
  };

  const handleAddManyStudents = async (studentIds) => {
    try {
      await addManyStudentsToClass(id, studentIds);
      fetchStudents();
      setToast({
        open: true,
        message: `Đã thêm ${studentIds.length} học sinh thành công`,
        severity: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.error || 'Không thể thêm học sinh',
        severity: 'error'
      });
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?')) {
      try {
        await removeStudentFromClass(id, studentId);
        fetchStudents();
        setToast({
          open: true,
          message: 'Đã xóa học sinh khỏi lớp',
          severity: 'success'
        });
      } catch (error) {
        setToast({
          open: true,
          message: error.response?.data?.error || 'Không thể xóa học sinh',
          severity: 'error'
        });
      }
    }
  };

  const handleRemoveAllStudents = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả học sinh khỏi lớp?')) {
      try {
        await removeAllStudentsFromClass(id);
        fetchStudents();
        setToast({
          open: true,
          message: 'Đã xóa tất cả học sinh khỏi lớp',
          severity: 'success'
        });
      } catch (error) {
        setToast({
          open: true,
          message: error.response?.data?.error || 'Không thể xóa học sinh',
          severity: 'error'
        });
      }
    }
  };

  return (
    <div className={`${styles.pageContainer} ${isNavExpanded ? '' : styles.expanded}`}>
      <div className={styles.header}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/classes')}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>
        <div className={styles.headerContent}>
          <h1>Danh Sách Học Sinh Lớp {id}</h1>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveAllStudents}
            >
              Xóa Tất Cả
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<UploadIcon />}
              onClick={() => setIsAddManyModalOpen(true)}
            >
              Thêm từ Excel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Thêm Học Sinh
            </Button>
          </Stack>
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <Paper className={styles.tableContainer}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Họ và Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Lớp Cơ Sở</TableCell>
                  <TableCell align="right">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.base_class}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveStudent(student.id)}
                          title="Xóa khỏi lớp"
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
            count={students.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Paper>
      )}

      <AddStudentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddStudent}
      />

      <AddManyStudentsModal
        open={isAddManyModalOpen}
        onClose={() => setIsAddManyModalOpen(false)}
        onSubmit={handleAddManyStudents}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToast(prev => ({ ...prev, open: false }))} 
          severity={toast.severity}
          elevation={6}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClassStudents;