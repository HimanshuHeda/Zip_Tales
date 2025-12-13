import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NewsProvider } from './contexts/NewsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import SubmitNews from './pages/SubmitNews';
import Voting from './pages/Voting';
import Saved from './pages/Saved';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import ArticleDetail from './pages/ArticleDetail';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            <Header />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/submit" element={<SubmitNews />} />
                <Route path="/voting" element={<Voting />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/categories/:category" element={<Categories />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </div>
        </Router>
      </NewsProvider>
    </AuthProvider>
  );
}

export default App;