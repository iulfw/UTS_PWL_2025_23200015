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

  const fetchpakets = async () => {
    const res = await fetch('/api/paket');
    const data = await res.json();
    setpakets(data);
  };

  useEffect(() => {
    fetchpakets();
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
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Tutup Form' : 'Tambah Data'}
        </button>
        
        {formVisible && (
            <div className={styles.formWrapper}>
                <h3>Input Data Baru</h3>
                <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>Kode Paket</span>
                    <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Nama Paket</span>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan Nama Paket"
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Deskripsi</span>
                    <input
                    type="text"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Masukkan Deskripsi Paket"
                    required
                    />
                </div>
                <button type="submit">
                    Simpan
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
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                </tr>
                </thead>
                <tbody>
                    {pakets.map((item, index) => (
                        <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.desc}</td>
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
