const express = require('express');
const Joi = require('joi');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const Booking = require('../models/Booking');
const Item = require('../models/Item');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Equipment booking and returns
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 description: ID of the item to book
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               quantity:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking created successfully
 *       400:
 *         description: Validation or quantity error
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (own bookings for students, all for admin/staff)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */

/**
 * @swagger
 * /api/bookings/{id}/approve:
 *   put:
 *     summary: Approve a booking (Admin/Staff only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking approved
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/{id}/reject:
 *   put:
 *     summary: Reject a booking (Admin/Staff only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking rejected
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/{id}/return:
 *   put:
 *     summary: Mark booking as returned
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking marked returned
 *       404:
 *         description: Booking not found
 */

const schema = Joi.object({
  item: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  quantity: Joi.number().min(1).required(),
  notes: Joi.string().allow('').optional()
});

// create booking (student)
router.post('/', auth, async (req,res)=>{
  try{
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const item = await Item.findById(value.item);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (value.quantity > item.quantity) return res.status(400).json({ error: 'Requested quantity exceeds available quantity' });

    const booking = await Booking.create({
      item: item._id,
      user: req.user.id,
      startDate: value.startDate,
      endDate: value.endDate,
      quantity: value.quantity,
      notes: value.notes || ''
    });

    return res.json(booking);
  }catch(err){ console.error('Create booking error', err); res.status(500).json({ error: 'Server error creating booking' }); }
});

// list bookings (student => own, staff/admin => all)
router.get('/', auth, async (req,res)=>{
  try{
    const role = req.user.role;
    const q = {};
    if (role === 'student') q.user = req.user.id;
    const bookings = await Booking.find(q).populate('item').populate('user','name email role').sort({ createdAt: -1 });
    res.json(bookings);
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error listing bookings' }); }
});

// approve (staff/admin) -- prevents overlapping quantity oversubscription
router.put('/:id/approve', auth, roles(['admin','staff']), async (req,res)=>{
  try{
    const booking = await Booking.findById(req.params.id).populate('item');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'requested') return res.status(400).json({ error: 'Only requested bookings can be approved' });

    // check overlapping booked quantity in same interval
    const overlapping = await Booking.find({
      _id: { $ne: booking._id },
      item: booking.item._id,
      status: { $in: ['approved','issued'] },
      $or: [
        { startDate: { $lte: booking.endDate }, endDate: { $gte: booking.startDate } }
      ]
    });

    const reserved = overlapping.reduce((s,b)=> s + (b.quantity||0), 0);
    if (reserved + booking.quantity > booking.item.quantity) {
      return res.status(400).json({ error: 'Not enough quantity available for the requested date range' });
    }

    booking.status = 'approved';
    await booking.save();
    res.json(booking);
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error approving booking' }); }
});

// reject
router.put('/:id/reject', auth, roles(['admin','staff']), async (req,res)=>{
  try{
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = 'rejected';
    await booking.save();
    res.json(booking);
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error rejecting booking' }); }
});
// mark returned (user or staff/admin)
router.put('/:id/return', auth, async (req,res)=>{
  try{
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // allow if admin/staff or booking owner
    if (req.user.role === 'student' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    booking.status = 'returned';
    await booking.save();
    res.json(booking);
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error returning booking' }); }
});

module.exports = router;
