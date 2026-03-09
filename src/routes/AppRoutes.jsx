import { BrowserRouter, Routes, Route } from "react-router-dom";
import MastersHome from "../pages/masters/MastersHome";
import Login from "../pages/auth/Login";
import CreateAccount from "../pages/auth/CreateAccount";
import Dashboard from "../pages/dashboard/Dashboard";
import UsersDept from "../pages/masters/UsersDept";
import ProtectedRoute from "../components/ProtectedRoute";
import SalesContact from "../pages/masters/SalesContact";
import Customer from "../pages/masters/Customer";
import Buyer from "../pages/masters/Buyer";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/create-account" element={<CreateAccount />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters"
          element={
            <ProtectedRoute>
              <MastersHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/usersdept"
          element={
            <ProtectedRoute>
              <UsersDept />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/salescontact"
          element={
          <ProtectedRoute>
           <SalesContact />
          </ProtectedRoute>
         }
        />
        <Route
          path="/masters/customer"
          element={
          <ProtectedRoute>
           <Customer />
          </ProtectedRoute>
         }
        />
        <Route
          path="/masters/buyer"
          element={
          <ProtectedRoute>
            <Buyer />
          </ProtectedRoute>
          }
         />
      </Routes>
    </BrowserRouter>
  );
}
