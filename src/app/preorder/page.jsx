"use client";
import styles from './PreorderPage.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PreorderPage() {

  const [ formVisible, setFormVisible ] = useState(false);
  const [ preorders, setpreorders ] = useState([]);
  const [ pakets, setpakets ] = useState([]);
  const [ order_date, setOrderDate ] = useState('');
  const [ order_by, setOrderBy ] = useState('');
  const [ selected_package, setSelectedPackage ]= useState('');
  const [ qty, setQty ] = useState('');
  const [ is_paid, setStatus ] = useState('');
  const [ msg, setMsg ] = useState('');
  const [ editId, setEditId ] = useState(null);

  const fetchpreorders = async () => {
    const res = await fetch('/api/preorder');
    const data = await res.json();
    setpreorders(data);
  };

  const fetchpakets = async () => {
    const res = await fetch('/api/paket');
    const data = await res.json();
    setpakets(data);
  };

  useEffect(() => {
    fetchpreorders();
    fetchpakets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch('/api/preorder', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, order_date, order_by, selected_package, qty, is_paid }),
    });

    if (res.ok) {
      setMsg('Saved Successfully!');
      setOrderDate('');
      setOrderBy('');
      setSelectedPackage('');
      setQty('');
      setStatus('');
      setEditId(null);
      setFormVisible(false);
      fetchpreorders();
    } else {
      setMsg('Failed to Save Data!');
    }
  };

  const handleEdit = (item) => {
      setOrderDate(item.order_date ? new Date(item.order_date).toISOString().split('T')[0] : '');
      setOrderBy(item.order_by);
      setSelectedPackage(item.selected_package);
      setQty(item.qty);
      setStatus(item.is_paid ? 'Paid':'Unpaid');
      setEditId(item.id);
      setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are You Sure?')) return;
    await fetch('/api/preorder', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchpreorders();
  };

  return (
    <div className={styles.container}>
        <Link href="/paket">
            <button className={styles.buttonNavigate}>Go to Package</button>
        </Link>
        <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
        <h2 className={styles.subtitle}>List of Order</h2>
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Close Form' : 'Add Data'}
        </button>
        
        {formVisible && (
            <div className={styles.formWrapper}>
                <h3>Input New Order</h3>
                <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>Date</span>
                    <input
                    type="date"
                    value={order_date}
                    onChange={(e) => setOrderDate(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Customer</span>
                    <input
                    type="text"
                    value={order_by}
                    onChange={(e) => setOrderBy(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Package</span>
                    <select 
                        value={selected_package}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        required
                    >
                        <option value="">Select Package</option>
                        {pakets.map((paket) => (
                          <option key={paket.id} value={paket.id}>
                            {paket.name}
                          </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <span>Quantity</span>
                    <input
                    type="text"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Status</span>
                    <label>
                    <input
                    type="radio"
                    value="Paid"
                    checked={is_paid === "Paid"}
                    onChange={(e) => setStatus(e.target.value)}
                    />
                    Paid
                </label>
                <label>
                    <input
                    type="radio"
                    value="Unpaid"
                    checked={is_paid === "Unpaid"}
                    onChange={(e) => setStatus(e.target.value)}
                    />
                    Unpaid
                </label>
                </div>
                <button type="submit">
                    Submit
                </button>
                <p>{msg}</p>
                </form>
            </div>
        )}

        <div className={styles.tableWrapper}>
            <table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Package</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {preorders.map((item, index) => (
                        <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{new Date(item.order_date).toLocaleDateString('en-GB')}</td>
                        <td>{item.order_by}</td>
                        <td>{item.paket?.name || "Unknown"}</td>
                        <td>{item.qty}</td>
                        <td>{item.is_paid ? 'Paid':'Unpaid'}</td>
                        <td>
                          <button onClick={() => handleEdit(item)}>Edit</button>
                          <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </td>
                        </tr>
                    ))}
                    {preorders.length === 0 && (
                        <tr>
                        <td colSpan="8">No Data Available</td>
                        </tr>
                    )}
                </tbody>
            </table>    
        </div>
    </div>
  );
}
