import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SettingsProvider } from './context/SettingsContext.js';
import { ToastProvider } from './components/common/Toast.js';
import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { TopNavbar } from './components/common/TopNavbar.js';
import { Sidebar } from './components/common/Sidebar.js';
import { AiAssistantModal } from './components/assistant/AiAssistantModal.js';

// Business User Views
import { DashboardView } from './pages/business/DashboardView.js';
import { WhatDoINeedWizard } from './pages/business/WhatDoINeedWizard.js';
import { MyChecklistPage } from './pages/business/MyChecklistPage.js';
import { MyDocumentsPage } from './pages/business/MyDocumentsPage.js';
import { ApplicationsPage } from './pages/business/ApplicationsPage.js';
import { DepartmentApprovalsView } from './pages/business/DepartmentApprovalsView.js';
import { InspectionsPage } from './pages/business/InspectionsPage.js';
import { DeadlinesRenewalsPage } from './pages/business/DeadlinesRenewalsPage.js';
import { SchemesPage } from './pages/business/SchemesPage.js';
import { GrievancesPage } from './pages/business/GrievancesPage.js';
import { RiskScoringPage } from './pages/business/RiskScoringPage.js';
import { BusinessPassportPage } from './pages/business/BusinessPassportPage.js';
import { BusinessProfilePage } from './pages/business/BusinessProfilePage.js';

// Specialized Role Dashboards
import { StaffDashboard } from './pages/staff/StaffDashboard.js';
import { OfficerDashboard } from './pages/officer/OfficerDashboard.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { Sparkles, Bot } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'portal'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // If user switches role, automatically adjust default activeTab
  const role = user?.role || 'business_user';

  const handleDemoAccess = () => {
    setCurrentView('portal');
    if (role === 'business_user') setActiveTab('dashboard');
    else if (role === 'department_staff') setActiveTab('staff-queue');
    else if (role === 'inspection_officer') setActiveTab('officer-schedule');
    else if (role === 'admin') setActiveTab('admin-overview');
  };

  // If on landing page and not authenticated
  if (currentView === 'landing' && !isAuthenticated) {
    return (
      <LandingPage
        onGetStarted={handleDemoAccess}
        onLoginClick={() => setCurrentView('login')}
      />
    );
  }

  // If on login view
  if (currentView === 'login' && !isAuthenticated) {
    return (
      <LoginPage
        onBackToHome={() => setCurrentView('landing')}
        onSuccess={() => {
          setCurrentView('portal');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // MAIN AUTHENTICATED PORTAL LAYOUT
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Role-Aware Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabSelect={(tabId) => {
          setActiveTab(tabId);
          setMobileSidebarOpen(false);
        }}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenAssistant={() => setIsAiOpen(true)}
          activeTab={activeTab}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* BUSINESS USER TABS */}
          {role === 'business_user' && (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenAssistant={() => setIsAiOpen(true)}
                />
              )}
              {activeTab === 'wizard' && (
                <WhatDoINeedWizard onNavigateTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'checklist' && (
                <MyChecklistPage onNavigateTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'documents' && <MyDocumentsPage />}
              {activeTab === 'applications' && (
                <ApplicationsPage onNavigateTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'approvals' && (
                <DepartmentApprovalsView onNavigateTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'inspections' && <InspectionsPage />}
              {activeTab === 'deadlines' && (
                <DeadlinesRenewalsPage onNavigateTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'schemes' && <SchemesPage />}
              {activeTab === 'grievances' && <GrievancesPage />}
              {activeTab === 'risk' && (
                <RiskScoringPage onNavigateTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'passport' && <BusinessPassportPage />}
              {activeTab === 'profile' && <BusinessProfilePage />}
            </>
          )}

          {/* DEPARTMENT STAFF TABS */}
          {role === 'department_staff' && <StaffDashboard />}

          {/* INSPECTION OFFICER TABS */}
          {role === 'inspection_officer' && <OfficerDashboard />}

          {/* SYSTEM ADMIN TABS */}
          {role === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Floating AI Regulatory Assistant Drawer/Modal */}
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Floating Quick AI Trigger Button */}
      {!isAiOpen && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-5 right-5 z-40 p-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-transform hover:scale-105"
          title="Ask Regulatory & Statutory AI Assistant"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline font-bold text-xs pr-1">Ask Regulatory AI</span>
        </button>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
