import React, { useEffect, useState } from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror, { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import ReactCodeMirror from '@uiw/react-codemirror';
import EditorFooter from './EditorFooter';
import { Problem } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/firebase';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { problems } from '@/utils/problems';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import useLocalStorage from '@/hooks/useLocalStorage';

type PlaygroundProps = {
    problem: Problem;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings { 
    fontSize: string;
    settingsModalIsOpen: boolean;
    dropDownIsOpen: boolean;
}



const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
    let [userCode, setUserCode] = useState<string>(problem.starterCode);

    const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
    const [settings, setSettings] = useState<ISettings>({
        fontSize: fontSize,
        settingsModalIsOpen: false,
        dropDownIsOpen: false,
    }
         

    );

    const [user] = useAuthState(auth);
    const searchParams = useSearchParams();

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login to submit your Code", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark"
            });
            return;
        }

        try {
            userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName))
            const cb = new Function(`return ${userCode}`)();
            const handler = problems[searchParams?.get("pid") as string].handlerFunction;

            if (typeof handler === "function") { 
                const success = handler(cb);
                if (success) { 
                    toast.success("축하합니다 테스트에 합격하였습니다.",{ 
                        position: "top-center",
                        autoClose: 3000,
                        theme:"dark"
                    }) 
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 4000);
    
                    const userRef = doc(firestore, "users", user.uid);
                    await updateDoc(userRef, {
                        solvedProblems: arrayUnion(searchParams?.get("pid")),
                    })
                    setSolved(true);
                }
            }
            
        } catch (error: any) {
            console.log(error);
            if (error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly")) {
                toast.error("코드를 다시 확인해 주세요 화이팅입니다.", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                })
            } else { 
                toast.error(error.message, {
                    position: "top-center",
                    autoClose: 3000,
                    theme:"dark",
                })
            }
        }
    };

    useEffect(() => { 
        const code = localStorage.getItem(`code-${searchParams?.get("pid")}`);
        if (user) {
            setUserCode(code ? JSON.parse(code) : problem.starterCode);
        } else { 
            setUserCode(problem.starterCode);
        }
    },[searchParams?.get("pid"),user,problem.starterCode]);
        
    const onChange = (value: string) => { 
        setUserCode(value);
        localStorage.setItem(`code-${searchParams?.get("pid")}`, JSON.stringify(value));
    }

    const boilerPlate = `function twoSum(nums, target) {
    //Write your code here
    };`

    return (
    <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
            <PreferenceNav settings={settings} setSettings={ setSettings } />

        <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
            <div className='w-full overflow-auto'>
                    <ReactCodeMirror
                        value={userCode}
                        theme={vscodeDark}
                        onChange={onChange}
                        extensions={[javascript()]}
                        style={{ fontSize: settings.fontSize }}
                    />
            </div>
            <div className='w-full px-5 overflow-auto'>
                <div className='flex h-10 items-center space-x-6'>
                    <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                        <div className='text-sm font-medium leading-5 text-white'>TestCases</div>
                        <hr className='absolute h-0.5 bottom-0 w-full rounded-full border-none bg-white' />
                    </div>
                </div>

                <div className='flex'>
                    <div className='flex'>
                        {problem.examples.map((example, index) => (
                        <div className='mr-2 items-start mt-2' key={example.id} onClick={()=> setActiveTestCaseId(index)}>
                            <div className='flex flex-wrap items-center gap-y-4'>
                                <div
                                        className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                                        ${activeTestCaseId === index ? "text-white" : "text-gray-500"}
                                        `}>
                                    Case {index + 1}
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className='font-semibold my-4'>
                    <p className='text-sm font-medium mt-4 text-white'>Input:</p>
                    <div
                        className='w-full cusor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                        {problem.examples[activeTestCaseId].inputText}
                    </div>

                    <p className='text-sm font-medium mt-4 text-white'>Output:</p>
                    <div
                        className='w-full cusor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            { problem.examples[activeTestCaseId].outputText}
                    </div>
                </div>
            </div>
        </Split>
            <EditorFooter handleSubmit={handleSubmit} />
    </div>
    );
    }
    export default Playground;