import { Routes, Route } from 'react-router';

import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { MyAssignments } from './pages/MyAssignments';
import { MyPatients } from './pages/MyPatients';
import { MyProviders } from './pages/MyProviders';
import { NotFound } from './pages/NotFound';
import { PatientEducation } from './pages/PatientEducation';
import { PatientHome } from './pages/PatientHome';
import { PatientManager } from './pages/PatientManager';
import { ProviderEducation } from './pages/ProviderEducation';
import { ProviderHome } from './pages/ProviderHome';
import { QuickAccess } from './pages/QuickAccess';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          <Route path="/provider" element={<ProviderHome />} />
          <Route path="/my-patients"  element={<MyPatients />} />
          <Route path="/my-patients/:patientId" element={<PatientManager />} />
          <Route path="/provider-education" element={<ProviderEducation />} />

          <Route path="/patient"  element={<PatientHome />} />
          <Route path="/my-providers" element={<MyProviders />} />
          <Route path="/my-assignments" element={<MyAssignments />} />
          <Route path="/patient-education"  element={<PatientEducation />} />

          <Route path="/quick-access/:slug"  element={<QuickAccess />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
