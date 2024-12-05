import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavPanel from './AdminNavPanel';
import styles from '../styles/common/AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <AdminNavPanel />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;