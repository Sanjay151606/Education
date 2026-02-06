'use client'

export default function JSquadBadge() {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Silver Coin Badge */}
      <div className="relative">
        {/* Outer Glow - Silver/Blue */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-gray-300 to-blue-300 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
        
        {/* Coin Container */}
        <div className="relative w-24 h-24 cursor-pointer transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-180">
          {/* Coin Base - Silver Gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-2xl">
            {/* Inner Ring */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500 shadow-inner">
              {/* Center Circle */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600 flex items-center justify-center">
                {/* J Letter */}
                <div className="text-white font-black text-3xl drop-shadow-2xl" style={{ fontFamily: 'serif', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  J
                </div>
              </div>
            </div>
            
            {/* Coin Edge Details - Top (Highlights) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white rounded-full"></div>
            <div className="absolute top-1 left-1/4 w-1 h-1.5 bg-gray-100 rounded-full"></div>
            <div className="absolute top-1 right-1/4 w-1 h-1.5 bg-gray-100 rounded-full"></div>
            
            {/* Coin Edge Details - Bottom (Shadows) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-700 rounded-full"></div>
            <div className="absolute bottom-1 left-1/4 w-1 h-1.5 bg-gray-600 rounded-full"></div>
            <div className="absolute bottom-1 right-1/4 w-1 h-1.5 bg-gray-600 rounded-full"></div>
            
            {/* Coin Edge Details - Sides */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-gray-100 rounded-full"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-gray-600 rounded-full"></div>
          </div>
          
          {/* Metallic Shine Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-70"></div>
          
          {/* Rotating Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-spin-slow"></div>
          
          {/* Sparkle Effects - Blue/Silver */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-300 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
        </div>
        
        {/* Text Below Coin */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="text-xs font-bold bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 bg-clip-text text-transparent">
            powerhouse
          </div>
        </div>
      </div>
      
      {/* Simple Tooltip Badge */}
      <div className="absolute bottom-full right-0 mb-4 hidden group-hover:block animate-fadeIn">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur-md opacity-40"></div>
          
          {/* Badge */}
          <div className="relative bg-gradient-to-br from-slate-800 to-gray-900 rounded-lg px-4 py-3 shadow-2xl border border-gray-700/50">
            <div className="flex items-center gap-3 whitespace-nowrap">
              {/* Mini Coin */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-black text-sm" style={{ fontFamily: 'serif' }}>J</span>
              </div>
              
              {/* Text */}
              <div>
                <div className="font-bold text-sm bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  powerhouse
                </div>
                <div className="text-xs text-gray-400">Tech Solutions</div>
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-slate-800"></div>
        </div>
      </div>
    </div>
  )
}
