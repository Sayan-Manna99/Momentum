import Link from 'next/link'

import Image from 'next/image'
import NavItems from './auth/NavItems'
import UserDropdown from './auth/UserDropdown'
function Header() {
  return (
    <header className="sticky top-0 header">
        <div className='container header-wrapper'>
            <Link href='/'>
                <Image src="assets/icons/logo.svg" width={140} height={32} alt="Momentum Logo" className="h-10 w-auto cursor-pointer" />
            </Link>
            <nav className='hidden md:block'>
                <NavItems/>
            </nav>
            <UserDropdown/>
        </div>
    </header>
  )
}

export default Header