import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveysByStudent } from '../../services/surveyServices.js';
import { Helmet } from 'react-helmet-async';
import styles from '../../styles/student/SurveyDetail.module.css';
import LoadingState from '../../components/admin/common/LoadingState.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Alert, AlertTitle, IconButton, Tooltip, Button } from '@mui/material';

const SurveyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const data = await getSurveysByStudent();
        const foundSurvey = data.surveys.find(s => s.id === parseInt(id));
        
        if (!foundSurvey) {
          throw new Error('Không tìm thấy khảo sát');
        }

        const formUrl = foundSurvey.form_url;
        if (!formUrl.includes('embedded=true')) {
          const urlObj = new URL(formUrl);
          urlObj.searchParams.set('embedded', 'true');
          foundSurvey.form_url = urlObj.toString();
        }
        
        setSurvey(foundSurvey);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải khảo sát:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoading(false);
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const openFormInNewTab = () => {
    if (survey?.form_url) {
      const originalUrl = new URL(survey.form_url);
      originalUrl.searchParams.delete('embedded');
      window.open(originalUrl.toString(), '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert severity="error">
          <AlertTitle>Lỗi</AlertTitle>
          {error}
        </Alert>
        <button
          onClick={() => navigate('/student-survey')}
          className={styles.backButton}
        >
          <ArrowBackIcon />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className={styles.errorContainer}>
        <Alert severity="warning">
          <AlertTitle>Không tìm thấy</AlertTitle>
          Không tìm thấy khảo sát yêu cầu
        </Alert>
        <button
          onClick={() => navigate('/student-survey')}
          className={styles.backButton}
        >
          <ArrowBackIcon />
          Quay lại danh sách
        </button>
      </div>
    );
  }

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
          <ArrowBackIcon />
          Quay lại danh sách
        </button>
        <h1 className={styles.title}>{survey.name}</h1>
        <div className={styles.surveyInfo}>
          {survey.type === 'SUBJECT_SPECIFIC' && (
            <>
              <span className={styles.infoItem}>
                <strong>Môn học:</strong> {survey.subject_name}
              </span>
              <span className={styles.infoItem}>
                <strong>Lớp:</strong> {survey.class_id}
              </span>
              <span className={styles.infoItem}>
                <strong>Học kỳ:</strong> {survey.semester}
              </span>
            </>
          )}
          <span className={styles.infoItem}>
            <strong>Thời gian:</strong> {formatDate(survey.start_date)} - {formatDate(survey.end_date)}
          </span>
          <div className={styles.badgeContainer}>
            <span 
              className={`${styles.badge} ${
                survey.type === 'GENERAL' ? styles.badgeGeneral : styles.badgeSubject
              }`}
            >
              {survey.type === 'GENERAL' ? 'Khảo sát chung' : 'Khảo sát môn học'}
            </span>
            <Button
              variant="outlined"
              size="small"
              onClick={openFormInNewTab}
              startIcon={<OpenInNewIcon />}
              className={styles.openNewTabButton}
            >
              Mở trong tab mới
            </Button>
          </div>
        </div>
      </div>
      
      <div className={styles.formContainer}>
        {iframeLoading && (
          <div className={styles.iframeLoading}>
            <LoadingState />
            <p>Đang tải biểu mẫu...</p>
          </div>
        )}

        {iframeError && (
          <div className={styles.iframeError}>
            <Alert severity="warning">
              <AlertTitle>Không thể tải biểu mẫu</AlertTitle>
              <p>Có lỗi xảy ra khi tải biểu mẫu. Vui lòng thử một trong các cách sau:</p>
              <ul>
                <li>Tải lại trang</li>
                <li>Mở biểu mẫu trong tab mới</li>
              </ul>
              <Button 
                variant="outlined"
                onClick={openFormInNewTab}
                startIcon={<OpenInNewIcon />}
                className={styles.openNewTabButton}
              >
                Mở trong tab mới
              </Button>
            </Alert>
          </div>
        )}

        <iframe
          src={survey.form_url}
          className={`${styles.iframe} ${iframeError ? styles.hidden : ''}`}
          title={survey.name}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          width="100%"
          height="800px"
          allowFullScreen
        >
          Đang tải...
        </iframe>
      </div>
    </div>
  );
};

export default SurveyDetailPage;