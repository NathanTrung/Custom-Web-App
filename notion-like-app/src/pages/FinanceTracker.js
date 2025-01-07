import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

const FinanceTracker = () => {
  const [finances, setFinances] = useState([]);
  const [newFinance, setNewFinance] = useState({
    title: '',
    amount: '',
    type: 'Income',
    category: '',
  });
  const [error, setError] = useState(null);

  // Categories
  const categories = {
    Housing: ['Rent', 'Mortgage', 'Repairs'],
    Transportation: ['Fuel', 'Public Transport', 'Car Maintenance'],
    Food: ['Groceries', 'Dining Out'],
    Utilities: ['Electricity', 'Water', 'Internet'],
    Education: ['Tuition', 'Books', 'Supplies'],
    Entertainment: ['Movies', 'Games', 'Streaming'],
    Other: ['Miscellaneous'],
  };

  // Register Chart.js components
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  // Fetch Finances
  const fetchFinances = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/finance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFinances(response.data);
    } catch (err) {
      setError('Unable to fetch finances');
    }
  };

  // Add Finance
  const addFinance = async () => {
    if (!newFinance.title || !newFinance.amount || !newFinance.category) {
      setError('All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/finance',
        newFinance,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewFinance({ title: '', amount: '', type: 'Income', category: '' });
      fetchFinances(); // Refresh finance list
    } catch (err) {
      setError('Unable to add finance');
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/finance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFinances(); // Refresh the transactions list
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  // Calculate Budget
  const calculateBudget = () => {
    const income = finances
      .filter((f) => f.type === 'Income')
      .reduce((sum, f) => sum + f.amount, 0);
    const expense = finances
      .filter((f) => f.type === 'Expense')
      .reduce((sum, f) => sum + f.amount, 0);

    return { income, expense };
  };

  const calculateCategoryData = () => {
    const categoryMap = {};

    finances.forEach((finance) => {
      if (!categoryMap[finance.category]) {
        categoryMap[finance.category] = 0;
      }
      categoryMap[finance.category] += finance.amount;
    });

    return categoryMap;
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  const { income, expense } = calculateBudget();
  const currentBalance = income - expense; // Calculate the current balance
  const categoryData = calculateCategoryData();

  const budgetData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336'], // Green and Red
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Amount by Category',
        data: Object.values(categoryData),
        backgroundColor: [
          '#4caf50',
          '#f44336',
          '#2196f3',
          '#ff9800',
          '#9c27b0',
          '#3f51b5',
          '#607d8b',
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Finance Tracker</h1>

      {/* Chart with Balance */}
      <div className="flex flex-col items-center mb-8">
        <div style={{ width: '300px', height: '300px' }} className="mb-4">
          <Pie data={budgetData} />
        </div>
        <h2 className="text-xl font-semibold">
          Current Balance: ${currentBalance.toFixed(2)}
        </h2>
      </div>

      {/* Bar Chart */}
      <div style={{ width: '600px', height: '400px' }} className="mb-8">
        <Bar data={categoryChartData} />
      </div>

      {/* Layout for columns */}
      <div className="flex flex-wrap w-full max-w-5xl gap-8">
        {/* Income Column */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Income</h2>
          <div className="space-y-4">
            {finances
              .filter((finance) => finance.type === 'Income')
              .map((finance) => (
                <div
                  key={finance._id}
                  className="border p-4 shadow-md bg-green-100 rounded-lg"
                >
                  <p className="font-bold">{finance.title}</p>
                  <p>Amount: ${finance.amount}</p>
                  <p>Category: {finance.category}</p>
                  <p>Date: {new Date(finance.date).toLocaleDateString()}</p>
                  <button
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => deleteTransaction(finance._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Expense Column */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
          <div className="space-y-4">
            {finances
              .filter((finance) => finance.type === 'Expense')
              .map((finance) => (
                <div
                  key={finance._id}
                  className="border p-4 shadow-md bg-red-100 rounded-lg"
                >
                  <p className="font-bold">{finance.title}</p>
                  <p>Amount: ${finance.amount}</p>
                  <p>Category: {finance.category}</p>
                  <p>Date: {new Date(finance.date).toLocaleDateString()}</p>
                  <button
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => deleteTransaction(finance._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Add New Entry Column */}
        <div className="flex-1 max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add New Entry
          </h2>
          <div className="bg-white p-6 shadow-md rounded-lg space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newFinance.title}
              onChange={(e) =>
                setNewFinance({ ...newFinance, title: e.target.value })
              }
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newFinance.amount}
              onChange={(e) =>
                setNewFinance({ ...newFinance, amount: Number(e.target.value) })
              }
              className="w-full border px-4 py-2 rounded"
            />
            <select
              value={newFinance.type}
              onChange={(e) =>
                setNewFinance({ ...newFinance, type: e.target.value })
              }
              className="w-full border px-4 py-2 rounded"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <select
              value={newFinance.category}
              onChange={(e) =>
                setNewFinance({ ...newFinance, category: e.target.value })
              }
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Select Category</option>
              {Object.entries(categories).map(([parent, subcategories]) => (
                <optgroup label={parent} key={parent}>
                  {subcategories.map((subcategory) => (
                    <option value={subcategory} key={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              onClick={addFinance}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Entry
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;
