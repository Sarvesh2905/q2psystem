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
import Country from "../pages/masters/Country";
import CountryType from "../pages/masters/CountryType";
import Product from "../pages/masters/Product";
import EndIndustry from "../pages/masters/EndIndustry";
import TimelineTarget from "../pages/masters/TimelineTarget";
import Discount from "../pages/masters/Discount";
import SpecialDiscount from "../pages/masters/SpecialDiscount";
import CostPrice from "../pages/masters/CostPrice";
import Price from "../pages/masters/Price";
import GeReference from "../pages/masters/GeReference";
import Currency from "../pages/masters/Currency";
import Unit from "../pages/masters/Unit";
import PaymentTerms from "../pages/masters/PaymentTerms";
import DeliveryTerms from "../pages/masters/DeliveryTerms";
import Reason from "../pages/masters/Reason";
import Status from "../pages/masters/Status";

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
        <Route
          path="/masters/country"
          element={
            <ProtectedRoute>
              <Country />
            </ProtectedRoute>
          }
        />

        <Route
          path="/masters/countrytype"
          element={
            <ProtectedRoute>
              <CountryType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/endindustry"
          element={
            <ProtectedRoute>
              <EndIndustry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/timeline"
          element={
            <ProtectedRoute>
              <TimelineTarget />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/discount"
          element={
            <ProtectedRoute>
              <Discount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/specialdiscount"
          element={
            <ProtectedRoute>
              <SpecialDiscount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/costprice"
          element={
            <ProtectedRoute>
              <CostPrice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/price"
          element={
            <ProtectedRoute>
              <Price />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/gereference"
          element={
            <ProtectedRoute>
              <GeReference />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/currency"
          element={
            <ProtectedRoute>
              <Currency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/unit"
          element={
            <ProtectedRoute>
              <Unit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/paymentterms"
          element={
            <ProtectedRoute>
              <PaymentTerms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/deliveryterms"
          element={
            <ProtectedRoute>
              <DeliveryTerms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/reason"
          element={
            <ProtectedRoute>
              <Reason />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masters/status"
          element={
            <ProtectedRoute>
              <Status />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
