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

/*
{
	"success": true,
	"message": "Relatório da Análise consultado com sucesso",
	"data": {
		"analysis": {
			"id": "cf011517-b6c5-47f1-ac8f-bcce3a96787d",
			"id_usuario": "eb12903c-41c9-4781-8b95-463e77f9f3a1",
			"status": "finalizada",
			"createdAt": "2026-05-22T23:13:41.000Z",
			"updatedAt": "2026-05-22T23:13:47.000Z",
			"deletedAt": null
		},
		"images": [
			{
				"id": "f1139d93-68db-45c4-9a69-3b3a7056d1c8",
				"id_analise": "cf011517-b6c5-47f1-ac8f-bcce3a96787d",
				"nome": "img1.jpg",
				"caminho": "storage/uploads/analysis/2026/5/cf011517-b6c5-47f1-ac8f-bcce3a96787d/eb12903c-41c9-4781-8b95-463e77f9f3a1/81f92182-1780-473c-8998-41c9c64e65f9.webp",
				"coordenadas": null,
				"tipo_mime": "image/jpeg",
				"tamanho": 9653,
				"createdAt": "2026-05-22T23:13:46.000Z",
				"updatedAt": "2026-05-22T23:13:46.000Z",
				"deletedAt": null
			}
		],
		"classification": [
			{
				"id": "41636d53-3e2b-4610-b282-5cb6d465debe",
				"id_analise": "cf011517-b6c5-47f1-ac8f-bcce3a96787d",
				"tempo_execucao": 5146,
				"classe": "true",
				"confianca": 1,
				"modelo_cnn": "simulation",
				"createdAt": "2026-05-22T23:13:47.000Z",
				"updatedAt": "2026-05-22T23:13:47.000Z",
				"deletedAt": null
			}
		]
	}
}


*/