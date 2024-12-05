import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/common/AdminNavPanel.module.css';
import { useNavigation } from './NavigationContext';

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const AdminNavPanel = () => {
  const { isNavExpanded, setIsNavExpanded } = useNavigation();
  const location = useLocation();

  const navigationItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/admin/subjects', label: 'Môn học', icon: <LibraryBooksIcon /> },
    { path: '/admin/teachers', label: 'Giáo viên', icon: <GroupIcon /> },
    { path: '/admin/classes', label: 'Lớp học', icon: <SchoolIcon /> },
    { path: '/admin/students', label: 'Học sinh', icon: <PeopleIcon /> },
    { path: '/admin/surveys', label: 'Khảo sát', icon: <AssessmentIcon /> },
  ];

  return (
    <div className={`${styles.navPanel} ${isNavExpanded ? styles.expanded : styles.collapsed}`}>
      <button 
        className={styles.toggleButton}
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        {isNavExpanded ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div className={styles.logoSection}>
        {isNavExpanded ? <h1>PTNK Survey</h1> : <h1>PS</h1>}
      </div>

      <nav className={styles.navigation}>
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {isNavExpanded && <span className={styles.label}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className={styles.userSection}>
        {isNavExpanded ? (
          <>
            <span className={styles.username}>Admin User</span>
            <button className={styles.logoutButton}>
              <LogoutIcon />
              <span>Đăng xuất</span>
            </button>
          </>
        ) : (
          <button className={styles.logoutButton}>
            <LogoutIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminNavPanel;