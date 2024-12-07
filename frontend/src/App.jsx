import './App.css'
import Home from './components/Home';
import MainLayout from './components/MainLayout';
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {

  return (
    // route
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
