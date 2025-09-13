"use client"

import {useState, useEffect} from 'react';
import api from "./api";
import toast from "react-hot-toast";


type Transaction = {
    id : string;
    text : string;
    amount : number;
    created_at : string
}

export default function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    
    const getTransactions = async () => {
        try{

            const res = await api.get<Transaction[]>("transactions/")
            setTransactions(res.data)
            toast.success("Transaction Chargée")

        } catch(error){
            console.error("Erreur Chargement Transactions", error)
            toast.error("Erreur Chargement Transactions")
        }
    };

    useEffect(() => {
        getTransactions()
    }, []);

    return (
        <button className='btn btn-sm'>
            test
        </button>
    );
}