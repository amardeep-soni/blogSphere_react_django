import './App.css'
import BlogDetail from './components/BlogDetail';
import Category from './components/Category';
import Home from './components/Home';
import MainLayout from './components/MainLayout';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PostForm from './components/PostForm';
import AllPosts from './components/AllPosts';
import Comments from './components/Comments';
import SearchResults from './components/SearchResults';


function App() {

  return (
    // route
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="category/:name" element={<Category />} />
          <Route path="author/:username" element={<Profile />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/posts/new" element={<PostForm mode="create" />} />
          <Route path="/posts/edit/:slug" element={<PostForm mode="edit" />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/comments/:slug" element={<Comments />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
