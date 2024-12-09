import './App.css'
import BlogDetail from './components/BlogDetail';
import Category from './components/Category';
import Home from './components/Home';
import MainLayout from './components/MainLayout';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from './components/Profile';
import Register from './components/Register';


function App() {

  return (
    // route
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='register' element={<Register />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="category/:name" element={<Category />} />
          <Route path="author/:username" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
