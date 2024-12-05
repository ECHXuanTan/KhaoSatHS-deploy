// src/pages/admin/Teachers.jsx
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
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { useNavigation } from '../../components/admin/common/NavigationContext';
import { getAllTeachers, deleteTeacher, createTeacher } from '../../services/teacherServices';
import CreateTeacherModal from '../../components/admin/teachers/CreateTeacherModal';
import styles from '../../styles/admin/Teachers.module.css';
import LoadingState from '../../components/admin/common/LoadingState';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isNavExpanded } = useNavigation();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Không thể tải dữ liệu giáo viên:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeacher = async (teacherData) => {
    try {
      await createTeacher(teacherData);
      setIsModalOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error('Không thể tạo giáo viên:', error);
      throw error;
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      try {
        await deleteTeacher(id);
        fetchTeachers();
      } catch (error) {
        console.error('Không thể xóa giáo viên:', error);
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
        <h1>Quản Lý Giáo Viên</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm Giáo Viên Mới
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
                  <TableCell>Email</TableCell>
                  <TableCell>Họ và Tên</TableCell>
                  <TableCell>Tổ Bộ Môn</TableCell>
                  <TableCell>Ngày Tạo</TableCell>
                  <TableCell align="right">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={teacher.department_name}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(teacher.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" title="Chỉnh sửa">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTeacher(teacher.id)}
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
            count={teachers.length}
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

      <CreateTeacherModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTeacher}
      />
    </div>
  );
};

export default Teachers;
