import { Routes, Route } from "react-router"
import Login from "../pages/LoginPage"
import TableInformation from "../pages/TableInformationPage"

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/tableInformation' element={<TableInformation />} />
    </Routes>
  )
}

export default Router