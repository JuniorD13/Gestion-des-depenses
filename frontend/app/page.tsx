"use client"

import {useState, useEffect} from 'react';
import api from "./api";
import toast from "react-hot-toast";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

type Transaction = {
    id : string;
    text : string;
    amount : number;
    created_at : string
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
    
  const getTransactions = async () => {
    try {
      const res = await api.get<Transaction[]>("transactions/")
      setTransactions(res.data)
      toast.success("Transaction Chargée")
    } catch (error) {
      console.error("Erreur Chargement Transactions", error)
      toast.error("Erreur Chargement Transactions")
    }
  }

  useEffect(() => {
    getTransactions()
  }, []);

  const amounts = transactions.map((t) => Number(t.amount) || 0)
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0
  const income = amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0) || 0
  const expense = amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) || 0

  const ratio = income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
            
    })
  }

  return (
    <div className="w-2/3 flex flex-col gap-4">
      <div className="flex justify-between rounded-3xl border-2 border-warning/10 border-dashed bg-warning/5 p-6">
        <div className="flex flex-col gap-1">
          <div>
            <div className="badge badge-soft">
              <Wallet className="w-6 h-6" />
              Montant
            </div>
          </div>
          <div className="stat-value">{balance.toFixed(2)} $</div>

          <div className="flex flex-col gap-1">
            <div>
              <div className="badge badge-soft badge-success">
                <ArrowUpCircle className="w-6 h-6" />
                Revenus
              </div>
            </div>

            <div className="stat-value">{income.toFixed(2)} $</div>

            <div className="flex flex-col gap-1">
              <div>
                <div className="badge badge-soft badge-error">
                  <ArrowDownCircle className="w-6 h-6" />
                  Depenses
                </div>
              </div>
              <div className="stat-value">{expense.toFixed(2)} $</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}