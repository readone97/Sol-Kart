"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useRegistration } from "../registration-context"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SolanaWalletProvider } from "../wallet-provider"

export default function WalletConnectionStep() {
  return (
    <SolanaWalletProvider>
      <WalletConnectionContent />
    </SolanaWalletProvider>
  )
}

function WalletConnectionContent() {
  const { publicKey, connected, connecting } = useWallet()
  const { setCurrentStep, updateRegistrationData } = useRegistration()
  const [error, setError] = useState<string | null>(null)

  // Update registration data when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      updateRegistrationData({ walletAddress: publicKey.toString() })
      setError(null)
    }
  }, [connected, publicKey, updateRegistrationData])

  const handleContinue = () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet to continue")
      return
    }

    setCurrentStep("username")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground text-sm">
          Connect your Solana wallet to get started with your account creation
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-xs flex justify-center">
          {/* Custom styling for the WalletMultiButton */}
          <div className="wallet-adapter-button-container">
            <WalletMultiButton className="wallet-adapter-button" />
          </div>
        </div>

        {connecting && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Connecting to wallet...</span>
          </div>
        )}

        {connected && publicKey && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              Wallet connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </span>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button onClick={handleContinue} className="w-full" disabled={!connected || connecting}>
          Continue
        </Button>
      </div>
    </div>
  )
}

// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { useWallet } from "@solana/wallet-adapter-react"
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
// import { useToast } from "@/hooks/use-toast"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export default function OnboardingPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const { connected } = useWallet()

//   const [currentStep, setCurrentStep] = useState(1)
//   const [username, setUsername] = useState("")
//   const [email, setEmail] = useState("")
//   const [otp, setOtp] = useState("")
//   const [mockOtp, setMockOtp] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   // Auto-advance to step 2 when wallet is connected
//   useEffect(() => {
//     if (connected && currentStep === 1) {
//       toast({
//         title: "Wallet connected!",
//         description: "Your wallet has been successfully connected.",
//       })
//     }
//   }, [connected, currentStep, toast])

//   const handleContinue = async () => {
//     setIsLoading(true)

//     try {
//       if (currentStep === 1) {
//         if (!connected) {
//           toast({
//             title: "Wallet not connected",
//             description: "Please connect your wallet to continue.",
//             variant: "destructive",
//           })
//           setIsLoading(false)
//           return
//         }
//         setCurrentStep(2)
//       } else if (currentStep === 2) {
//         if (username.length < 3) {
//           toast({
//             title: "Invalid username",
//             description: "Username must be at least 3 characters long.",
//             variant: "destructive",
//           })
//           setIsLoading(false)
//           return
//         }
//         setCurrentStep(3)
//       } else if (currentStep === 3) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//         if (!emailRegex.test(email)) {
//           toast({
//             title: "Invalid email",
//             description: "Please enter a valid email address.",
//             variant: "destructive",
//           })
//           setIsLoading(false)
//           return
//         }

//         // Generate a mock OTP (in a real app, this would be sent to the user's email)
//         const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
//         setMockOtp(generatedOtp)

//         toast({
//           title: "OTP sent!",
//           description: `Your OTP is: ${generatedOtp}`,
//         })

//         setCurrentStep(4)
//       } else if (currentStep === 4) {
//         if (otp.length !== 6 || !/^\d+$/.test(otp)) {
//           toast({
//             title: "Invalid OTP",
//             description: "OTP must be 6 digits.",
//             variant: "destructive",
//           })
//           setIsLoading(false)
//           return
//         }

//         if (otp !== mockOtp) {
//           toast({
//             title: "Incorrect OTP",
//             description: "The OTP you entered is incorrect.",
//             variant: "destructive",
//           })
//           setIsLoading(false)
//           return
//         }

//         toast({
//           title: "Success!",
//           description: "Your account has been created successfully.",
//         })

//         // Redirect to dashboard
//         router.push("/dashboard")
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-black p-4">
//       <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 bg-black p-6 shadow-lg">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-300">
//             {currentStep === 1 && "Connect Your Wallet"}
//             {currentStep === 2 && "Create Username"}
//             {currentStep === 3 && "Enter Your Email"}
//             {currentStep === 4 && "Verify OTP"}
//           </h1>
//           <p className="mt-2 text-gray-400">Step {currentStep} of 4</p>

//           {/* Progress bar */}
//           <div className="mt-4 h-2 w-full rounded-full bg-gray-800">
//             <div
//               className="h-2 rounded-full bg-green-500 transition-all duration-300 ease-in-out"
//               style={{ width: `${(currentStep / 4) * 100}%` }}
//             />
//           </div>
//         </div>

//         <div className="mt-8 space-y-6">
//           {/* Step 1: Connect Wallet */}
//           {currentStep === 1 && (
//             <div className="flex flex-col items-center space-y-6">
//               <div className="flex w-full justify-center">
//                 <WalletMultiButton className="!bg-green-500 !hover:bg-green-600" />
//               </div>
//               <p className="text-center text-sm text-gray-400">
//                 Connect your Solana wallet to continue. We support Phantom, Solflare, and other Solana wallets.
//               </p>
//             </div>
//           )}

//           {/* Step 2: Create Username */}
//           {currentStep === 2 && (
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="username" className="text-gray-300">
//                   Username
//                 </Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="Enter a username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="border-gray-700 bg-gray-900 text-gray-300 focus:border-green-500 focus:ring-green-500"
//                 />
//                 <p className="text-xs text-gray-400">Username must be at least 3 characters long.</p>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Enter Email */}
//           {currentStep === 3 && (
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-gray-300">
//                   Email Address
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="border-gray-700 bg-gray-900 text-gray-300 focus:border-green-500 focus:ring-green-500"
//                 />
//                 <p className="text-xs text-gray-400">We'll send a verification code to this email.</p>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Verify OTP */}
//           {currentStep === 4 && (
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="otp" className="text-gray-300">
//                   Verification Code
//                 </Label>
//                 <Input
//                   id="otp"
//                   type="text"
//                   placeholder="Enter 6-digit code"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   maxLength={6}
//                   className="border-gray-700 bg-gray-900 text-gray-300 focus:border-green-500 focus:ring-green-500"
//                 />
//                 <p className="text-xs text-gray-400">Enter the 6-digit code sent to your email.</p>
//               </div>
//             </div>
//           )}

//           {/* Navigation buttons */}
//           <div className="flex justify-between pt-4">
//             {currentStep > 1 && (
//               <Button
//                 variant="outline"
//                 onClick={() => setCurrentStep(currentStep - 1)}
//                 className="border-gray-700 text-gray-300 hover:bg-gray-800"
//               >
//                 Back
//               </Button>
//             )}

//             <div className={currentStep === 1 ? "w-full" : ""}>
//               <Button
//                 onClick={handleContinue}
//                 disabled={isLoading || (currentStep === 1 && !connected)}
//                 className={`${currentStep === 1 ? "w-full" : ""} bg-green-500 text-white hover:bg-green-600`}
//               >
//                 {isLoading ? "Loading..." : currentStep === 4 ? "Complete" : "Continue"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

