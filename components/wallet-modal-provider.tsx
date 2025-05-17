"use client"

import { createContext, useContext, useState, type ReactNode, useMemo } from "react"

type WalletModalContextType = {
  visible: boolean
  setVisible: (visible: boolean) => void
}

const WalletModalContext = createContext<WalletModalContextType>({
  visible: false,
  setVisible: () => {},
})

export const useWalletModal = () => useContext(WalletModalContext)

export const WalletModalProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false)

  const contextValue = useMemo(
    () => ({
      visible,
      setVisible,
    }),
    [visible],
  )

  return <WalletModalContext.Provider value={contextValue}>{children}</WalletModalContext.Provider>
}
