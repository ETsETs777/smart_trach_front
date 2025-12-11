import { create } from 'zustand'

interface WasteStore {
  currentWastePhotoId: string | null
  setCurrentWastePhotoId: (id: string | null) => void
  companyId: string | null
  setCompanyId: (id: string | null) => void
  collectionAreaId: string | null
  setCollectionAreaId: (id: string | null) => void
}

const defaultCompanyId = import.meta.env.VITE_DEFAULT_COMPANY_ID || null
const defaultCollectionAreaId = import.meta.env.VITE_DEFAULT_COLLECTION_AREA_ID || null

export const useWasteStore = create<WasteStore>((set) => ({
  currentWastePhotoId: null,
  setCurrentWastePhotoId: (id) => set({ currentWastePhotoId: id }),
  companyId: defaultCompanyId,
  setCompanyId: (id) => set({ companyId: id }),
  collectionAreaId: defaultCollectionAreaId,
  setCollectionAreaId: (id) => set({ collectionAreaId: id }),
}))

