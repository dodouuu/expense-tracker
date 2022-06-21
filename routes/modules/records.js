const express = require('express')
const { populate } = require('../../models/record')
const router = express.Router()
// import Record model
const Record = require('../../models/record')

// two functions for <input type="date" default value = today
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
function getToday() {
  const today = new Date()
  return [
    today.getFullYear(),
    padTo2Digits(today.getMonth() + 1),
    padTo2Digits(today.getDate()),
  ].join('-')
}

// go to views/new.hbs
router.get('/new', (req, res) => {
  const today = getToday()
  return res.render('new', { today })
})

// create New expense
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id
    const user_id = req.user._id
    const recordNumber = await Record.find({ user_id }).countDocuments()
    const id = recordNumber + 1
    const { name, date, category, amount } = req.body
    const categoryId = Number(category)

    await Record.create({ id, name, date, amount, userId, user_id, categoryId })
    res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

// go to detail.hbs of an expense
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    // const user_id = req.user._id
    const record_id = req.params.id
    const record = await Record.findOne({ record_id, userId })
    // console.log('record=', record)
    res.render('detail', { record })
  } catch (error) {
    console.error(error)
  }
})

// go to edit.hbs of an expense
router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user.id
    const record_id = req.params.id
    const record = await Record.findOne({ record_id, userId })
    res.render('edit', { record })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
