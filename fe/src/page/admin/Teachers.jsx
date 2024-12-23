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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUpload from '@mui/icons-material/CloudUpload';
import { format } from 'date-fns';
import { useNavigation } from '../../components/admin/common/NavigationContext';
import { getAllTeachers, deleteTeacher, createTeacher } from '../../services/teacherServices';
import CreateTeacherModal from '../../components/admin/teachers/CreateTeacherModal';
import TeacherExcelUploadModal from '../../components/admin/teachers/TeacherExcelUploadModal';
import UpdateTeacherModal from '../../components/admin/teachers/UpdateTeacherModal';
import styles from '../../styles/admin/Teachers.module.css';
import LoadingState from '../../components/admin/common/LoadingState';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
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

  const handleUpdateTeacher = async (teacherData) => {
    try {
      setIsUpdateModalOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error('Không thể cập nhật giáo viên:', error);
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

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (departmentFilter === '' || teacher.department_name === departmentFilter)
  );

  return (
    <div className={`${styles.pageContainer} ${isNavExpanded ? styles.expanded : ''}`}>
      <h1 className={styles.pageTitle}>Quản Lý Giáo Viên</h1>
      <div className={styles.headerActions}>
        <div className={styles.filtersContainer}>
          <TextField
            label="Tìm kiếm giáo viên"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FormControl variant="outlined" size="small" className={styles.departmentSelect}>
            <InputLabel>Tổ Bộ Môn</InputLabel>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              label="Tổ Bộ Môn"
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              {[...new Set(teachers.map((teacher) => teacher.department_name))].map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUpload />}
            onClick={() => setIsExcelModalOpen(true)}
          >
            Nhập từ Excel
          </Button>
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
                {filteredTeachers
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
                        <IconButton
                          color="primary"
                          title="Chỉnh sửa"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setIsUpdateModalOpen(true);
                          }}
                        >
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
            count={filteredTeachers.length}
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

      <UpdateTeacherModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateTeacher}
        teacher={selectedTeacher}
      />

      <TeacherExcelUploadModal
        open={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onSuccess={fetchTeachers}
      />
    </div>
  );
};

export default Teachers;