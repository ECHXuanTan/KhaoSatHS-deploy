import React from 'react';
import styles from '../../styles/admin/Dashboard.module.css';
import { useNavigation } from '../../components/admin/common/NavigationContext';

// MUI Icons
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard = () => {
  const { isNavExpanded } = useNavigation();

  const statisticsCards = [
    {
      title: 'Tổng số tổ bộ môn',
      value: '12',
      icon: <BusinessIcon />,
      color: '#3699FF'
    },
    {
      title: 'Tổng số giáo viên',
      value: '48',
      icon: <PeopleIcon />,
      color: '#6993FF'
    },
    {
      title: 'Tổng số lớp học',
      value: '24',
      icon: <SchoolIcon />,
      color: '#1BC5BD'
    },
    {
      title: 'Khảo sát đang hoạt động',
      value: '8',
      icon: <AssessmentIcon />,
      color: '#FFA800'
    }
  ];

  return (
    <div className={`${styles.pageContainer} ${isNavExpanded ? styles.expanded : ''}`}>
      <div className={styles.header}>
        <h1>Tổng quan</h1>
        <p className={styles.breadcrumb}>Trang chủ / Tổng quan</p>
      </div>

      <div className={styles.statisticsGrid}>
        {statisticsCards.map((card, index) => (
          <div key={index} className={styles.statisticCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardInfo}>
                <h3>{card.title}</h3>
                <div className={styles.value}>{card.value}</div>
                <div className={styles.trend}>
                  <TrendingUpIcon style={{ color: '#1BC5BD' }} />
                  <span>+12% từ tháng trước</span>
                </div>
              </div>
              <div className={styles.iconContainer} style={{ backgroundColor: card.color }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Thống kê khảo sát theo tháng</h3>
          {/* Chart component will be added here */}
        </div>
        <div className={styles.chartCard}>
          <h3>Tỷ lệ phản hồi theo bộ môn</h3>
          {/* Chart component will be added here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;