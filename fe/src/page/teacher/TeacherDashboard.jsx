import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getClassStudentsWithSurveys } from '../../services/teacherServices';
import { 
  Typography, 
  Grid, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Stack,
  Alert,
  AlertTitle,
  Paper,
  TextField
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InfoIcon from '@mui/icons-material/Info';
import LoadingState from '../../components/admin/common/LoadingState';
import styles from '../../styles/teacher/TeacherSurveyMonitor.module.css';

const TeacherSurveyMonitor = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getClassStudentsWithSurveys();
        setData(response);
      } catch (error) {
        setError('Đã xảy ra lỗi khi tải dữ liệu khảo sát');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <Typography color="error" p={2}>{error}</Typography>;
  if (!data) return <Typography p={2}>Không có dữ liệu</Typography>;

  const subjectNames = [...new Set(data.students.flatMap(student => student.surveys.map(survey => survey.subject_name)))];

  const filteredStudents = data.students.filter(student =>
    student.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Theo dõi khảo sát lớp chủ nhiệm</title>
        <meta name="description" content="Trang theo dõi khảo sát dành cho giáo viên chủ nhiệm" />
      </Helmet>

      <Box className={styles.container}>
        <Alert severity="info" icon={<InfoIcon />} className={styles.alert}>
          <AlertTitle>Hệ thống sẽ tự động cập nhật sau mỗi 5 phút</AlertTitle>
        </Alert>

        <Paper className={styles.infoSection}>
          <Box className={styles.infoHeader}>
            <Box>
              <Typography variant="h5" className={styles.infoTitle}>Thông tin lớp chủ nhiệm</Typography>
              <Typography variant="body2" color="text.secondary">
                Năm học {data.academic_year}
              </Typography>
            </Box>
            <SchoolIcon className={styles.infoIcon} />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon color="action" />
                <Typography variant="subtitle1" fontWeight="medium">GVCN:</Typography>
                <Typography>{data.teacher_name}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SchoolIcon color="action" />
                <Typography variant="subtitle1" fontWeight="medium">Lớp:</Typography>
                <Typography>{data.base_class}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AssignmentTurnedInIcon color="action" />
                <Typography variant="subtitle1" fontWeight="medium">Sĩ số:</Typography>
                <Typography>{data.student_count} học sinh</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={styles.tableSection}>
          <Box className={styles.tableHeader}>
            <Typography variant="h6" className={styles.tableTitle}>
              Danh sách khảo sát của học sinh
            </Typography>
            <TextField
              label="Tìm kiếm học sinh"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </Box>
          <TableContainer className={styles.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Khảo sát môn học chung</TableCell>
                  {subjectNames.map(subject => (
                    <TableCell key={subject}>{subject}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((item, index) => {
                  const generalSurvey = item.surveys.find(s => s.type === 'GENERAL');

                  return (
                    <TableRow key={item.student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.student.name}</TableCell>
                      <TableCell>{item.student.email}</TableCell>
                      <TableCell>
                        {generalSurvey && (
                          <Chip
                            label={generalSurvey.has_responded ? 'Đã làm' : 'Chưa làm'}
                            color={generalSurvey.has_responded ? 'success' : 'error'}
                            size="small"
                          />
                        )}
                      </TableCell>
                      {subjectNames.map(subject => {
                        const survey = item.surveys.find(s => s.subject_name === subject && s.type === 'SUBJECT_SPECIFIC');
                        return (
                          <TableCell key={subject}>
                            {survey ? (
                              <Chip
                                label={survey.has_responded ? 'Đã làm' : 'Chưa làm'}
                                color={survey.has_responded ? 'success' : 'error'}
                                size="small"
                              />
                            ) : (
                              ''
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default TeacherSurveyMonitor;