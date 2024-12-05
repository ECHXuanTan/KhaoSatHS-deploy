import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveysByStudent } from '../../services/surveyServices.js';
import { Helmet } from 'react-helmet-async';
import styles from '../../styles/student/SurveyDetail.module.css';
import LoadingState from '../../components/admin/common/LoadingState.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SurveyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const data = await getSurveysByStudent();
        const foundSurvey = data.surveys.find(s => s.id === parseInt(id));
        if (!foundSurvey) {
          throw new Error('Không tìm thấy khảo sát');
        }
        setSurvey(foundSurvey);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!survey) return <div className={styles.error}>Không tìm thấy khảo sát</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
       <Helmet>
        <title>{survey.name} | Trường Phổ Thông Năng Khiếu</title>
      </Helmet>
      <div className={styles.header}>
        <button
          onClick={() => navigate('/student-survey')}
          className={styles.backButton}
        >
          <ArrowBackIcon/>
          Quay lại danh sách
        </button>
        <h1 className={styles.title}>{survey.name}</h1>
        <div className={styles.surveyInfo}>
          {survey.type === 'SUBJECT_SPECIFIC' && (
            <>
              <span>Môn học: {survey.subject_name}</span>
              <span>Lớp: {survey.class_id}</span>
              <span>Học kỳ: {survey.semester}</span>
            </>
          )}
          <span>Thời gian: {formatDate(survey.start_date)} - {formatDate(survey.end_date)}</span>
          <span className={`${styles.badge} ${survey.type === 'GENERAL' ? styles.badgeGeneral : styles.badgeSubject}`}>
            {survey.type === 'GENERAL' ? 'Khảo sát chung' : 'Khảo sát môn học'}
          </span>
        </div>
      </div>
      
      <div className={styles.formContainer}>
        {iframeLoading && <LoadingState />}
        <iframe
          src={survey.form_url}
          className={styles.iframe}
          title={survey.name}
          onLoad={() => setIframeLoading(false)}
        />
      </div>
    </div>
  );
};

export default SurveyDetailPage;
