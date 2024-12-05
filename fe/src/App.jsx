import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import { NavigationProvider } from './components/admin/common/NavigationContext';
import AdminLayout from './components/admin/common/AdminLayout';
import Login from './page/auth/Login';
import LoadingState from './components/admin/common/LoadingState';
import Header from './components/admin/common/Header';
import Footer from './components/admin/common/Footer';

// Admin
const Dashboard = lazy(() => import('./page/admin/Dashboard'));
const Subjects = lazy(() => import('./page/admin/Subjects'));
const Teachers = lazy(() => import('./page/admin/Teachers'));
const Surveys = lazy(() => import('./page/admin/Surveys'));
const Classes = lazy(() => import('./page/admin/Class'));
const Students = lazy(() => import('./page/admin/Student'));
const Users = lazy(() => import('./page/admin/Users'));
const ClassStudents = lazy(() => import('./page/admin/ClassStudent'));

// Teacher
const TeacherSurveyMonitor = lazy(() => import('./page/teacher/TeacherDashboard'));

// Student
const SurveyListPage = lazy(() => import('./page/student/SurveyListPage'));
const SurveyDetailPage = lazy(() => import('./page/student/SurveyDetailPage'));

function App() {
  return (
    <HelmetProvider>
      <NavigationProvider>
        <Router>
          <Suspense fallback={<LoadingState />}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <div style={{ flex: 1 }}>
                {/* Render Header for non-admin pages */}
                {window.location.pathname.startsWith('/admin') ? null : <Header />}
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  {/* Admin */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="subjects" element={<Subjects />} />
                    <Route path="teachers" element={<Teachers />} />
                    <Route path="surveys" element={<Surveys />} />
                    <Route path="classes" element={<Classes />} />
                    <Route path="classes/:id/students" element={<ClassStudents />} />
                    <Route path="students" element={<Students />} />
                    <Route path="users" element={<Users />} />
                  </Route>

                  {/* Teacher Routes */}
                  <Route path="/teacher-dashboard" element={<TeacherSurveyMonitor />} />

                  {/* Student */}
                  <Route path="/student-survey" element={<SurveyListPage />} />
                  <Route path="/student-survey/:id" element={<SurveyDetailPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </Suspense>
        </Router>
      </NavigationProvider>
    </HelmetProvider>
  );
}

export default App;