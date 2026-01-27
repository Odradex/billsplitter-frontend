import { Route } from "react-router"
import { BrowserRouter, Routes, Navigate } from "react-router"
import { HomePage } from "./app/home/HomePage"
import { NewMeet } from "./app/meet/NewMeetPage"
import ProfilePage from "./app/profileSettings"
import { MeetDetails } from "./app/meet/MeetDetails/MeetDetailsPage"
import { NewBill } from "./app/bill/NewBill/NewBillPage"
import { MeetInvitePage } from "./app/meet/MeetInvitePage"
import { BillsPage } from "./app/bill/BillsPage"
import { useLaunchParams } from '@telegram-apps/sdk-react'
import { useEffect, useState } from 'react'
 
function App() {
  const launchParams = useLaunchParams();
  const [inviteUuid, setInviteUuid] = useState<string | null>(null);

  useEffect(() => {
    const startParam = launchParams?.tgWebAppStartParam;
    if (startParam) {
      setInviteUuid(startParam);
    }
  }, [launchParams]);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={inviteUuid ? <Navigate to={`/meets/invite/${inviteUuid}`} replace /> : <HomePage />} />
        <Route path='meets'>
          <Route path="new" element={<NewMeet />} />
          <Route path="invite/:uuid" element={<MeetInvitePage />} />
          <Route path=":id" element={<MeetDetails />} />
          <Route path=":meetId/add-bill" element={<NewBill />} />
          <Route path=":id/bills" element={<BillsPage />} />
        </Route>
        <Route path='profile' element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
