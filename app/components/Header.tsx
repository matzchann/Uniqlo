import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-red-600">
            UNIQLO UMC Simulation
          </Link>
          <nav className="flex gap-6">
            <Link href="/week1" className="text-gray-600 hover:text-red-600 transition-colors">
              Week 1
            </Link>
            <Link href="/week5" className="text-gray-600 hover:text-red-600 transition-colors">
              Week 5
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-red-600 transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
