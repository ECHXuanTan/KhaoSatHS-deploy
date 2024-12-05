import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSurveysByStudent } from '../../services/surveyServices.js';
import styles from '../../styles/student/SurveyList.module.css';

const SurveyListPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await getSurveysByStudent();
        setSurveys(data.surveys);
        setStudent(data.student);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const availableSurveys = surveys.filter(survey => !survey.has_responded);
  const completedSurveys = surveys.filter(survey => survey.has_responded);

  const SurveyCard = ({ survey }) => {
    const handleClick = () => {
      if (!survey.has_responded) {
        navigate(`/student-survey/${survey.id}`);
      }
    };

    return (
      <div
        onClick={handleClick}
        className={`${styles.surveyCard} ${survey.has_responded ? styles.completedCard : styles.availableCard}`}
        style={{ cursor: survey.has_responded ? 'default' : 'pointer' }}
      >
        <h3 className={styles.surveyName}>{survey.name}</h3>
        <div className={styles.surveyInfo}>
          {survey.type === 'SUBJECT_SPECIFIC' && (
            <>
              <p><span className={styles.label}>Môn học:</span> {survey.subject_name}</p>
              <p><span className={styles.label}>Lớp:</span> {survey.class_id}</p>
              <p><span className={styles.label}>Học kỳ:</span> {survey.semester}</p>
            </>
          )}
          <p>
            <span className={styles.label}>Thời gian:</span> {formatDate(survey.start_date)} - {formatDate(survey.end_date)}
          </p>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${survey.type === 'GENERAL' ? styles.badgeGeneral : styles.badgeSubject}`}>
              {survey.type === 'GENERAL' ? 'Khảo sát chung' : 'Khảo sát môn học'}
            </span>
            <span className={`${styles.badge} ${survey.has_responded ? styles.badgeCompleted : styles.badgeAvailable}`}>
              {survey.has_responded ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {student && (
        <div className={styles.studentInfo}>
          <h2>Thông tin học sinh</h2>
          <p>Họ và tên: {student.name}</p>
          <p>Lớp: {student.base_class}</p>
          <p>Email: {student.email}</p>
        </div>
      )}

      <div className={styles.surveySection}>
        <h2 className={styles.sectionTitle}>Khảo sát cần hoàn thành ({availableSurveys.length})</h2>
        <div className={styles.surveyGrid}>
          {availableSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
          {availableSurveys.length === 0 && (
            <p className={styles.emptyMessage}>Không có khảo sát nào cần hoàn thành</p>
          )}
        </div>
      </div>

      <div className={styles.surveySection}>
        <h2 className={styles.sectionTitle}>Khảo sát đã hoàn thành ({completedSurveys.length})</h2>
        <div className={styles.surveyGrid}>
          {completedSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
          {completedSurveys.length === 0 && (
            <p className={styles.emptyMessage}>Chưa có khảo sát nào được hoàn thành</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyListPage;