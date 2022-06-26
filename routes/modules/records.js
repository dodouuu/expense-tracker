const express = require('express')
const { populate } = require('../../models/record')
const router = express.Router()
// import Record model
const Record = require('../../models/record')
const moment = require('moment')
const User = require('../../models/user')

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

// Create a New expense
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id
    const user_id = req.user._id

    const { name, date, categoryId, amount } = req.body
    const formattedDate = moment(date).format('YYYY/MM/DD')

    // find maxId of Record and let new id = maxId + 1
    const maxRecord = await Record.find({ userId }).sort({ id: -1 }).limit(1)
    id = Number(maxRecord.map(u => u.id)) + 1

    await Record.create({ id, name, date, formattedDate, amount, userId, user_id, categoryId })

    // update categoryAmount and totalAmount
    const user = await User.findOne({ id: userId })
    user.categoryAmount[categoryId - 1] += Number(amount)
    user.totalAmount += Number(amount)
    await user.save()

    return res.redirect('/')
  } catch (error) {
    return console.error(error)
  }
})

// go to detail.hbs of an expense
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const record_id = req.params.id
    const record = await Record.findOne({ _id: record_id, userId }).lean()
    return res.render('detail', { record })
  } catch (error) {
    return console.error(error)
  }
})

// go to edit.hbs of an expense
router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user.id
    const record_id = req.params.id
    const record = await Record.findOne({ _id: record_id, userId }).lean()
    const recordDate = moment(record.date).format('YYYY-MM-DD')
    return res.render('edit', { record, recordDate })
  } catch (error) {
    return console.error(error)
  }
})

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const record_id = req.params.id
    const filter = { _id: record_id, userId }
    const newRecord = { ...req.body }
    newRecord.formattedDate = moment(req.body.date).format('YYYY/MM/DD')

    // update totalAmount and categoryAmount of User model
    const oldRecord = await Record.findOne(filter)
    // if dont use Number(), error will occur when update negative number
    const diffAmount = Number(newRecord.amount) - oldRecord.amount

    // sometimes, user just change categoryId but not amount
    const oldCatId = oldRecord.categoryId
    const newCatId = newRecord.categoryId
    const user = await User.findOne({ id: userId })
    if (oldCatId !== newCatId) {
      user.categoryAmount[oldCatId - 1] -= oldRecord.amount
      user.categoryAmount[newCatId - 1] += Number(newRecord.amount)
      await user.save()
    }
    if (diffAmount !== 0) {
      user.totalAmount += diffAmount
      if (oldCatId === newCatId) {
        user.categoryAmount[newCatId - 1] += diffAmount
      }
      await user.save()
    }

    await Record.findOneAndUpdate(filter, newRecord, { new: true })
    return res.redirect('/')
  } catch (error) {
    return console.error(error)
  }
})

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const record_id = req.params.id
    const filter = { _id: record_id, userId }

    // update totalAmount and categoryAmount of User model
    const oldRecord = await Record.findOne(filter)
    const oldCatId = oldRecord.categoryId
    const oldAmount = oldRecord.amount
    const user = await User.findOne({ id: userId })
    user.categoryAmount[oldCatId - 1] -= oldAmount
    user.totalAmount -= oldAmount
    await user.save()
    await Record.findOneAndDelete(filter)

    return res.redirect('/')
  } catch (error) {
    return console.error(error)
  }
})

module.exports = router
