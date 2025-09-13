"use client"

import {useState, useEffect,} from 'react';
import api from "./api";
import toast from "react-hot-toast";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Activity,
  TrendingUp,
  TrendingDown,
  Trash,
  CirclePlus,
  CircleX,
} from "lucide-react";

type Transaction = {
    id : string;
    text : string;
    amount : number;
    created_at : string
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [text, setText] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
    
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

  const deleteTransactions = async (id) => {
    try {
      await api.delete(`transactions/${id}/`)
      getTransactions()
      toast.success("Transaction Supprimée")
    } catch (error) {
      console.error("Erreur de suppresion", error);
      toast.error("Erreur de suppresion")
    }
  }

  const addTransactions = async () => {
    if (!text || amount == "" || isNaN(Number(amount))) { 
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }
    setLoading(true)
    try {
      const res = await api.post<Transaction>("transactions/", {
        text,
        amount: Number(amount),
      });
      getTransactions();

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
      setText("");
      setAmount("");
      
      toast.success("Transaction Ajoutee");
    } catch (error) {
      console.error("Erreur de Transaction", error);
      toast.error("Erreur de Transaction");
    }
    finally {
      setLoading(false)
    }
  };

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
            
    })
  }

  return (
    <div className="w-2/3 flex flex-col gap-4">
      <div className="flex justify-between rounded-3xl border-2 border-warning/10 border-dashed bg-warning/5 p-6">
        <div className="flex flex-col gap-1">
          <div>
            <div className="badge badge-soft">
              <Wallet className="w-6 h-6" />
              SOLD
            </div>
          </div>
          <div className="stat-value">{balance.toFixed(2)} $</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <div className="badge badge-soft badge-success">
              <ArrowUpCircle className="w-6 h-6" />
              Montant
            </div>
          </div>
          <div className="stat-value">{income.toFixed(2)} $</div>
        </div>
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

      <div className="rounded-3xl border-2 border-warning/10 border-dashed bg-warning/5 p-6">
        <div className="flex justify-between items-center mb-1">
          <div>
            <div className="badge badge-soft badge-warning gap-1">
              <Activity className="w-4 h-4" />
              Dpenses Vs Revenus
            </div>
          </div>
          <div>{ratio} %</div>
        </div>
        <progress
          className="progress progress-warning w-full"
          value={ratio}
          max={100}
        ></progress>
      </div>

      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn bg-amber-300  font-semibold text-black "
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        <CirclePlus className="w-4 h-4" />
        Ajouter Transaction
      </button>

      <div className="overflow-x-auto rounded-3xl border-2 border-warning/10 border-dashed bg-warning/5 p-4">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Date</th>
              <th>ACtion</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id}>
                <th>{index + 1}</th>
                <td>{t.text}</td>
                <td className="font-semibold flex items-center gap-2">
                  {t.amount > 0 ? (
                    <TrendingUp className="text-success w-6 h-6" />
                  ) : (
                    <TrendingDown className="text-error w-6 h-6" />
                  )}

                  {t.amount > 0 ? `+${t.amount}` : `${t.amount}`}
                </td>
                <td>{formatDate(t.created_at)}</td>
                <td>
                  <button
                    className="btn btn-soft btn-error btn-sm"
                    onClick={() => deleteTransactions(t.id)}
                  >
                    <Trash className=" w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="my_modal_3" className="modal backdrop-blur">
        <div className="modal-box border-2 border-warning/10 border-dashed">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <CircleX className="w-4 h-4" />
            </button>
          </form>
          <h3 className="font-bold text-lg">Ajouter Une Transaction</h3>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="text"
                placeholder="Description"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <input
                type="number"
                name="number"
                placeholder="Revenus ou Depense "
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="input w-full"
              />
            </div>
          </div>

          <button
            className='btn bg-amber-300  font-semibold text-black mt-4 w-full'
            onClick={addTransactions}
            disabled={loading}
          >
            <CirclePlus className="w-4 h-4" />
            Ajouter 
          </button>
        </div>
      </dialog>
    </div>
  );
}