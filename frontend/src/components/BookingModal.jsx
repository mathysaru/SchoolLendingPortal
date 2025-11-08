import React, { useState } from 'react';
import api from '../api';

export default function BookingModal({ item, onClose, onCreated }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post('/bookings', {
        item: item._id, startDate, endDate, quantity, notes
      });
      onCreated(res.data);
      toast.success('Request created successfully');
      onClose();
    }catch(err){
    toast.error(err?.response?.data?.error || 'Booking failed');
    //   alert(err?.response?.data?.error || 'Booking failed');
    }
  }

  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Request: {item.name}</h3>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="text-sm">Start Date</label><input required type="date" className="w-full p-2 border rounded" value={startDate} onChange={e=>setStartDate(e.target.value)} /></div>
          <div><label className="text-sm">End Date</label><input required type="date" className="w-full p-2 border rounded" value={endDate} onChange={e=>setEndDate(e.target.value)} /></div>
          <div><label className="text-sm">Quantity</label><input type="number" min="1" className="w-32 p-2 border rounded" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} /></div>
          <div><label className="text-sm">Notes</label><input className="w-full p-2 border rounded" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 btn-soft rounded">Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}
