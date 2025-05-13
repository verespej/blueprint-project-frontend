import { Routes, Route } from 'react-router';

import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { MyPatients } from './pages/MyPatients';
import { NotFound } from './pages/NotFound';
import { PatientEducation } from './pages/PatientEducation';
import { PatientHome } from './pages/PatientHome';
import { PatientManager } from './pages/PatientManager';
import { ProviderEducation } from './pages/ProviderEducation';
import { ProviderHome } from './pages/ProviderHome';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/my-patients"  element={<MyPatients />} />
          <Route path="/provider" element={<ProviderHome />} />
          <Route path="/provider-education" element={<ProviderEducation />} />
          <Route path="/patient"  element={<PatientHome />} />
          <Route path="/patient-education"  element={<PatientEducation />} />
          <Route path="/patient-manager/:patientId" element={<PatientManager />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
