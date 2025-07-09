import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import RSVPManagement from './pages/Admin/RSVPManagement';
import GiftManagement from './pages/Admin/GiftManagement';
import PurchasedGifts from './pages/Admin/PurchasedGifts';
import './App.css';

const AppContainer = styled(Box)({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
});

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="guests" element={<RSVPManagement />} />
                      <Route path="gifts" element={<GiftManagement />} />
                      <Route path="purchased-gifts" element={<PurchasedGifts />} />
                      <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Main app routes */}
            <Route path="/*" element={<Layout />} />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
