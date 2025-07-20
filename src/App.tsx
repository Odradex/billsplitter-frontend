import { Route } from "react-router"
import { BrowserRouter, Routes } from "react-router"
import { HomePage } from "./app/home/HomePage"
import { NewMeet } from "./app/meet/NewMeet"
import ProfilePage from "./app/profileSettings"
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='meet'>
          <Route path="new" element={<NewMeet />} />
        </Route>
        <Route path='profile' element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
