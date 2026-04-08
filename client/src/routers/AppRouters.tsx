import { Routes, Route } from "react-router"
import Login from "../pages/LoginPage"
import Stock from "../pages/StockPage"
import StockForm from "../pages/StockForm"


const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/stock/create" element={<StockForm />} />
      <Route path="/stock/update/:id" element={<StockForm />} />
    </Routes>
  )
}

export default Router