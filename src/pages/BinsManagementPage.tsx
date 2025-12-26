import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  GET_COLLECTION_AREAS,
  GET_COLLECTION_AREA_BINS,
} from '@/lib/graphql/queries'
import {
  ADD_BINS_TO_COLLECTION_AREA,
  DELETE_COLLECTION_AREA_BIN,
  UPDATE_COLLECTION_AREA_BIN,
} from '@/lib/graphql/mutations'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import MapWithMarkers from '@/components/MapWithMarkers'
import { useWasteStore } from '@/store/useWasteStore'
import { TrashBinType, BIN_CONFIGS } from '@/types'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Plus, Trash2, MapPin, Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logger from '@/lib/logger'

interface AddBinsFormData {
  types: TrashBinType[]
}

interface MapMarker {
  id: string
  position: [number, number]
  type: TrashBinType
  label?: string
}

export default function BinsManagementPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { companyId } = useWasteStore()
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [selectedBinTypeForMap, setSelectedBinTypeForMap] = useState<TrashBinType | null>(null)
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([])
  const [showMap, setShowMap] = useState(false)

  const { data: areasData, loading: areasLoading } = useQuery(GET_COLLECTION_AREAS, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const { data: binsData, loading: binsLoading, refetch: refetchBins } = useQuery(
    GET_COLLECTION_AREA_BINS,
    {
      variables: { areaId: selectedAreaId },
      skip: !selectedAreaId,
    },
  )

  const [addBins, { loading: adding }] = useMutation(ADD_BINS_TO_COLLECTION_AREA, {
    onCompleted: () => {
      toast.success(t('admin.bins.containersAdded'))
      refetchBins()
      reset()
    },
    onError: (error) => toast.error(error.message || t('admin.bins.errorAdding')),
  })

  const [deleteBin] = useMutation(DELETE_COLLECTION_AREA_BIN, {
    onCompleted: () => {
      toast.success(t('admin.bins.containerDeleted'))
      refetchBins()
    },
    onError: (error) => toast.error(error.message || t('admin.bins.errorDeleting')),
  })

  const [updateBin, { loading: updatingBin }] = useMutation(UPDATE_COLLECTION_AREA_BIN, {
    onCompleted: () => {
      toast.success(t('admin.bins.containerUpdated'))
      refetchBins()
    },
    onError: (error) => toast.error(error.message || t('admin.bins.errorUpdating')),
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddBinsFormData>({
    defaultValues: {
      types: [],
    },
  })

  const selectedTypes = watch('types') || []

  const toggleType = (type: TrashBinType) => {
    const current = selectedTypes
    if (current.includes(type)) {
      setValue(
        'types',
        current.filter((t) => t !== type),
      )
    } else {
      setValue('types', [...current, type])
    }
  }

  const onSubmit = async (data: AddBinsFormData) => {
    if (!selectedAreaId) {
      toast.error('Выберите область сбора')
      return
    }
    if (data.types.length === 0) {
      toast.error(t('admin.bins.selectBinTypeError'))
      return
    }
    await addBins({
      variables: {
        input: {
          areaId: selectedAreaId,
          types: data.types,
        },
      },
    })
  }

  const areas = useMemo(() => areasData?.collectionAreas || [], [areasData])
  const bins = useMemo(() => binsData?.collectionAreaBins || [], [binsData])

  // Convert bins to map markers (only if they have coordinates)
  const binMarkers = useMemo(() => {
    return bins
      .filter((bin: any) => bin.latitude != null && bin.longitude != null)
      .map((bin: any) => {
        // TypeORM returns decimal as string, so we need to parse it
        const lat = typeof bin.latitude === 'string' ? parseFloat(bin.latitude) : bin.latitude
        const lng = typeof bin.longitude === 'string' ? parseFloat(bin.longitude) : bin.longitude
        return {
          id: bin.id,
          position: [lat, lng] as [number, number],
          type: bin.type,
          label: BIN_CONFIGS[bin.type].label,
        }
      })
  }, [bins])

  // Handle marker addition from map
  const handleMarkerAdd = async (position: [number, number], type: TrashBinType) => {
    const newMarker: MapMarker = {
      id: `temp-${Date.now()}-${Math.random()}`,
      position,
      type,
      label: BIN_CONFIGS[type].label,
    }
    setMapMarkers([...mapMarkers, newMarker])
    
    // Automatically add bin to area with coordinates
    if (selectedAreaId) {
      try {
        await addBins({
          variables: {
            input: {
              areaId: selectedAreaId,
              binsWithCoordinates: [
                {
                  type,
                  coordinates: {
                    latitude: position[0],
                    longitude: position[1],
                  },
                },
              ],
            },
          },
        })
        toast.success(`Container ${BIN_CONFIGS[type].label} added at location`)
        // Remove temp marker after successful addition
        setMapMarkers(mapMarkers.filter((m) => m.id !== newMarker.id))
      } catch (error: any) {
        // Remove marker if adding failed
        setMapMarkers(mapMarkers.filter((m) => m.id !== newMarker.id))
        toast.error(error.message || 'Error adding container')
        logger.error('Error adding bin', error instanceof Error ? error : new Error(String(error)), 'BinsManagementPage')
      }
    }
  }

  // Handle marker removal
  const handleMarkerRemove = (id: string) => {
    setMapMarkers(mapMarkers.filter((m) => m.id !== id))
    
    // If it's a real bin (not temp), delete it
    const bin = bins.find((b: any) => b.id === id)
    if (bin) {
      deleteBin({
        variables: { id },
      })
    }
  }

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button onClick={() => navigate('/admin/dashboard')} variant="ghost" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('common.back')}
            </Button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-4">
              {t('admin.bins.title')}
            </h1>
            <p className="text-gray-600 mt-2">{t('admin.bins.subtitle')}</p>
          </div>
        </div>

        {/* Select area */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('admin.bins.selectArea')}</h2>
          {areasLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <SkeletonLoader key={i} variant="rectangular" height="60px" className="bg-gray-100 dark:bg-gray-800 rounded-lg" />
              ))}
            </div>
          ) : areas.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <MapPin className="w-5 h-5" />
              {t('admin.bins.createAreaFirst')}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {areas.map((area: any) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${
                    selectedAreaId === area.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-100'
                  }`}
                >
                  {area.name}
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Map Toggle */}
        {selectedAreaId && (
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{t('admin.bins.containerMap')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('admin.bins.containerMapDesc')}
                </p>
              </div>
              <Button
                onClick={() => setShowMap(!showMap)}
                variant={showMap ? "outline" : "primary"}
                size="lg"
              >
                <Map className="w-4 h-4 mr-2" />
                {showMap ? t('admin.bins.hideMap') : t('admin.bins.showMap')}
              </Button>
            </div>
          </Card>
        )}

        {/* Map */}
        {selectedAreaId && showMap && (
          <Card className="p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('admin.bins.selectContainerTypeForMap')}</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.values(TrashBinType).map((type) => {
                  const config = BIN_CONFIGS[type]
                  const isSelected = selectedBinTypeForMap === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedBinTypeForMap(isSelected ? null : type)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 shadow-md scale-105'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl">{config.icon}</div>
                      <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mt-1">{config.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            <MapWithMarkers
              markers={[...binMarkers, ...mapMarkers]}
              onMarkerAdd={handleMarkerAdd}
              onMarkerRemove={handleMarkerRemove}
              selectedBinType={selectedBinTypeForMap}
              editable={true}
              height="600px"
            />
          </Card>
        )}

        {/* Bins list and add form */}
        {selectedAreaId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('admin.bins.addContainers')}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(TrashBinType).map((type) => {
                    const config = BIN_CONFIGS[type]
                    const selected = selectedTypes.includes(type)
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          selected
                            ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl">{config.icon}</div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1">{config.label}</div>
                      </button>
                    )
                  })}
                </div>
                {errors.types && (
                  <p className="text-sm text-red-600">{t('admin.bins.selectAtLeastOne')}</p>
                )}
                <Button type="submit" variant="primary" size="lg" isLoading={adding}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.bins.add')}
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('admin.bins.areaContainers')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.bins.changeTypeOrDelete')}</p>
                </div>
              </div>

              {binsLoading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
              ) : bins.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-6">{t('admin.bins.noContainers')}</div>
              ) : (
                <div className="space-y-3">
                  {bins.map((bin: any, index: number) => {
                    const config = BIN_CONFIGS[bin.type]
                    return (
                      <motion.div
                        key={bin.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{config.icon}</div>
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100">{config.label}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{bin.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={bin.type}
                            onChange={(e) =>
                              updateBin({
                                variables: {
                                  input: {
                                    id: bin.id,
                                    type: e.target.value,
                                  },
                                },
                              })
                            }
                            className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                            disabled={updatingBin}
                          >
                            {Object.values(TrashBinType).map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              deleteBin({
                                variables: { id: bin.id },
                              })
                            }
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

