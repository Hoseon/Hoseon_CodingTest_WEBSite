import Topbar from '@/components/Topbar/Topbar';
import Workspace from '@/components/Workspace/Workspace';
import { problems } from '@/utils/problems';
import { Problem } from '@/utils/types/problem';
import React from 'react';

type ProblemsPageProps = {
    problem:Problem
};

const ProblemsPage: React.FC<ProblemsPageProps> = ({ problem }) => {
    
    return <div>
        <Topbar problemPage={true} />
        <Workspace problem={ problem} />
    </div>
}
export default ProblemsPage;

export async function getStaticPaths() { 
    const paths = Object.keys(problems).map((key) => ({
        params: {pid:key}
    }))

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }: { params: {pid:string} }) { 
    const { pid } = params;
    const problem = problems[pid];

    if (!problem) { 
        return {
            notFound:true
        }
    }
    problem.handlerFunction = problem.handlerFunction.toString();
    return {
        props: {
            problem
        }
    }
}