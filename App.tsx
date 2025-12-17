import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Team from './pages/Team';
import Services from './pages/Services';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminBlogEditor from './pages/AdminBlogEditor';
import AdminBlogsManage from './pages/AdminBlogsManage';

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
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#EEEEEE] font-sans text-black">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/case-studies" element={<CaseStudies />} />
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
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;