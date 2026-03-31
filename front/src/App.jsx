import { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Zap, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import './App.css';

// Eagerly loaded
import Home         from './pages/Home';
import Login        from './Login';
import Signup       from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword  from './ResetPassword';
import Profile        from './Profile';

// Lazy loaded
const Result             = lazy(() => import('./pages/Result'));
const RequestsPage       = lazy(() => import('./pages/requests/RequestsPage'));
const CreateRequestPage  = lazy(() => import('./pages/requests/CreateRequestPage'));
const RequestDetailPage  = lazy(() => import('./pages/requests/RequestDetailPage'));
const AdminPage          = lazy(() => import('./pages/admin/AdminPage'));
const StatsPage          = lazy(() => import('./pages/StatsPage'));
const JavaScriptPractice = lazy(() => import('./pages/JavaScriptPractice'));
const PythonPractice     = lazy(() => import('./pages/PythonPractice'));
const JavaPractice       = lazy(() => import('./pages/JavaPractice'));
const CppPractice        = lazy(() => import('./pages/CppPractice'));
const ReactPractice      = lazy(() => import('./pages/ReactPractice'));
const SqlPractice        = lazy(() => import('./pages/SqlPractice'));
const DSAPractice        = lazy(() => import('./pages/DSAPractice'));
const MLPractice         = lazy(() => import('./pages/MLPractice'));
const DataAnalyticsPractice = lazy(() => import('./pages/DataAnalyticsPractice'));

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-icon">
        <Zap size={28} />
      </div>
      <Loader2 size={20} className="animate-spin page-loader-spinner" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-code gradient-text">404</div>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-desc">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="not-found-btn">
        ← Back to Home
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                          element={<Home />} />
            <Route path="/login"                     element={<Login />} />
            <Route path="/signup"                    element={<Signup />} />
            <Route path="/forgot-password"           element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken"element={<ResetPassword />} />
            <Route path="/profile"                   element={<Profile />} />

            <Route path="/Result"                    element={<Result />} />
            <Route path="/practice/javascript"       element={<JavaScriptPractice />} />
            <Route path="/practice/python"           element={<PythonPractice />} />
            <Route path="/practice/java"             element={<JavaPractice />} />
            <Route path="/practice/cpp"              element={<CppPractice />} />
            <Route path="/practice/react"            element={<ReactPractice />} />
            <Route path="/practice/sql"              element={<SqlPractice />} />
            <Route path="/practice/dsa-java"         element={<DSAPractice language="dsa-java" />} />
            <Route path="/practice/dsa-python"       element={<DSAPractice language="dsa-python" />} />
            <Route path="/practice/dsa-cpp"          element={<DSAPractice language="dsa-cpp" />} />
            <Route path="/practice/machine-learning" element={<MLPractice />} />
            <Route path="/practice/data-analytics"   element={<DataAnalyticsPractice />} />

            <Route path="/requests"     element={<RequestsPage />} />
            <Route path="/requests/new" element={<CreateRequestPage />} />
            <Route path="/requests/:id" element={<RequestDetailPage />} />
            <Route path="/admin"        element={<AdminPage />} />
            <Route path="/stats"        element={<StatsPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
