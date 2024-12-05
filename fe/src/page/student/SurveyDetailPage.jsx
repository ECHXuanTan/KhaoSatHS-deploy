import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveysByStudent } from '../../services/surveyServices.js';
import styles from '../../styles/student/SurveyDetail.module.css';

const SurveyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
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
      <div className={styles.header}>
        <button
          onClick={() => navigate('/student-survey')}
          className={styles.backButton}
        >
          <span className={styles.backIcon}>←</span>
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
        <iframe
          src={survey.form_url}
          className={styles.iframe}
          title={survey.name}
        />
      </div>
    </div>
  );
};

export default SurveyDetailPage;