import { useState, useEffect, useCallback } from 'react'
import { Loader2, CheckCircle, Trash2, AlertTriangle } from 'lucide-react'
import { moderatorService } from '../../services/moderatorService'
import './ReportsTab.css'

const ReportsTab = ({ isPending }) => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState({})
  const [deleting, setDeleting] = useState({})
  const [suspendingUserId, setSuspendingUserId] = useState(null)
  const [suspendDays, setSuspendDays] = useState(7)

  const loadReports = useCallback(async () => {
    setLoading(true)
    try {
      const response = isPending
        ? await moderatorService.getPendingReports()
        : await moderatorService.getAllReports()
      setReports(response.data)
    } catch (err) {
      console.error('Failed to load reports:', err)
    } finally {
      setLoading(false)
    }
  }, [isPending])

  useEffect(() => {
    loadReports()
  }, [isPending])

  const handleResolveReport = async (reportId) => {
    setResolving((prev) => ({ ...prev, [reportId]: true }))
    try {
      console.log('Resolving report:', reportId)
      await moderatorService.resolveReport(reportId)
      console.log('Report resolved, reloading reports...')
      await loadReports()
      console.log('Reports reloaded')
    } catch (err) {
      console.error('Failed to resolve report:', err)
    } finally {
      setResolving((prev) => ({ ...prev, [reportId]: false }))
    }
  }

  const handleDeletePost = async (reportId, postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    setDeleting((prev) => ({ ...prev, [reportId]: true }))
    try {
      await moderatorService.deletePost(postId)
      await loadReports()
    } catch (err) {
      console.error('Failed to delete post:', err)
    } finally {
      setDeleting((prev) => ({ ...prev, [reportId]: false }))
    }
  }

  const handleSuspendUser = async (reportId, username) => {
    if (!window.confirm(`Suspend user "${username}" for ${suspendDays} days?`)) return

    try {
      await moderatorService.suspendUser(reportId, suspendDays)
      setSuspendingUserId(null)
      setSuspendDays(7)
      await loadReports()
    } catch (err) {
      console.error('Failed to suspend user:', err)
    }
  }

  if (loading) {
    return (
      <div className='reports-loading'>
        <Loader2 className='animate-spin' size={40} />
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className='reports-empty'>
        <AlertTriangle size={48} />
        <p>No {isPending ? 'pending ' : ''}reports found.</p>
      </div>
    )
  }

  return (
    <div className='reports-container'>
      {reports.map((report) => (
        <div key={report.id} className='report-card'>
          <div className='report-header'>
            <div className='report-title'>
              <span className='report-type'>{report.reportedPostType}</span>
              <span className='report-owner'>by @{report.reportedPostOwner}</span>
            </div>
            <span className={`report-status ${report.resolved ? 'resolved' : 'pending'}`}>
              {report.resolved ? 'Resolved' : 'Pending'}
            </span>
          </div>

          <div className='report-reason'>
            <strong>Reason:</strong>
            <p>{report.reason}</p>
          </div>

          <div className='report-content'>
            <strong>Reported Post Content:</strong>
            {report.reportedPostTitle && (
              <h3 className='report-post-title'>{report.reportedPostTitle}</h3>
            )}
            <p>{report.reportedPostBody}</p>
          </div>

          <div className='report-meta'>
            <span>Post ID: {report.reportedPostId}</span>
            <span>Reported: {new Date(report.reportedAt).toLocaleString()}</span>
          </div>

          <div className='report-actions'>
            <button
              className='action-btn resolve'
              onClick={() => handleResolveReport(report.id)}
              disabled={resolving[report.id]}
            >
              {resolving[report.id] ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <CheckCircle size={16} />
              )}
              Mark Resolved
            </button>

            <button
              className='action-btn delete'
              onClick={() => handleDeletePost(report.id, report.reportedPostId)}
              disabled={deleting[report.id]}
            >
              {deleting[report.id] ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <Trash2 size={16} />
              )}
              Delete Post
            </button>

            <button className='action-btn suspend' onClick={() => setSuspendingUserId(report.id)}>
              <AlertTriangle size={16} />
              Suspend User
            </button>
          </div>

          {suspendingUserId === report.id && (
            <div className='suspend-form'>
              <div className='suspend-input-group'>
                <label>Suspend for (days):</label>
                <input
                  type='number'
                  min='1'
                  max='365'
                  value={suspendDays}
                  onChange={(e) => setSuspendDays(Number(e.target.value))}
                />
              </div>
              <div className='suspend-actions'>
                <button
                  className='btn-confirm'
                  onClick={() => handleSuspendUser(report.id, report.reportedPostOwner)}
                >
                  Confirm
                </button>
                <button className='btn-cancel' onClick={() => setSuspendingUserId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReportsTab
