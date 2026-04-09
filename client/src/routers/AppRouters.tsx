import { Routes, Route } from "react-router"
import Login from "../pages/LoginPage"
import Stock from "../pages/StockPage"
import StockForm from "../pages/StockForm"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import RegisterPage from "../pages/RegisterPage"
import HomePage from "../pages/HomePage"

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path= "/stock" element={<Stock />} />
      <Route path="/stock/create" element={<StockForm />} />
      <Route path="/stock/update/:id" element={<StockForm />} />
    </Routes>
  )
}

export default Router