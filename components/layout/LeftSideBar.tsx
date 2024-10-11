"use client"
import { navLinks } from '@/lib/constants'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LeftsideBar = () => {
    const pathName = usePathname();
    return (
        <div className='h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden'>
            <Image src={"/logo.png"} alt={"Logo"} width={150} height={70} />
            <div className='flex flex-col gap-12'>
                {navLinks.map(item => (<Link className={`flex gap-4 text-body-medium  ${pathName === item.url ? "text-blue-1" : ""}`} key={item.label} href={item.url}>
                    {item.icon}<p>{item.label}</p>
                </Link>))}
            </div>
            <div className='flex items-center gap-4 text-body-medium'>
                <UserButton />
                <p>Edit Profile</p>
            </div>
        </div>
    )
}

export default LeftsideBar