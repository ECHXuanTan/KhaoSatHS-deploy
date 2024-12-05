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
  Chip,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { useNavigation } from '../../components/admin/common/NavigationContext';
import {
  getAllSubjects,
  deleteSubject,
  createSubject,
} from '../../services/subjectServices';
import CreateSubjectModal from '../../components/admin/subjects/CreateSubjectModal';
import styles from '../../styles/admin/Subjects.module.css';

const LoadingState = () => {
  const styles = {
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: '16px',
    },
    loadingText: {
      color: '#666',
      fontSize: '16px',
    },
  };

  return (
    <Box style={styles.loadingContainer}>
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body1" style={styles.loadingText}>
        Đang tải...
      </Typography>
    </Box>
  );
};

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isNavExpanded } = useNavigation();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Không thể tải dữ liệu môn học:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubject = async (subjectData) => {
    try {
      await createSubject(subjectData);
      setIsModalOpen(false);
      fetchSubjects();
    } catch (error) {
      console.error('Không thể tạo môn học:', error);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      try {
        await deleteSubject(id);
        fetchSubjects();
      } catch (error) {
        console.error('Không thể xóa môn học:', error);
      }
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
    <div className={`${styles.pageContainer} ${isNavExpanded ? styles.expanded : ''}`}>
      <div className={styles.header}>
        <h1>Quản Lý Môn Học</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm Môn Học Mới
        </Button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <Paper className={styles.tableContainer}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Môn</TableCell>
                  <TableCell>Tên Môn Học</TableCell>
                  <TableCell>Tổ Bộ Môn</TableCell>
                  <TableCell>Ngày Tạo</TableCell>
                  <TableCell align="right">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>{subject.id}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={subject.department_name}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(subject.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" title="Chỉnh sửa">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSubject(subject.id)}
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
            count={subjects.length}
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

      <CreateSubjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubject}
      />
    </div>
  );
};

export default Subjects;
