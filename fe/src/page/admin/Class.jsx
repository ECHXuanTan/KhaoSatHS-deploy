import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
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
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { format } from 'date-fns';
import { useNavigation } from '../../components/admin/common/NavigationContext';
import {
  getAllClasses,
  createClass,
  deleteClass,
} from '../../services/classServices';
import { getAllSubjects } from '../../services/subjectServices';
import CreateClassModal from '../../components/admin/classes/CreateClassModal';
import ExcelUploadModal from '../../components/admin/classes/ExcelUploadModal';
import AddStudentsExcelModal from '../../components/admin/classes/AddStudentsExcelModal';
import styles from '../../styles/admin/Classes.module.css';
import LoadingState from '../../components/admin/common/LoadingState';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { isNavExpanded } = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchClasses(), fetchSubjects()]);
  }, []);

  useEffect(() => {
    filterClasses();
  }, [searchQuery, selectedSubject, classes]);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const data = await getAllClasses();
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      showToast('Không thể tải dữ liệu lớp học', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      showToast('Không thể tải dữ liệu môn học', 'error');
    }
  };

  const showToast = (message, severity = 'success') => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const filterClasses = () => {
    let filtered = [...classes];

    if (searchQuery) {
      filtered = filtered.filter(classItem => 
        classItem.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(classItem => 
        classItem.subject_id === selectedSubject
      );
    }

    setFilteredClasses(filtered);
    setPage(0);
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  const handleCreateClass = async (classData) => {
    try {
      await createClass(classData);
      setIsModalOpen(false);
      fetchClasses();
      showToast('Tạo lớp học thành công');
    } catch (error) {
      showToast('Không thể tạo lớp học', 'error');
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await deleteClass(id);
        fetchClasses();
        showToast('Xóa lớp học thành công');
      } catch (error) {
        showToast('Không thể xóa lớp học', 'error');
      }
    }
  };

  const handleAddStudentsSuccess = () => {
    showToast('Thêm học sinh vào lớp thành công');
    fetchClasses();
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
        <h1>Quản Lý Lớp Học</h1>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<GroupAddIcon />}
            onClick={() => setIsAddStudentsModalOpen(true)}
          >
            Thêm Học Sinh Vào Lớp
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<UploadIcon />}
            onClick={() => setIsExcelModalOpen(true)}
          >
            Nhập Lớp từ Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm Lớp Học Mới
          </Button>
        </Stack>
      </div>

      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Tìm kiếm theo mã lớp"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 300 } }}
          />
          <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <InputLabel>Môn học</InputLabel>
            <Select
              value={selectedSubject}
              label="Môn học"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
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
                  <TableCell>Mã Lớp</TableCell>
                  <TableCell>Môn Học</TableCell>
                  <TableCell>Học Kỳ</TableCell>
                  <TableCell>Ngày Tạo</TableCell>
                  <TableCell align="right">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClasses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>{classItem.id}</TableCell>
                      <TableCell>
                        <Chip
                          label={getSubjectName(classItem.subject_id)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{classItem.semester}</TableCell>
                      <TableCell>
                        {format(new Date(classItem.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          title="Quản lý học sinh"
                          onClick={() => navigate(`/admin/classes/${classItem.id}/students`)}
                        >
                          <PeopleIcon />
                        </IconButton>
                        <IconButton color="primary" title="Chỉnh sửa">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClass(classItem.id)}
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
            count={filteredClasses.length}
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

      <CreateClassModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateClass}
      />

      <ExcelUploadModal
        open={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onSuccess={fetchClasses}
      />

      <AddStudentsExcelModal
        open={isAddStudentsModalOpen}
        onClose={() => setIsAddStudentsModalOpen(false)}
        onSuccess={handleAddStudentsSuccess}
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

export default Classes;