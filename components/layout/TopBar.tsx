"use client"
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

import { navLinks } from '@/lib/constants'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

const TopBar = () => {

    const [dropDownMenu, setDropDownMenu] = useState(false);

    const pathName = usePathname();
    return (
        <div className='flex  justify-between items-center sticky top-0 z-10 w-full p-8 py-4 bg-blue-2 shadow-lg lg:hidden'>
            <Image src={"/logo.png"} alt={"Logo"} width={150} height={70} />
            <div className='flex gap-8 max-md:hidden'>
                {navLinks.map(item => (<Link className={`flex gap-4 text-body-medium ${pathName === item.url ? "text-blue-1" : ""}`} key={item.label} href={item.url}>
                    <p>{item.label}</p>
                </Link>))}
            </div>
            <div className='relative flex items-center gap-4'>
                <Menu className='cursor-pointer md:hidden' onClick={() => setDropDownMenu(!dropDownMenu)} />
                {dropDownMenu && <div className='absolute flex flex-col gap-8 top-12 right-6 p-5 bg-white shadow-xl rounded-lg'>
                    {navLinks.map(item => (<Link className='flex gap-4 text-body-medium' key={item.label} href={item.url}>
                        {item.icon}<p>{item.label}</p>
                    </Link>))}
                </div>}
                <UserButton />
            </div>
        </div>
    )
}

export default TopBar