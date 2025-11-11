import { Route } from "react-router"
import { BrowserRouter, Routes } from "react-router"
import { HomePage } from "./app/home/HomePage"
import { NewMeet } from "./app/meet/NewMeetPage"
import ProfilePage from "./app/profileSettings"
import { MeetDetails } from "./app/meet/MeetDetails/MeetDetailsPage"
import { NewBill } from "./app/bill/NewBill/NewBillPage"
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='meets'>
          <Route path="new" element={<NewMeet />} />
          <Route path=":id" element={<MeetDetails />} />
          <Route path=":meetId/add-bill" element={<NewBill />} />
        </Route>
        <Route path='profile' element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
