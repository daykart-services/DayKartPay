import React, { useState } from 'react'
import { Play, X } from 'lucide-react'

const VideoSection: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How to Shop on DayKart
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch our quick tutorial to learn how to browse, select, and purchase products on DayKart
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showVideo ? (
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden cursor-pointer group shadow-xl"
                   onClick={() => setShowVideo(true)}>
                <img
                  src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="DayKart Shopping Tutorial"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <div className="bg-white bg-opacity-90 rounded-full p-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-12 h-12 text-gray-900 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Complete Shopping Guide
                </h3>
                <p className="text-gray-600">
                  Learn how to browse products, add to cart, and complete your purchase
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="DayKart Shopping Tutorial"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default VideoSection