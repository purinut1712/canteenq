const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// GET all
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: 'Error fetching menus', error: error.message });
  }
});

// POST new (เพิ่ม Logging และ Error Handling)
router.post('/', async (req, res) => {
  console.log('--- Menu POST request received ---');
  console.log('Body data:', req.body); // ตรวจสอบข้อมูลที่ได้รับ

  try {
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
      console.error('Validation failed: Missing name, price, or image.');
      return res.status(400).json({ message: 'Missing required fields: name, price, or image' });
    }

    const menu = new Menu({ name, price, image });
    await menu.save();
    console.log('Menu saved successfully:', menu);
    res.json(menu);

  } catch (error) {
    // นี่คือ Log ที่จะแสดงปัญหาการเชื่อมต่อ/บันทึกเข้า MongoDB
    console.error('Menu save FAILED (Database/Schema Error):', error);
    res.status(500).json({ message: 'Error saving menu to database', error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: 'Error deleting menu', error: error.message });
  }
});

module.exports = router;