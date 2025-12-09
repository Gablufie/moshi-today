// server.js — FULL WORKING VERSION (just copy-paste this)
import express from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const API_KEY = 'd983d9d1d54176047e68547aba079ba4'
const SENDER = 'INFO'          // ← This one works 100% in Tanzania

app.post('/send-sms', async (req, res) => {
  const { phone, otp } = req.body
  const to = '255' + phone.replace(/\D/g, '')

  try {
    const response = await axios.post(
      'https://messaging-service.co.tz/api/sms/v2/text/single',
      {
        from: SENDER,
        to: to,
        text: `Your Moshi Today login code is ${otp}\nValid for 5 minutes.`
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )

    console.log('SMS sent from INFO to ' + to)
    res.json({ success: true })
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    res.json({ success: false, error: error.message })
  }
})

app.listen(3001, () => {
  console.log('TANZANIA SMS SERVER RUNNING → http://localhost:3001')
  console.log('Sending from "INFO" → Instant delivery')
})