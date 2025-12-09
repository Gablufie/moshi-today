// src/pages/GuideLogin.jsx — FINAL, NO BLANK PAGE
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'

function GuideLogin() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {}
    })
  }, [])

  const sendOTP = async (e) => {
    e.preventDefault()
    const phoneNumber = '+255' + phone.replace(/\D/g, '')

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
      setConfirmationResult(confirmation)
      setShowOtp(true)
      alert('OTP sent! Check your phone.')
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const verifyOTP = async (e) => {
    e.preventDefault()
    try {
      await confirmationResult.confirm(otp)
      navigate('/guide/dashboard')
    } catch (err) {
      alert('Wrong OTP')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-6xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          MOSHI TODAY
        </h1>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl">
          {!showOtp ? (
            <form onSubmit={sendOTP} className="space-y-6">
              <div className="flex">
                <span className="px-4 py-4 bg-white/10 rounded-l-2xl border border-r-0">+255</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="747 914 720"
                  className="w-full px-4 py-4 bg-white/10 rounded-r-2xl border border-white/20 focus:border-purple-500 transition"
                  required
                />
              </div>
              <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-black text-xl hover:scale-105 transition shadow-xl">
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="space-y-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center text-4xl py-6 bg-white/10 rounded-2xl border border-white/20"
                maxLength={6}
                required
              />
              <button type="submit" className="w-full py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black rounded-2xl font-black text-xl hover:scale-105 transition shadow-xl">
                Verify & Login
              </button>
            </form>
          )}
        </div>

        {/* THIS LINE FIXES THE BLANK PAGE */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  )
}

export default GuideLogin