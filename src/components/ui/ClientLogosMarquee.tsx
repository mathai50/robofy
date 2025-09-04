'use client'

import React from 'react'
import { Marquee } from '@/components/ui/Marquee'
import { clients } from '@/data/clients'
import {
  Heart,
  Activity,
  ShoppingBag,
  Sun,
  HeartPulse,
  Cpu,
  Leaf,
  Building,
  Cross,
  Dumbbell,
  ShoppingCart,
  Battery,
  Sparkles,
  Shield,
  Smartphone
} from 'lucide-react'

const iconComponents = {
  Heart,
  Activity,
  ShoppingBag,
  Sun,
  HeartPulse,
  Cpu,
  Leaf,
  Building,
  Cross,
  Dumbbell,
  ShoppingCart,
  Battery,
  Sparkles,
  Shield,
  Smartphone
}

const iconColors = [
  'text-blue-400',
  'text-purple-400',
  'text-green-400',
  'text-pink-400',
  'text-yellow-400',
  'text-cyan-400',
  'text-orange-400',
  'text-red-400',
  'text-indigo-400',
  'text-teal-400',
  'text-lime-400',
  'text-amber-400',
  'text-emerald-400',
  'text-violet-400',
  'text-fuchsia-400',
  'text-rose-400'
]

export function ClientLogosMarquee() {
  return (
    <div className="w-full py-8">
      <Marquee speed={40} pauseOnHover={true} className="py-6" gap={32}>
        {clients.map((client, index) => {
          const IconComponent = iconComponents[client.icon as keyof typeof iconComponents]
          const colorClass = iconColors[index % iconColors.length]
          
          return (
            <div
              key={client.id}
              className="flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-blue-400/20 hover:border-blue-400/60 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 grayscale group-hover:grayscale-0">
                  {IconComponent && (
                    <IconComponent
                      size={32}
                      className={`${colorClass} transition-all duration-300`}
                    />
                  )}
                </div>
              <span className="ml-3 text-white font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {client.name}
              </span>
            </div>
          )
        })}
      </Marquee>
    </div>
  )
}