import Link from "next/link"
import Image from "next/image"

const HeaderLogo = () => {
  return (
    <Link href="/">
        <div className="items-center hidden lg:flex">
            <Image src="/logo.svg" alt="Logo" height={48} width={48} />
            <p className="font-semibold text-white text-2xl ml-1.5">
                Coinvalley
            </p>
        </div>
    </Link>
  )
}

export default HeaderLogo