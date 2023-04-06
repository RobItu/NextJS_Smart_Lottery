import Head from "next/head"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
//import ManualHeader from "@/components/ManualHeader"
import { useMoralis } from "react-moralis"
import Header from "@/components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <>
            <Head>
                <title>Smart Contract</title>
                <meta name="description" content="Lottery" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/*<ManualHeader /> */}
            <Header />
            <LotteryEntrance />
        </>
    )
}
