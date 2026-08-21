import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editId, setEditId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Loi lay danh sach:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/students/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditId(null);
    } else {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setForm({ studentId: '', name: '', email: '' });
    fetchStudents();
  };

  const handleEdit = (st) => {
    setEditId(st._id);
    setForm({ studentId: st.studentId, name: st.name, email: st.email });
  };

  const handleDelete = async (id) => {
    if (confirm('Ban co chac muon xoa sinh vien nay?')) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '750px', margin: 'auto', backgroundColor: '#fff', color: '#333', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#1a73e8' }}>Ứng dụng Quản lý Sinh viên (MERN Stack)</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <input 
          placeholder="Mã số sinh viên (MSSV)" 
          value={form.studentId} 
          onChange={e => setForm({...form, studentId: e.target.value})} 
          required 
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input 
          placeholder="Họ và tên" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input 
          placeholder="Email" 
          type="email"
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            {editId ? "Lưu cập nhật" : "Thêm sinh viên"}
          </button>
          {editId && (
            <button 
              type="button" 
              onClick={() => { setEditId(null); setForm({ studentId:'', name:'', email:'' }); }}
              style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <h3>Danh sách sinh viên hiện có</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>MSSV</th>
            <th>Họ Tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Chưa có dữ liệu</td></tr>
          ) : (
            students.map(st => (
              <tr key={st._id}>
                <td>{st.studentId}</td>
                <td>{st.name}</td>
                <td>{st.email}</td>
                <td>
                  <button onClick={() => handleEdit(st)} style={{ cursor: 'pointer', marginRight: '6px' }}>Sửa</button>
                  <button onClick={() => handleDelete(st._id)} style={{ cursor: 'pointer', color: 'red' }}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;