import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Team from './pages/Team';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetails from './pages/CaseStudyDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminBlogEditor from './pages/AdminBlogEditor';
import AdminBlogsManage from './pages/AdminBlogsManage';
import AdminCaseStudyEditor from './pages/AdminCaseStudyEditor';
import AdminCaseStudiesManage from './pages/AdminCaseStudiesManage';
import PortfolioCreatePage from './pages/PortfolioCreatePage';
import PortfolioManagePage from './pages/PortfolioManagePage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAdminLoggedIn') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#EEEEEE] font-sans text-black">
        <Navbar />
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:id" element={<CaseStudyDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Login />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs/new" 
              element={
                <ProtectedRoute>
                  <AdminBlogEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs/edit/:id" 
              element={
                <ProtectedRoute>
                  <AdminBlogEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs/manage" 
              element={
                <ProtectedRoute>
                  <AdminBlogsManage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/case-studies/new" 
              element={
                <ProtectedRoute>
                  <AdminCaseStudyEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/case-studies/edit/:id" 
              element={
                <ProtectedRoute>
                  <AdminCaseStudyEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/case-studies/manage" 
              element={
                <ProtectedRoute>
                  <AdminCaseStudiesManage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/portfolio/create" 
              element={
                <ProtectedRoute>
                  <PortfolioCreatePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/portfolio/manage" 
              element={
                <ProtectedRoute>
                  <PortfolioManagePage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default App;