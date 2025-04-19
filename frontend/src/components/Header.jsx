import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

import DefaultAvatar from '../../public/images/Question.png'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 w-full bg-white flex items-center justify-between p-[20px] px-[60px] shadow-[0_1.5px_4px_rgba(0,0,0,0.2)] z-50">

      {/* Logo on the left */}
      <Link to="/home" className="flex items-center space-x-2">
        {/* replace with your actual logo */}
        <img src="logos/Logo-Brown.svg" alt="FIXD Logo" className="h-10" />
      </Link>

      <nav className="flex items-center space-x-[50px]">
        <Link to="/chats">
          <img src='icons/No-messages.svg' alt="Chats" className="h-6 w-6" />
        </Link>

        <Link to="/orders" className="text-xl font-semibold text-[var(--color-heading)] [font-family:var(--font-heading)] hover:underline">
          My Orders
        </Link>

        <Link to="/profile">
          <img
            src={user?.profilePicture || DefaultAvatar}
            alt="Your profile"
            className="h-13 w-13 rounded-full object-cover border-1 border-[var(--color-heading)]"
          />
        </Link>
      </nav>
    </header>
  )
}
