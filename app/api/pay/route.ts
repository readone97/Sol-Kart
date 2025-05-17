import { type NextRequest, NextResponse } from "next/server"
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import { encodeURL, findReference, validateTransfer } from "@solana/pay"
import BigNumber from "bignumber.js"

// In-memory storage for payment requests (note: this will reset on server restart)
// In a production app, you would use a database
const paymentRequests = new Map<string, { recipient: PublicKey; amount: BigNumber; memo: string }>()

// Constants
const quicknodeEndpoint =
  "https://serene-wispy-model.solana-mainnet.quiknode.pro/2ebdf944147ac60d02e7030145216e4e1681dd2c/"
const myWallet = "96gcyxCyPyTm7PsbE48dzHnPbRrA4xWk8QVCTiUS9ec5" // Replace with your wallet address
const recipient = new PublicKey(myWallet)
const label = "SolKart Store"
const memo = "SolKart Payment Demo"

// Generate Solana Pay URL
async function generateUrl(
  recipient: PublicKey,
  amount: BigNumber,
  reference: PublicKey,
  label: string,
  message: string,
  memo: string,
) {
  const url: URL = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
    memo,
  })
  return { url }
}

// Verify transaction on the blockchain
async function verifyTransaction(reference: PublicKey) {
  // Check that the payment request exists
  const paymentData = paymentRequests.get(reference.toBase58())
  if (!paymentData) {
    throw new Error("Payment request not found")
  }

  const { recipient, amount, memo } = paymentData

  // Establish a Connection to the Solana Cluster
  const connection = new Connection(quicknodeEndpoint, "confirmed")
  console.log("recipient", recipient.toBase58())
  console.log("amount", amount.toString())
  console.log("reference", reference.toBase58())
  console.log("memo", memo)

  try {
    // Find the transaction reference
    const found = await findReference(connection, reference)
    console.log("Transaction found:", found.signature)

    // Validate the transaction
    const response = await validateTransfer(
      connection,
      found.signature,
      {
        recipient,
        amount,
        splToken: undefined,
        reference,
      },
      { commitment: "confirmed" },
    )

    // Delete the payment request from memory if verified
    if (response) {
      paymentRequests.delete(reference.toBase58())
    }

    return response
  } catch (error) {
    console.error("Verification error:", error)
    return false
  }
}

// POST handler - Generate payment request
export async function POST(request: NextRequest) {
  try {
    // Generate a new keypair for the reference
    const reference = new Keypair().publicKey

    // Create a random order ID for the message
    const message = `SolKart Payment - Order ID #0${Math.floor(Math.random() * 999999) + 1}`

    // Fixed amount for demo purposes - in a real app, you would get this from the request
    const amount = new BigNumber(0.0001) // 0.0001 SOL

    // Generate the Solana Pay URL
    const urlData = await generateUrl(recipient, amount, reference, label, message, memo)

    // Store the payment request in memory
    const ref = reference.toBase58()
    paymentRequests.set(ref, { recipient, amount, memo })

    // Return the URL and reference
    return NextResponse.json({
      url: urlData.url.toString(),
      ref,
    })
  } catch (error) {
    console.error("Error generating payment:", error)
    return NextResponse.json({ error: "Failed to generate payment" }, { status: 500 })
  }
}

// GET handler - Verify payment
export async function GET(request: NextRequest) {
  // Get the reference from the URL
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get("reference")

  if (!reference) {
    return NextResponse.json({ error: "Missing reference parameter" }, { status: 400 })
  }

  try {
    // Convert the reference string to a PublicKey
    const referencePublicKey = new PublicKey(reference)

    // Verify the transaction
    const response = await verifyTransaction(referencePublicKey)

    if (response) {
      return NextResponse.json({ status: "verified" })
    } else {
      return NextResponse.json({ status: "not found" })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
