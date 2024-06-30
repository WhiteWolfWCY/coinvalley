import Link from "next/link"
import Image from "next/image"

const HeaderLogo = () => {
  return (
    <Link href="/" className="mx-4 md:mx-0">
        <div className="items-center flex">
            <Image src="/logo.svg" alt="Logo" height={64} width={64} />
            <p className="font-semibold text-white text-2xl ml-1.5">
                Coinvalley
            </p>
        </div>
    </Link>
  )
}

export default HeaderLogo