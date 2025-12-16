import { useEffect, useState } from 'react';
import api from '../api';


export default function Kitchen() {
const [orders, setOrders] = useState([]);


useEffect(() => {
api.get('/api/orders').then(res => setOrders(res.data));
}, []);


const updateStatus = async (id, status) => {
await api.put(`/api/orders/${id}`, { status });
setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
};


return (
<div>
<h2>Kitchen</h2>
{orders.map(o => (
<div key={o._id} style={{ border: '1px solid black', margin: 10 }}>
<p>สถานะ: {o.status}</p>
<button onClick={() => updateStatus(o._id, 'กำลังทำ')}>กำลังทำ</button>
<button onClick={() => updateStatus(o._id, 'เสร็จ')}>เสร็จ</button>
</div>
))}
</div>
);
}