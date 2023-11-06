"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import axios from "axios";
// Define the type for your expense object
type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

// Define the type for the form data
type FormData = {
  title: string;
  amount: string;
  category: string;
  date: string;
};

const CreateExpense = () => {
  // Add types to state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Convert string amount to number before sending
      const submissionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      const response = await axios.post<Expense>(
        "/api/expenses",
        submissionData
      );
      setExpenses([...expenses, response.data]);
      setFormData({ title: "", amount: "", category: "", date: "" }); // Reset form data
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Create Expense
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        onSubmit={handleSubmit}
      >
        <ModalContent>
          {(onClose) => (
            <form>
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create Expense
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                  />
                  <Input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    required
                  />
                  <Input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                  />
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary" onPress={onClose}>
                    Create
                  </Button>
                </ModalFooter>
              </>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreateExpense;
