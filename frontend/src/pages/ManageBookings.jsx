import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ManageBookings(){
  const [bookings, setBookings] = useState([]);

  async function load(){ try{ const res = await api.get('/bookings'); setBookings(res.data); }catch(e){ console.error(e); } }
  useEffect(()=>{ load(); }, []);

  async function approve(id){ try{ await api.put(`/bookings/${id}/approve`); load(); }catch(e){ alert(e?.response?.data?.error || 'Approve failed'); } }
  async function reject(id){ try{ await api.put(`/bookings/${id}/reject`); load(); }catch(e){ alert(e?.response?.data?.error || 'Reject failed'); } }
  async function markReturn(id){ try{ await api.put(`/bookings/${id}/return`); load(); }catch(e){ alert(e?.response?.data?.error || 'Return failed'); } }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Bookings</h2>
      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b._id} className="card-neu p-4 rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{b.item?.name}</div>
              <div className="text-sm text-gray-500">{b.user?.name} • {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}</div>
              <div className="text-sm text-gray-600 mt-1">Qty: {b.quantity} • Status: <strong>{b.status}</strong></div>
            </div>
            <div className="flex gap-2">
              {b.status === 'requested' && <button onClick={()=>approve(b._id)} className="px-3 py-1 bg-green-100 rounded">Approve</button>}
              {b.status === 'requested' && <button onClick={()=>reject(b._id)} className="px-3 py-1 bg-red-100 rounded">Reject</button>}
              {b.status === 'approved' && <button onClick={()=>markReturn(b._id)} className="px-3 py-1 bg-blue-100 rounded">Mark Returned</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
