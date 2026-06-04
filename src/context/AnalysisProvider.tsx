"use client"

import React, { createContext, } from "react"
import { useState, useEffect, } from "react"
import { AnalysisDetails, } from "@/services/AnalysisDetails"

export const Analysis = createContext({
	setIdAnalysis: (id: string) => { },
	dataAnalysis: {},
})


export function AnalysisProvider({ children }: { children: React.ReactNode }) {
	const [idAnalysis, setIdAnalysis] = useState("")
	const [dataAnalysis, setDataAnalysis] = useState({})
	const [isCompleted, setIsCompleted] = useState(true)

	const GetAnalysis = async () => {
		if (idAnalysis === "") return

		const response = await AnalysisDetails(idAnalysis)

		if(response.success) {
			setDataAnalysis(response.data)
		}
	}

	useEffect(() => {
		GetAnalysis()

	}, [idAnalysis])

	return (
		<Analysis.Provider value={{
			setIdAnalysis: (id: string) => setIdAnalysis(id),
			dataAnalysis: dataAnalysis,
		}}>
			{children}
		</Analysis.Provider>
	)
}
