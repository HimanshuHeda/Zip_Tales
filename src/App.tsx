import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { NewsProvider } from "./contexts/NewsContext";
import { BlockchainProvider } from "./contexts/BlockchainContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import ThemeToggle from "./components/ThemeToggle";
import NotificationToast from "./components/NotificationToast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import SubmitNews from "./pages/SubmitNews";
import Voting from "./pages/Voting";
import Saved from "./pages/Saved";
import Following from "./pages/Following";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ArticleDetail from "./pages/ArticleDetail";
import AuthCallback from "./pages/AuthCallback";
import Services from "./pages/Services";

// ✅ ScrollToTop component to handle scroll restoration on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <ThemeToggle />

      <AuthProvider>
        <NewsProvider>
          <BlockchainProvider>
            <NotificationProvider>
              <Router>
                <ScrollToTop />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
                  <Header />
                  <Navbar />
                  <main className="pt-20">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/submit" element={<SubmitNews />} />
                      <Route path="/voting" element={<Voting />} />
                      <Route path="/saved" element={<Saved />} />
                      <Route path="/following" element={<Following />} />
                      <Route path="/categories/:category" element={<Categories />} />
                      <Route path="/article/:id" element={<ArticleDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <Chatbot />
                  <NotificationToast />
                </div>
              </Router>
            </NotificationProvider>
          </BlockchainProvider>
        </NewsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
