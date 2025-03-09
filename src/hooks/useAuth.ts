'use client'
 
import { useState, useEffect } from 'react'

interface UserData {
  user: User
  access_token: string
  refresh_token: string
}

interface User {
  _id: string
  name: string
  lastName: string
  workStation: string
  isActive: boolean
  dateOfBirth: string
  email: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    setTimeout(()=>{setLoading(false)},500)
  
  }, [])

  const login = async(userData: UserData) => {
    console.log('userData',userData);
    
    setUser(userData.user)
    localStorage.setItem('user', JSON.stringify(userData.user))
    localStorage.setItem('accessToken', userData.access_token)
    localStorage.setItem('refreshToken', userData.refresh_token)
    window.location.href = "/dashboard"
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = "/login";
  }

  return { user, loading, login, logout }
}