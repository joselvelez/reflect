import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-100 p-4 flex gap-4">
      <Link href="/">Dashboard</Link>
      <Link href="/messages/new">New Message</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  )
}
