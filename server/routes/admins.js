const Admin = require('../models/admins')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { db } = require('../models/admins')
const router = express.Router()

const haram_encrypt = 'jlasdfkljkljfpi23*##(I)IRPOJjphsldhlcohasdihflwhlvn'


// create a new arabic Book
router.post('/create', async (req, res) => {
    const user = req.body
    const username = user.username;

    if (!username || typeof username !== 'string') {
        return res.send({ status: 'error', error: 'Invalid Username' })
    }

    if (!user.password || typeof user.password !== 'string') {
        return res.send({ status: 'error', error: 'Invalid Password' })
    }

    if (user.password.length < 6) {
        return res.send({ status: 'error', error: 'Password should be at least 7 characters' })
    }

    const password_hashed = await bcrypt.hash(user.password, 10);

    try {
        const admin = await Admin.create({
            "username": username,
            "password": password_hashed
        })

        res.send({
            status: 'ok',
            data: admin
        })

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            // dublicate key
            return res.send({ status: 'error', error: 'this username is already exists.' })
        } else {
            return res.send(error)
        }
    }

})


router.post('/login', async (req, res) => {
    const user = req.body
    const username = user.username;

    if (!username || typeof username !== 'string') {
        return res.send({ status: 'error', error: 'Invalid Username' })
    }

    if (!user.password || typeof user.password !== 'string') {
        return res.send({ status: 'error', error: 'Invalid Password' })
    }

    const db_user = await Admin.findOne({ username }).lean()

    if (!db_user) {
        return res.send({ status: 'error', error: 'Invalid username or password' })
    }

    if (await bcrypt.compare(user.password, db_user.password)) {

        const token = jwt.sign({
            id: db_user._id,
            username: db_user.username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // one hour expiration
        }, haram_encrypt)

        return res.send({
            status: 'ok',
            data: token
        })
    } else {
        res.send({
            status: 'error',
            error: 'Invalid username or password'
        })
    }

})

module.exports = router