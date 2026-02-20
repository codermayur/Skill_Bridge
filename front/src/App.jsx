import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Result from "./pages/Result";
import "./App.css";
import JavaPractice from "./pages/JavaPractice";
import JavaScriptPractice from "./pages/JavaScriptPractice";
import PythonPractice from "./pages/PythonPractice";
import CppPractice from "./pages/CppPractice";
import SqlPractice from "./pages/SqlPractice";
import ReactPractice from "./pages/ReactPractice";
import DSAPractice from "./pages/DSAPractice";
import MLPractice from "./pages/MLPractice";
import DataAnalyticsPractice from "./pages/DataAnalyticsPractice";
// import CSharpPractice from "./pages/CSharpPractice";
// import GoPractice from "./pages/GoPractice";
// import KotlinPractice from "./pages/KotlinPractice";
// import PhpPractice from "./pages/PhpPractice";
// import RustPractice from "./pages/RustPractice";
// import TypeScriptPractice from "./pages/TypeScriptPractice";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/Result" element={<Result />} />

        <Route path="/practice/javascript" element={<JavaScriptPractice />} />
        <Route path="/practice/python" element={<PythonPractice />} />
        <Route path="/practice/java" element={<JavaPractice />} />
        <Route path="/practice/cpp" element={<CppPractice />} />
        <Route path="/practice/react" element={<ReactPractice />} />
        <Route path="/practice/sql" element={<SqlPractice />} />
        <Route path="/practice/dsa-java" element={<DSAPractice language="dsa-java" />} />
        <Route path="/practice/dsa-python" element={<DSAPractice language="dsa-python" />} />
        <Route path="/practice/dsa-cpp" element={<DSAPractice language="dsa-cpp" />} />
        <Route path="/practice/machine-learning" element={<MLPractice />} />
        <Route path="/practice/data-analytics" element={<DataAnalyticsPractice />} />
        {/* <Route path="/practice/typescript" element={<JavaScriptPractice />} />
        <Route path="/practice/golang" element={<JavaScriptPractice />} />
        <Route path="/practice/rust" element={<JavaScriptPractice />} />
        <Route path="/practice/csharp" element={<JavaScriptPractice />} />
        <Route path="/practice/php" element={<JavaScriptPractice />} />
        <Route path="/practice/kotlin" element={<JavaScriptPractice />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

      </Routes>
    </>
  );
}

export default App;
