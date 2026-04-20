import { Routes, Route } from "react-router"
import Login from "../pages/LoginPage"
import TableInformation from "../pages/TableInformationPage"
import Stock from "../pages/StockPage"
import StockForm from "../pages/StockForm"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import RegisterPage from "../pages/RegisterPage"
import HomePage from "../pages/HomePage"
import CreateTableInformation from "../pages/CreateTableInformation"
import StaffPage from "../pages/StaffPage"
import CreateStaffPage from "../pages/CreateStaffPage"
import EditStaffPage from "../pages/EditStaffPage"
import ReservationPage from "../pages/ReservationPage"
import StaffListReservationPage from "../pages/StaffListReservationPage"
import MenuListPage from "../pages/OrderMenuListPage"

const Router = () => {
  return (
    <Routes>
      // Auth Routes
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      // Home Routes
      <Route path="/home" element={<HomePage />} />
      <Route path="/menu-list" element={<MenuListPage />} />

      // Table Information Routes
      <Route path='/tableInformation' element={<TableInformation />} />
      <Route path='/tableInformation/create' element={<CreateTableInformation />} />

      // Staff Routes
      <Route path="/staff" element={<StaffPage />} />
      <Route path="/staff/create" element={<CreateStaffPage />} />
      <Route path="/staff/edit/:id" element={<EditStaffPage />} />
      <Route path="/staff/listReservation" element={<StaffListReservationPage />} />

      // Customer Routes
      <Route path="/reservation" element={<ReservationPage />} />
      
      // Stock Routes
      <Route path= "/stock" element={<Stock />} />
      <Route path="/stock/create" element={<StockForm />} />
      <Route path="/stock/update/:id" element={<StockForm />} />
    </Routes>
  )
}

export default Router