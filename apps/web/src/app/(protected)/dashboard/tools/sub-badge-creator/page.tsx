'use client'

import { useCallback, useState } from 'react'

import * as imgly from '@imgly/background-removal'
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BadgeSize {
  size: number
  url: string | null
}

const BADGE_SIZES = [18, 36, 72]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeBackground = (imgly as any).removeBackground

export default function SubBadgeCreatorPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [badges, setBadges] = useState<BadgeSize[]>(
    BADGE_SIZES.map((size) => ({ size, url: null }))
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [scale, setScale] = useState(100)

  const resizeImage = useCallback(
    async (src: string, size: number, scalePercent: number): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            const scaleFactor = scalePercent / 100
            const imgAspect = img.width / img.height
            let drawWidth: number
            let drawHeight: number
            let offsetX = 0
            let offsetY = 0

            if (imgAspect > 1) {
              drawHeight = (size / imgAspect) * scaleFactor
              drawWidth = size * scaleFactor
              offsetY = (size - drawHeight) / 2
            } else {
              drawWidth = (size * imgAspect) * scaleFactor
              drawHeight = size * scaleFactor
              offsetX = (size - drawWidth) / 2
            }

            const isDownscaling = drawWidth < img.width || drawHeight < img.height
            if (isDownscaling) {
              const tempCanvas = document.createElement('canvas')
              const maxStep = Math.max(img.width, img.height)
              tempCanvas.width = maxStep
              tempCanvas.height = maxStep
              const tempCtx = tempCanvas.getContext('2d')
              if (tempCtx) {
                tempCtx.imageSmoothingEnabled = true
                tempCtx.imageSmoothingQuality = 'high'
                tempCtx.drawImage(img, 0, 0, maxStep, maxStep)
                ctx.clearRect(0, 0, size, size)
                ctx.drawImage(tempCanvas, 0, 0, maxStep, maxStep, offsetX, offsetY, drawWidth, drawHeight)
                resolve(canvas.toDataURL('image/png'))
                return
              }
            }

            ctx.clearRect(0, 0, size, size)
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
          }
          resolve(canvas.toDataURL('image/png'))
        }
        img.src = src
      })
    },
    []
  )

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string)
        setProcessedImage(null)
        setBadges(BADGE_SIZES.map((size) => ({ size, url: null })))
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const handleRemoveBackground = useCallback(async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      const blob = await removeBackground(originalImage, {
        progress: (key: string, current: number, total: number) => {
          console.log(`Downloading model: ${key} ${current}/${total}`)
        },
      })

      const url = URL.createObjectURL(blob)
      setProcessedImage(url)

      const resizedBadges = await Promise.all(
        BADGE_SIZES.map(async (size) => ({
          size,
          url: await resizeImage(url, size, scale),
        }))
      )
      setBadges(resizedBadges)
      toast.success('Background removed successfully!')
    } catch (error) {
      console.error('Error removing background:', error)
      toast.error('Failed to remove background')
    } finally {
      setIsProcessing(false)
    }
  }, [originalImage, resizeImage, scale])

  const handleDownload = useCallback((url: string | null, size: number) => {
    if (!url) return

    const link = document.createElement('a')
    link.href = url
    link.download = `badge-${size}x${size}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleDownloadAll = useCallback(() => {
    badges.forEach((badge) => {
      if (badge.url) {
        handleDownload(badge.url, badge.size)
      }
    })
    toast.success('All badges downloaded!')
  }, [badges, handleDownload])

  const handleReset = useCallback(() => {
    setOriginalImage(null)
    setProcessedImage(null)
    setBadges(BADGE_SIZES.map((size) => ({ size, url: null })))
  }, [])

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">
          Twitch Sub Badge Creator
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload an image to create Twitch subscription badges in 18x18, 36x36,
          and 72x72 sizes with transparent backgrounds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="image-upload"
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="size-10 animate-spin text-muted-foreground" />
                ) : originalImage ? (
                  <Upload className="size-10 text-muted-foreground" />
                ) : (
                  <UploadIcon className="size-10 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {originalImage
                    ? 'Click to change image'
                    : 'Click to upload an image'}
                </span>
              </label>
            </div>

            {originalImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Original Image</p>
                <div className="flex justify-center rounded-lg border bg-muted/50 p-4">
                  <img
                    alt="Original"
                    className="max-h-48 object-contain"
                    src={originalImage}
                  />
                </div>
              </div>
            )}

            {originalImage && !processedImage && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Image Scale</p>
                  <span className="text-sm text-muted-foreground">{scale}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust how much of the badge area the image fills
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {originalImage && !processedImage && (
                <Button
                  className="flex-1"
                  disabled={isProcessing}
                  onClick={handleRemoveBackground}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Remove Background'
                  )}
                </Button>
              )}
              {processedImage && (
                <Button className="flex-1" variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
              )}
            </div>

            {processedImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Background Removed</p>
                <div className="flex justify-center rounded-lg border bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-contain p-4">
                  <img
                    alt="Processed"
                    className="max-h-48 object-contain"
                    src={processedImage}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Badges</CardTitle>
            {badges.some((b) => b.url) && (
              <Button size="sm" onClick={handleDownloadAll}>
                <DownloadIcon className="mr-2 size-4" />
                Download All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {badges.some((b) => b.url) ? (
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.size}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex size-20 items-center justify-center rounded-lg border bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-contain p-1">
                      {badge.url && (
                        <img
                          alt={`${badge.size}x${badge.size} badge`}
                          className="size-full object-contain"
                          src={badge.url}
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {badge.size}x{badge.size}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => badge.url && handleDownload(badge.url, badge.size)}
                    >
                      <DownloadIcon className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                Upload an image and remove the background to generate badges
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
