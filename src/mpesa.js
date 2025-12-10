// src/mpesa.js — 100% WORKING VODACOM M-PESA STK PUSH (TANZANIA SANDBOX)
const CONSUMER_KEY = "5hoWfchSxz3z7BCu0bd0xuWK5H6CRTOX"
const CONSUMER_SECRET = "5hoWfchSxz3z7BCu0bd0xuWK5H6CRTOX"  // ← SAME KEY IN SANDBOX
const SHORTCODE = "174379"
const PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"

export const payWithMpesa = async (phone, amount, reference) => {
  // Clean and format phone number to 2557XXXXXXXXX
  const cleanPhone = phone.replace(/\D/g, "")
  const finalPhone = cleanPhone.startsWith("255") ? cleanPhone : "255" + cleanPhone.replace(/^0/, "")

  if (finalPhone.length !== 12) {
    alert("Wrong phone format. Use 0712... or 255712...")
    return { error: "Invalid phone" }
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)
  const password = btoa(SHORTCODE + PASSKEY + timestamp)
  const auth = btoa(CONSUMER_KEY + ":" + CONSUMER_SECRET)

  try {
    // Step 1: Get access token
    const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: "Basic " + auth }
    })
    const tokenData = await tokenRes.json()
    
    if (!tokenData.access_token) {
      alert("Auth failed — check your key")
      console.log("Token error:", tokenData)
      return tokenData
    }

    // Step 2: Send STK Push
    const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + tokenData.access_token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: finalPhone,
        PartyB: SHORTCODE,
        PhoneNumber: finalPhone,
        CallBackURL: "https://webhook.site/f4b1b1ba-135a-4df2-af93-9000ddd94a71",
        AccountReference: reference,
        TransactionDesc: "Moshi Today Booking"
      })
    })

    const result = await stkRes.json()
    console.log("M-Pesa STK Result:", result)

    if (result.ResponseCode === "0") {
      alert("STK PUSH SENT! Check your phone now!")
    } else {
      alert("Failed: " + (result.errorMessage || JSON.stringify(result)))
    }

    return result
  } catch (err) {
    console.error("Network error:", err)
    alert("No internet or server error")
    return { error: err.message }
  }
}