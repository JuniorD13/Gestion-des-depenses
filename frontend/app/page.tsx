"use client"

import {useState} from 'react'


type Transaction = {
    id : string;
    text : string;
    amount : number;
    created_at : string
}

export default function Home() {
    const [ transactions, setTransaction ] = useState<Transation[]>([])
    return (
        <button className='btn btn-sm'>
            test
        </button>
    );
}