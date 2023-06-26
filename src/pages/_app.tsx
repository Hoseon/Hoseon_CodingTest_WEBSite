import "@/app/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RecoilRoot>
            <Head>
            <title>추호선의 Leet</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
				<meta
					name='description'
					content='Next.js를 공부해볼결 클론코딩을 시작하였다 2023-06-21'
				/>
            </Head>
            <ToastContainer />
            <Component {...pageProps} />
        </RecoilRoot>
			
	);
}