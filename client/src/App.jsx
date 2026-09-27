import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import Designers from './pages/Designers'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import SearchPage from './pages/SearchPage'
import ShotDetail from './pages/ShotDetail'
import Shots from './pages/Shots'
import Upload from './pages/Upload'
import { AboutPage, AdvertisePage, AgenciesPage, BlogPage, BlogPost, BriefsPage, ConductPage, ContactPage, CookiesPage, ForDesignersPage, HelpPage, HiringPage, JobsDirectoryPage, JobsPage, PlacesPage, PlayoffsPage, PrivacyPage, ProPage, ProposalsPage, ResourcesPage, ServicesPage, TagsPage, TermsPage } from './pages/More'
import { FollowingPage, LikesPage, MessagesPage, NotificationsPage, SettingsPage } from './pages/Account'
import { StoreProvider, useStore } from './store'

function NeedAuth({ children }) {
  const { user, ready } = useStore()
  const location = useLocation()
  if (!ready && !user) return null
  if (!user) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  return children
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shots" element={<Shots />} />
        <Route path="/shots/:id" element={<ShotDetail />} />
        <Route path="/shots/:id/edit" element={<NeedAuth><Upload /></NeedAuth>} />
        <Route path="/u/:username" element={<Profile />} />
        <Route path="/designers" element={<Designers />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/directories/jobs" element={<JobsDirectoryPage />} />
        <Route path="/briefs" element={<BriefsPage />} />
        <Route path="/agencies" element={<AgenciesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/playoffs" element={<PlayoffsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pro" element={<ProPage />} />
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/hiring" element={<HiringPage />} />
        <Route path="/for-designers" element={<ForDesignersPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/cookie-policy" element={<CookiesPage />} />
        <Route path="/conduct" element={<ConductPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/messages" element={<NeedAuth><MessagesPage /></NeedAuth>} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/likes" element={<NeedAuth><LikesPage /></NeedAuth>} />
        <Route path="/following" element={<NeedAuth><FollowingPage /></NeedAuth>} />
        <Route path="/settings" element={<NeedAuth><SettingsPage /></NeedAuth>} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<NeedAuth><Upload /></NeedAuth>} />
        <Route path="/dashboard" element={<NeedAuth><Dashboard /></NeedAuth>} />
        <Route path="*" element={<div className="page-wrap"><h1>Page not found</h1></div>} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}
