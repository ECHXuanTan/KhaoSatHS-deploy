import React, { useState, useEffect, lazy, Suspense } from 'react';
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
  Chip,
  TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import styles from '../../styles/admin/Surveys.module.css';
import { getAllSurveys, deleteSurvey, toggleSurveyActive, createSurvey } from '../../services/surveyServices';
import { useNavigation } from '../../components/admin/common/NavigationContext';
import LoadingState from '../../components/admin/common/LoadingState';

const CreateSurveyModal = lazy(() => import('../../components/admin/surveys/CreateSurveyModal'));

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isNavExpanded } = useNavigation();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSurveys();
      setSurveys(data);
    } catch (error) {
      console.error('Không thể tải dữ liệu khảo sát:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSurvey = async (surveyData) => {
    try {
      await createSurvey(surveyData);
      setIsModalOpen(false);
      fetchSurveys();
    } catch (error) {
      console.error('Không thể tạo khảo sát:', error);
    }
  };

  const handleDeleteSurvey = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khảo sát này?')) {
      try {
        await deleteSurvey(id);
        fetchSurveys();
      } catch (error) {
        console.error('Không thể xóa khảo sát:', error);
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleSurveyActive(id);
      fetchSurveys();
    } catch (error) {
      console.error('Không thể thay đổi trạng thái khảo sát:', error);
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
        <h1>Quản Lý Khảo Sát</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          Tạo Khảo Sát Mới
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
                  <TableCell>Tên Khảo Sát</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Khối</TableCell>
                  <TableCell>Ngày Bắt Đầu</TableCell>
                  <TableCell>Ngày Kết Thúc</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell align="right">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surveys
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell>{survey.name}</TableCell>
                      <TableCell>
                        {survey.type === 'GENERAL' ? 'Chung' : 'Theo Môn'}
                      </TableCell>
                      <TableCell>
                        {survey.grades.join(', ')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(survey.start_date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(survey.end_date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={survey.is_active ? 'Đang Hoạt Động' : 'Đã Đóng'}
                          color={survey.is_active ? 'success' : 'default'}
                          onClick={() => handleToggleActive(survey.id)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" title="Chỉnh sửa">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSurvey(survey.id)}
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
            count={surveys.length}
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

      <Suspense fallback={<LoadingState />}>
        {isModalOpen && (
          <CreateSurveyModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateSurvey}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Surveys;