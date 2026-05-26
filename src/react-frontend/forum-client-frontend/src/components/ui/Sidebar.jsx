import {
  Home,
  TrendingUp,
  Hash,
  Code2,
  Database,
  Globe,
  ShieldAlert,
  MessageSquare,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import './Sidebar.css'

const Sidebar = () => {
  const menuItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'Popular', icon: <TrendingUp size={20} />, path: '/popular' },
    { name: 'All Threads', icon: <Hash size={20} />, path: '/all' },
  ]

  const categories = [
    { name: 'Backend', icon: <Database size={18} />, path: '/category/backend' },
    { name: 'Frontend', icon: <Globe size={18} />, path: '/category/frontend' },
    { name: 'DevOps', icon: <Code2 size={18} />, path: '/category/devops' },
    { name: 'Security', icon: <ShieldAlert size={18} />, path: '/category/security' },
  ]

  const communityItems = [
    { name: 'Members', icon: <Users size={18} />, path: '/members' },
    { name: 'Discord', icon: <MessageSquare size={18} />, path: '/discord' },
  ]

  return (
    <aside className='sidebar'>
      <nav className='nav-section'>
        <span className='nav-label'>Feed</span>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Categories / Tags */}
      <nav className='nav-section'>
        <span className='nav-label'>Categories</span>
        {categories.map((cat) => (
          <NavLink
            key={cat.name}
            to={cat.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {cat.icon}
            <span>{cat.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Community Section */}
      <nav className='nav-section'>
        <span className='nav-label'>Community</span>
        {communityItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Footer Credits */}
      <div style={{ marginTop: 'auto', paddingLeft: '15px' }}>
        <p style={{ color: '#F0EAFF77', fontSize: '10px', letterSpacing: '1px' }}>
          FEED IT &copy; 2026
          <br />
          VERSION 1.0.4-STABLE
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
