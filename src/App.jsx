 

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/login";
// import Register from "./pages/Register";
// import DashBoard from "./pages/DashBoard";
// import AddBill from "./pages/AddBill";
// import Bills from "./pages/Bills";
 
// import Reports from "./pages/Reports";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Public */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected */}
//         <Route
//           path="/dashboard"
//           element={<ProtectedRoute><DashBoard /></ProtectedRoute>}
//         />

//         <Route
//           path="/bills"
//           element={<ProtectedRoute><Bills /></ProtectedRoute>}
//         />

//         <Route
//           path="/add-bill"
//           element={<ProtectedRoute><AddBill /></ProtectedRoute>}
//         />

//         {/* EDIT ROUTE */}
//         <Route
//           path="/add-bill/:id"
//           element={<ProtectedRoute><AddBill /></ProtectedRoute>}
//         />

//         <Route
//           path="/reports"
//           element={<ProtectedRoute><Reports /></ProtectedRoute>}
//         />

//         <Route path="*" element={<Navigate to="/login" />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddBill from "./pages/AddBill";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-bill"
          element={
            <ProtectedRoute>
              <AddBill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-bill/:id"
          element={
            <ProtectedRoute>
              <AddBill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
