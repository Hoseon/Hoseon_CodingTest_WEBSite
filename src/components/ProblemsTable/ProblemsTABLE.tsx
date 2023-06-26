import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { BsCheckCircle } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from 'react-icons/io5';
import YouTube from "react-youtube";
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/firebase';
import { DBProblem } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';


type ProblemsTABLEProps = {
    setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProblemsTABLE: React.FC<ProblemsTABLEProps> = ( { setLoadingProblems } ) => {
    const [youtubePlayer, setYoutubePlayer] = useState({
        isOpen: false,
        videoId: ""
    })
    const problems = useGetProblems(setLoadingProblems);
    const solvedProblems = useGetSolvedProblems();

    console.log("solvedProblems", solvedProblems);

    const closeModal = () => { 
        setYoutubePlayer({ isOpen: false, videoId: "" });
    }

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        }
        window.addEventListener("keydown", handleEsc);

        return () => window.removeEventListener("keydown", handleEsc);
    })


    return (
    <>
        <tbody className='text-white'>
                {problems.map((problem, idx) => {
            const diffColor = problem.difficulty === "Easy" ? "text-dark-green-s" : problem.difficulty === "Medium" ?
            "text-dark-yellow" : "text-dark-pink";
            return (
            <tr className={`${idx % 2==1 ? "bg-dark-layer-1" : "" }`}>
                <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
                        {solvedProblems.includes(problem.id) &&  <BsCheckCircle fontSize={"18"} width="18" />} 
                </th>
                <td className='px-6 py-4'>
                        {problem.link ? (
                            <Link href={problem.link} className='hover:text-blue-600 cursor-pointer' target='_blank'>
                            </Link>
                        ) : (
                        <Link className="hover:text-blue-600 cursor-pointer" href={`/problems/${problem.id}`}>
                        {problem.title}
                    </Link>
                    )}
                </td>
                <td className={`px-6 py-4 ${diffColor}`}>
                    { problem.difficulty }
                </td>
                <td className={`px-6 py-4`}>
                    { problem.category }
                </td>
                <td className={"px-6 py-4"}>
                    {problem.videoId ? (
                            <AiFillYoutube fontSize={"28"} className="cursor-pointer hover:text-red-600"
                                onClick={() => setYoutubePlayer({ isOpen: true, videoId: problem.videoId as string })} />
                    ) : (
                    <p className='text-gray-400'>Comming Soon</p>
                    )}
                </td>
            </tr>
            );
            })}
            </tbody>
            
            { youtubePlayer.isOpen && (
            <tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>
            <div className='bg-black z-10 opacity-70 top-0 lef-0 w-screen h-screen absolute'></div>
            <div className='w-full z-50 h-full px-6 relative max-w-4xl'>
                <div className='w-full h-full flex items-center justify-center relative'>
                    <div className='w-full relative'>
                            <IoClose fontSize={"35"} className='cursor-pointer absolute -top-16 right-0' onClick={closeModal}/>
                            <YouTube videoId={"xty7fr-k0TU"} loading='lazy' iframeClassName='w-full min-h-[500px]'/>
                    </div>
                </div>
            </div>
            </tfoot>
            )}
    </>

    );
    }
export default ProblemsTABLE;
    
function useGetProblems(setLoadingPreblems: React.Dispatch<React.SetStateAction<boolean>>) { 
    const [problems, setProblems] = useState<DBProblem[]>([]);

    useEffect(() => {
        const getProblems = async () => {
            setLoadingPreblems(true);
            const q = query(collection(firestore, "problems"), orderBy("order", "asc"))
            const querySnapshot = await getDocs(q);
            const temp: DBProblem[] = [];
            querySnapshot.forEach((doc) => {
                temp.push({ id: doc.id , ...doc.data()}  as DBProblem);
            });
            setProblems(temp);
            setLoadingPreblems(false);
        };
        
        getProblems();
    }, [setLoadingPreblems]);
    return problems;
}

function useGetSolvedProblems() { 
    const [sovledProblems, setSolvedProblems] = useState<string[]>([]);
    const [user] = useAuthState(auth);
    useEffect(() => { 

        const getSolvedProblems = async () => { 
            const userRef = doc(firestore, "users", user!.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) { 
                setSolvedProblems(userDoc.data().solvedProblems);
            }
        }
        if (user) getSolvedProblems();
        if (!user) setSolvedProblems([]);
    }, [])
    return sovledProblems;
}