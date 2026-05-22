import React, { createContext } from "react"

const Cor = createContext('')

export function ProcessProvider({children} : {children: React.ReactNode}) {
  return (
    <Cor.Provider value="red">
      {children}
    </Cor.Provider>
  )
}