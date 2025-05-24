"use client";
import styles from './PaketPage.module.css';
import { useEffect, useState } from 'react';

export default function PaketPage() {

  const [ formVisible, setFormVisible ] = useState(false);
  const [ pakets, setpakets ] = useState([]);
  const [ code, setCode ] = useState('');
  const [ name, setName ] = useState('');
  const [ desc, setDesc ]= useState('');
  const [ msg, setMsg ] = useState('');
  const [ editId, setEditId ] = useState(null);
  const [ summary, setSummary ] = useState({});

  const fetchsummary = async () => {
    const res = await fetch('/api/summary');
    const data = await res.json();

    const map = {};
    data.forEach(item => {
      map[item.selected_package] = item._sum.qty;
    });
    setSummary(map);
  };

  const fetchpakets = async () => {
    const res = await fetch('/api/paket');
    const data = await res.json();
    setpakets(data);
  };

  useEffect(() => {
    fetchpakets();
    fetchsummary();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch('/api/paket', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, code, name, desc }),
    });

    if (res.ok) {
      setMsg('Saved Successfully!');
      setCode('');
      setName('');
      setDesc('');
      setEditId(null);
      setFormVisible(false);
      fetchpakets();
    } else {
      setMsg('Failed to Save Data!');
    }
  };

  const handleEdit = (item) => {
      setCode(item.code);
      setName(item.name);
      setDesc(item.desc);
      setEditId(item.id);
      setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are You Sure?')) return;
    await fetch('/api/paket', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchpakets();
  };

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
        <h2 className={styles.subtitle}>List of Package</h2>
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Close Form' : 'Add Data'}
        </button>
        
        {formVisible && (
            <div className={styles.formWrapper}>
                <h3>Input New Package</h3>
                <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>Code</span>
                    <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Package</span>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Description</span>
                    <input
                    type="text"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
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
                    <th>Code</th>
                    <th>Package</th>
                    <th>Description</th>
                    <th>Order</th>
                </tr>
                </thead>
                <tbody>
                    {pakets.map((item, index) => (
                        <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.desc}</td>
                        <td>{summary[item.id] || 0}</td>
                        <td>
                          <button onClick={() => handleEdit(item)}>Edit</button>
                          <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </td>
                        </tr>
                    ))}
                    {pakets.length === 0 && (
                        <tr>
                        <td colSpan="5">No Data Available</td>
                        </tr>
                    )}
                </tbody>
            </table>    
        </div>
    </div>
  );
}
