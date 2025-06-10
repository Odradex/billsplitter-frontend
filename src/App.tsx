import { Route } from "react-router"
import { BrowserRouter, Routes } from "react-router"
import { HomePage } from "./app/home/HomePage"
import { NewMeet } from "./app/meet/NewMeet"
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='meet'>
          <Route path="new" element={<NewMeet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App