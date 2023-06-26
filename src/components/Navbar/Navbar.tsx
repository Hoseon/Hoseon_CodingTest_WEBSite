import { authModalState } from "@/components/atoms/authModalAtom";
import Link from "next/link";
import Image from "next/image";
import { useSetRecoilState } from "recoil";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => { 
    const setAuthModalState = useSetRecoilState(authModalState);
    const handleClick = () => {
        setAuthModalState((prev) => ({ ...prev, isOpen : true }))
     }
    return <div className="flex items-center justify-between sm:px-12 px-2 md:px-24">
        <Link href="/" className="flex items-center justify-center h-20">
            {/* <img src="/logo.png" alt="클론코딩이다!!" className="h-full" /> */}
            <Image src="/logo.png" alt="Leet" height={200} width={200} />
        </Link>
        <div className="flex items-center">
            <button className="bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium
             hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange border-2 border-transparent"
            onClick={handleClick}
            >
                로그인
            </button>
        </div>
    </div>
}

export default Navbar;

