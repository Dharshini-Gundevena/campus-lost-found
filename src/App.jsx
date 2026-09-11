import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AppProvider } from './context/AppContext';
import Layout         from './components/layout/Layout';
import Home           from './pages/Home';
import ReportLost     from './pages/ReportLost';
import ReportFound    from './pages/ReportFound';
import Browse         from './pages/Browse';
import Claims         from './pages/Claims';
import Notifications  from './pages/Notifications';
import Admin          from './pages/Admin';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index                  element={<Home />}          />
            <Route path="report-lost"     element={<ReportLost />}    />
            <Route path="report-found"    element={<ReportFound />}   />
            <Route path="browse"          element={<Browse />}        />
            <Route path="claims"          element={<Claims />}        />
            <Route path="notifications"   element={<Notifications />} />
            <Route path="admin"           element={<Admin />}         />
            {/* Catch-all → home */}
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
