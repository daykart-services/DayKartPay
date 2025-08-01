import React, { useState, useEffect } from 'react'
import { Copy, Users, Gift, TrendingUp, Share2, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface ReferralData {
  referralCode: string
  referredUsers: number
  totalRewards: number
  pendingRewards: number
  referralHistory: ReferralActivity[]
}

interface ReferralActivity {
  id: string
  referredUserEmail: string
  status: 'pending' | 'completed'
  reward: number
  createdAt: string
}

const ReferralSystem: React.FC = () => {
  const { user } = useAuth()
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: '',
    referredUsers: 0,
    totalRewards: 0,
    pendingRewards: 0,
    referralHistory: []
  })
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchReferralData()
    }
  }, [user])

  const generateReferralCode = (userId: string): string => {
    // Generate a unique referral code based on user ID
    const code = `DK${userId.slice(0, 8).toUpperCase()}`
    return code
  }

  const fetchReferralData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Generate referral code
      const referralCode = generateReferralCode(user.id)

      // In a real app, you would fetch this data from your database
      // For demo purposes, we'll use mock data
      const mockReferralHistory: ReferralActivity[] = [
        {
          id: '1',
          referredUserEmail: 'john.doe@example.com',
          status: 'completed',
          reward: 50,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          referredUserEmail: 'jane.smith@example.com',
          status: 'pending',
          reward: 50,
          createdAt: '2024-01-20T14:15:00Z'
        },
        {
          id: '3',
          referredUserEmail: 'mike.wilson@example.com',
          status: 'completed',
          reward: 50,
          createdAt: '2024-01-25T09:45:00Z'
        }
      ]

      const completedRewards = mockReferralHistory
        .filter(item => item.status === 'completed')
        .reduce((sum, item) => sum + item.reward, 0)

      const pendingRewards = mockReferralHistory
        .filter(item => item.status === 'pending')
        .reduce((sum, item) => sum + item.reward, 0)

      setReferralData({
        referralCode,
        referredUsers: mockReferralHistory.length,
        totalRewards: completedRewards,
        pendingRewards,
        referralHistory: mockReferralHistory
      })
    } catch (error) {
      console.error('Error fetching referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy referral code:', error)
    }
  }

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}?ref=${referralData.referralCode}`
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy referral link:', error)
    }
  }

  const shareReferralLink = async () => {
    const referralLink = `${window.location.origin}?ref=${referralData.referralCode}`
    const shareText = `Join DayKart using my referral code ${referralData.referralCode} and get exclusive discounts! ${referralLink}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join DayKart',
          text: shareText,
          url: referralLink
        })
      } catch (error) {
        console.error('Error sharing:', error)
        copyReferralLink()
      }
    } else {
      copyReferralLink()
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Referral Program</h2>
        <p className="text-gray-600">
          Invite friends and earn rewards! Get ₹50 for each successful referral.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Referrals</p>
              <p className="text-3xl font-bold">{referralData.referredUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Rewards</p>
              <p className="text-3xl font-bold">₹{referralData.totalRewards}</p>
            </div>
            <Gift className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pending Rewards</p>
              <p className="text-3xl font-bold">₹{referralData.pendingRewards}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Code</h3>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Referral Code</p>
              <p className="text-2xl font-bold text-gray-900 font-mono">
                {referralData.referralCode}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={copyReferralCode}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          
          <button
            onClick={copyReferralLink}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Copy size={16} />
            <span>Copy Link</span>
          </button>
          
          <button
            onClick={shareReferralLink}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">How it Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold">1</span>
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Share Your Code</h4>
            <p className="text-blue-700 text-sm">
              Share your unique referral code with friends and family
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold">2</span>
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Friend Signs Up</h4>
            <p className="text-blue-700 text-sm">
              Your friend creates an account using your referral code
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold">3</span>
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Earn Rewards</h4>
            <p className="text-blue-700 text-sm">
              Get ₹50 when your friend makes their first purchase
            </p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral History</h3>
        
        {referralData.referralHistory.length > 0 ? (
          <div className="space-y-4">
            {referralData.referralHistory.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.referredUserEmail}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{activity.reward}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h4>
            <p className="text-gray-600">
              Start sharing your referral code to earn rewards!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralSystem