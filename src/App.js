import React, { useState } from "react"
// import "./App.css"

function App() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")
  const [number, setNumber] = useState("")
  const [address, setAddress] = useState("")
  
  const handleSend = async (e) => {
    setSent(true)
    try {
      await fetch("http://localhost:5000/send_mail", {
        body: JSON.stringify({
          email: email,
          number: number,
          address: address
        }),
        headers: {"content-type": "application/json"},
        method: "POST"
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      {!sent ? (
        // <form onSubmit={handleSend}>
        <form onSubmit={handleSend}>
          <input type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder="Enter your number" value={number} onChange={(e) => setNumber(e.target.value)} />
          <input type="text" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} />

          <input type="submit" value="Submit Form"/>
        </form>

        // </form>
      ) : (
        <h1>A confirmation email has been sent to the address provided.</h1>
      )}
    </div>
  )
}

export default App