import React, { useState, useRef } from 'react'
import { updateUserData } from '../../utils/userUtils'
import { User } from '../../types/User'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera } from 'lucide-react'

export default function EditAccountPage() {
  const location = useLocation();
  const { userData } = location.state as { userData: User };
  const [nickname, setNickname] = useState<string>(userData.nickname || '')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState(userData.profilePhotoURL || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePhoto(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Update user data in Firestore
      await updateUserData(userData.uid, { nickname })

      // Handle profile photo upload if needed
      if (profilePhoto) {
        // Implement photo upload logic here
        console.log('Profile photo selected:', profilePhoto)
      }

      alert('Account information updated successfully!')
      navigate('/account') // Redirect to account page after successful update
    } catch (error) {
      console.error('Error updating account information:', error)
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">내 정보 수정하기</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <AvatarImage src={previewUrl} alt={nickname} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-4xl flex items-center justify-center">
                  {nickname ? nickname[0].toUpperCase() : <Camera className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                프로필 사진 변경
              </Button>
              <Input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="새로운 닉네임을 입력하세요"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/account')}>
              취소
            </Button>
            <Button type="submit" className="w-full">
              저장하기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}