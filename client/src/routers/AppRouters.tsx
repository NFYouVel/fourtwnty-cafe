import { Routes, Route } from "react-router"
import Unauthorize from "../pages/UnauthorizePage"
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
import CustomerReservation from "../pages/ShowReservationCustomer"
import ProtectedRoutes from "./ProtectedRoutes"
import PaymentListPage from "../pages/PaymentListPage"
import TableStatusPage from "../pages/TableStatusPage"

const Router = () => {
  return (
    <Routes>
      {/* All User Can Access */}
      <Route path="/unauthorized" element={<Unauthorize />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Only User Can Access */}
      <Route element={<ProtectedRoutes allowedRoles={["Customer"]} />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/reservation/myReservation" element={<CustomerReservation />} />
      </Route>

      {/* Only Staff Can Access */}
      <Route element={<ProtectedRoutes allowedRoles={["Staff"]} />}>
        <Route path="/payment-list" element={<PaymentListPage />} />
        <Route path="/menu-list/:tableNumber" element={<MenuListPage />} />
        <Route path="/table-status" element={<TableStatusPage />} />
      </Route>

      {/* Only Customer & Staff Can Access */}
      <Route element={<ProtectedRoutes allowedRoles={["Customer", "Staff"]} />}>
        <Route path="/menu-list" element={<MenuListPage />} />
      </Route>

      {/* Only Manager Can Access */}
      <Route element={<ProtectedRoutes allowedRoles={["Manager"]} />}>
        {/* Table Information*/}
        <Route path='/tableInformation' element={<TableInformation />} />
        <Route path='/tableInformation/create' element={<CreateTableInformation />} />

        {/* Staff */}
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/staff/create" element={<CreateStaffPage />} />
        <Route path="/staff/edit/:id" element={<EditStaffPage />} />
        <Route path="/staff/listReservation" element={<StaffListReservationPage />} />

        {/* Stock */}
        <Route path="/stock" element={<Stock />} />
        <Route path="/stock/create" element={<StockForm />} />
        <Route path="/stock/update/:id" element={<StockForm />} />
      </Route>
    </Routes>
  )
}

export default Router