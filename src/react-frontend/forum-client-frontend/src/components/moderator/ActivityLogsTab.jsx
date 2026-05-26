import { useState, useEffect } from 'react'
import { Loader2, Activity } from 'lucide-react'
import { moderatorService } from '../../services/moderatorService'
import './ActivityLogsTab.css'

const ActivityLogsTab = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const loadLogs = async () => {
    setLoading(true)
    try {
      const response = await moderatorService.getActivityLogs()
      setLogs(response.data)
    } catch (err) {
      console.error('Failed to load activity logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const json = JSON.stringify(logs, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    loadLogs()
  }, [])

  if (loading) {
    return (
      <div className='logs-loading'>
        <Loader2 className='animate-spin' size={40} />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className='logs-empty'>
        <Activity size={48} />
        <p>No activity logs found.</p>
      </div>
    )
  }

  return (
    <div className='logs-container'>
      <button className='export-btn' onClick={handleExport}>
        ↓ Export JSON
      </button>

      <div className='logs-table-wrapper'>
        <table className='logs-table'>
          <thead>
            <tr>
              <th>Moderator</th>
              <th>Action</th>
              <th>Target Type</th>
              <th>Target ID</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className='log-row'>
                <td className='mod-name'>@{log.moderatorUsername}</td>
                <td className='action'>
                  <span className='action-badge'>{log.action}</span>
                </td>
                <td className='target-type'>{log.targetType}</td>
                <td className='target-id'>#{log.targetId}</td>
                <td className='timestamp'>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ActivityLogsTab
