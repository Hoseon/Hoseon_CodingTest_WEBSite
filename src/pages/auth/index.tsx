import AuthModal from "@/components/Modals/AuthModal";
import Navbar from "@/components/Navbar/Navbar";
import { authModalState } from "@/components/atoms/authModalAtom";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import Image from "next/image";


type AuthPageProps = {};

const AuthPage: React.FC<AuthPageProps> = () => { 
    const authModal = useRecoilValue(authModalState);
    const [pageLoading, setPageLoading] = useState(true);
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => { 
        if (user) router.push("/");
        if (!loading && !user) setPageLoading(false);
    }, [user, router]);

    // if (pageLoading) return null;


    return <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
        <div className="max-w-7xl mx-auto">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-no">
                {/* <img src="/hero.png" alt="hero?" /> */}
                <Image src="/hero.png" alt="Hero" width={700} height={ 700 } />
            </div>
            { authModal.isOpen && <AuthModal />}
        </div>
    </div>
}

export default AuthPage;