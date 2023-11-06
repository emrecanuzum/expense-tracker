"use client";
// Importing necessary hooks and axios
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import CreateExpense from "./components/createExpense";
import { Button } from "@nextui-org/react";

// Define the type for your expense object
type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

// Define the type for the form data

const Home = () => {
  // Add types to state
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Function to fetch expenses from API
  const fetchExpenses = async () => {
    try {
      const response = await axios.get<Expense[]>("/api/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  // Handle delete expense
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Handle update expense
  const handleUpdate = async (id: string, data: Expense) => {
    try {
      const response = await axios.put<Expense>(`/api/expenses/${id}`, data);
      setExpenses(
        expenses.map((expense) =>
          expense._id === id ? response.data : expense
        )
      );
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  // JSX for the component
  return (
    <main className="container mx-auto">
      <CreateExpense />

      {/* List of expenses */}
      <ul className="container mx-auto max-w-[500px]">
        {expenses.map((expense) => (
          <li className="p-4 mb-2 border-2" key={expense._id}>
            <p className="font-bold text-left">{expense.title}</p>
            <div className="grid grid-cols-3">
              <p>${expense.amount} </p>
              <p>{expense.category}</p>
              <p>{new Date(expense.date).toLocaleDateString("en-GB")}</p>
            </div>
            <div className="flex mx-auto">
              <Button
                color="danger"
                className="mr-2"
                onClick={() => handleDelete(expense._id)}
              >
                Delete
              </Button>
              {/* Example Update: Using the same expense data */}
              <Button
                color="secondary"
                onClick={() => handleUpdate(expense._id, expense)}
              >
                Update
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
