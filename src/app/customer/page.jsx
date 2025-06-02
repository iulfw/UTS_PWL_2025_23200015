"use client";
import styles from './CustomerPage.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerPage() {

  const [ formVisible, setFormVisible ] = useState(false);
  const [ customers, setcustomers ] = useState([]);
  const [ name, setName ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ email, setEmail ]= useState('');
  const [ msg, setMsg ] = useState('');
  const [ editId, setEditId ] = useState(null);

  const router = useRouter();
  const handleChange = (e) => {
    const path = e.target.value;
    if (path) router.push(path);
  };

  const fetchcustomers = async () => {
    const res = await fetch('/api/customer');
    const data = await res.json();
    setcustomers(data);
  };

  useEffect(() => {
    fetchcustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch('/api/customer', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, name, phone, email }),
    });

    if (res.ok) {
      setMsg('Saved Successfully!');
      setName('');
      setPhone('');
      setEmail('');
      setEditId(null);
      setFormVisible(false);
      fetchcustomers();
    } else {
      setMsg('Failed to Save Data!');
    }
  };

  const handleEdit = (item) => {
      setName(item.name);
      setPhone(item.phone);
      setEmail(item.email);
      setEditId(item.id);
      setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are You Sure?')) return;
    await fetch('/api/customer', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchcustomers();
  };

  return (
    <div className={styles.container}>
        <select onChange={handleChange} className={styles.dropdownNavigate}>
          <option value="">Customer</option>
          <option value="/preorder">Order</option>
          <option value="/paket">Package</option>
        </select>
        <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
        <h2 className={styles.subtitle}>List of Customer</h2>
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Close Form' : 'Add Data'}
        </button>
        
        {formVisible && (
            <div className={styles.formWrapper}>
                <h3>Input New Customer</h3>
                <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>Name</span>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Phone</span>
                    <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Email</span>
                    <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
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
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Time Created</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                    {customers.map((item, index) => (
                        <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td>{new Date(item.createdAt).toLocaleString('en-GB', { hour12: false })}</td>
                        <td>
                          <button onClick={() => handleEdit(item)}>Edit</button>
                          <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </td>
                        </tr>
                    ))}
                    {customers.length === 0 && (
                        <tr>
                        <td colSpan="6">No Data Available</td>
                        </tr>
                    )}
                </tbody>
            </table>    
        </div>
    </div>
  );
}
