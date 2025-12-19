import HomePage from './HomePage'
import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export default function PublicModePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto pt-6 px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-3 glass rounded-xl px-4 py-3 border border-yellow-200 bg-yellow-50"
        >
          <ShieldAlert className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Демо-режим: результаты не сохраняются, авторизуйтесь для полного доступа.
          </p>
        </motion.div>
      </div>
      <HomePage />
    </div>
  )
}


