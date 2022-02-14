const ArabicBook = require('../models/arabic-books')
const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
    }
})
const upload = multer({ storage: storage })

// create a new arabic Book
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const image = req.file;
        const body = {
            name: req.body.name,
            author: req.body.author,
            overview: req.body.overview,
            numberOfPages: req.body.numberOfPages,
            price: req.body.price,
            category: req.body.category,
            image: image.path
        }
        const arabicBook = await new ArabicBook(body).save()
        res.send({
            arabicBook
        })
    } catch (error) {
        res.send(error)
    }
})

// get all arabic books
router.get('/', async (req, res) => {
    try {
        const arabicBooks = await ArabicBook.find()
        const reversedBooks = arabicBooks.reverse();
        reversedBooks.forEach((book) => {
            const image = fs.readFileSync(book.image, { encoding: 'base64' })
            book.image = image
        })
        res.send(reversedBooks)
    } catch (error) {
        res.send(error)
    }
})

// get book by id
router.get('/:id', async (req, res) => {
    try {
        const arabicBook = await ArabicBook.find({ _id: req.params.id })
        res.send({ status: 'ok', data: arabicBook })
    } catch (error) {
        res.send({ status: 'error', error })
    }
})


router.put('/:id', upload.none(), async (req, res) => {
    try {
        if (req.body) {
            const prevArabicBook = await ArabicBook.findOneAndUpdate(
                { _id: req.params.id },
                req.body
            )
            const newArabicBook = await ArabicBook.findById(req.params.id)
            if (newArabicBook !== prevArabicBook) {
                res.json({ status: 'ok', data: newArabicBook })
            }
        } else {
            res.status(404).json({ status: 'error', error: 'There is no changes' })
        }
    } catch (error) {
        res.send(error)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        var arabicBook = await ArabicBook.findByIdAndDelete(req.params.id);
        res.json({
            'status': 'ok',
            'data': `${arabicBook.name}'s been deleted successfully.`
        })
    } catch (error) {
        res.send({
            'status': 'error',
            'error': `Failed to delete ${arabicBook.name} book. Try again.`
        })
    }
})
module.exports = router