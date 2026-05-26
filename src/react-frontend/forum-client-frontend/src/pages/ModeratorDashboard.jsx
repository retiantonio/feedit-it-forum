import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, Activity, Layers } from 'lucide-react'
import { moderatorService } from '../services/moderatorService'
import ReportsTab from '../components/moderator/ReportsTab'
import ActivityLogsTab from '../components/moderator/ActivityLogsTab'
import UserSuspensionTab from '../components/moderator/UserSuspensionTab'
import CategoriesTab from '../components/moderator/CategoriesTab'
import './ModeratorDashboard.css'

const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending-reports')
  const [stats, setStats] = useState({
    pendingReports: 0,
    totalReports: 0,
    activityLogs: 0,
    categories: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        const [pending, all, logs, cats] = await Promise.all([
          moderatorService.getPendingReports(),
          moderatorService.getAllReports(),
          moderatorService.getActivityLogs(),
          moderatorService.getAllCategories(),
        ])
        setStats({
          pendingReports: pending.data.length,
          totalReports: all.data.length,
          activityLogs: logs.data.length,
          categories: cats.data.length,
        })
      } catch (err) {
        console.error('Failed to load moderator stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className='moderator-dashboard-root'>
      <div className='mod-header'>
        <h1>Moderator Dashboard</h1>
        <p>Manage reports, users, and monitor activity</p>
      </div>

      {/* Stats Cards */}
      <div className='mod-stats-grid'>
        <div className='mod-stat-card'>
          <AlertCircle size={24} className='stat-icon pending' />
          <div className='stat-content'>
            <span className='stat-label'>Pending Reports</span>
            <span className='stat-value'>{stats.pendingReports}</span>
          </div>
        </div>

        <div className='mod-stat-card'>
          <CheckCircle size={24} className='stat-icon total' />
          <div className='stat-content'>
            <span className='stat-label'>Total Reports</span>
            <span className='stat-value'>{stats.totalReports}</span>
          </div>
        </div>

        <div className='mod-stat-card'>
          <Activity size={24} className='stat-icon activity' />
          <div className='stat-content'>
            <span className='stat-label'>Activity Logs</span>
            <span className='stat-value'>{stats.activityLogs}</span>
          </div>
        </div>

        <div className='mod-stat-card'>
          <Layers size={24} className='stat-icon categories' />
          <div className='stat-content'>
            <span className='stat-label'>Categories</span>
            <span className='stat-value'>{stats.categories}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='mod-tabs-container'>
        <div className='mod-tabs'>
          <button
            className={`mod-tab ${activeTab === 'pending-reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending-reports')}
          >
            <AlertCircle size={16} /> Pending Reports
          </button>
          <button
            className={`mod-tab ${activeTab === 'all-reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-reports')}
          >
            <CheckCircle size={16} /> All Reports
          </button>
          <button
            className={`mod-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <Activity size={16} /> Activity Logs
          </button>
          <button
            className={`mod-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <AlertTriangle size={16} /> Suspend User
          </button>
          <button
            className={`mod-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Layers size={16} /> Categories
          </button>
        </div>

        <div className='mod-tab-content'>
          {activeTab === 'pending-reports' && <ReportsTab isPending={true} />}
          {activeTab === 'all-reports' && <ReportsTab isPending={false} />}
          {activeTab === 'activity' && <ActivityLogsTab />}
          {activeTab === 'users' && <UserSuspensionTab />}
          {activeTab === 'categories' && <CategoriesTab />}
        </div>
      </div>
    </div>
  )
}

export default ModeratorDashboard
