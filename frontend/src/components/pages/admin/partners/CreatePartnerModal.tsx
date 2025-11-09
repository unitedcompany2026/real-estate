import { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'

interface Partner {
  id: number
  companyName: string
  image: string | null
  createdAt: string
}

interface CreatePartnerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: FormData) => Promise<void> // ✅ Removed partnerId param
  isSubmitting: boolean
  editingPartner?: Partner | null
}

const API_URL = 'http://localhost:3000'

// Reusable UI Components (simplified shadcn/ui equivalents)
interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {children}
      </div>
    </div>
  )
}

interface DialogContentProps {
  children: React.ReactNode
}

const DialogContent = ({ children }: DialogContentProps) => (
  <div className="p-6">{children}</div>
)

const DialogHeader = ({ children }: DialogContentProps) => (
  <div className="mb-4">{children}</div>
)

const DialogTitle = ({ children }: DialogContentProps) => (
  <h2 className="text-xl font-semibold">{children}</h2>
)

const DialogFooter = ({ children }: DialogContentProps) => (
  <div className="flex gap-2 justify-end mt-6">{children}</div>
)

interface LabelProps {
  children: React.ReactNode
  htmlFor?: string
}

const Label = ({ children, htmlFor }: LabelProps) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
)

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = ({ className = '', ...props }: InputProps) => (
  <input
    className={`w-full px-3 py-2 border rounded-md ${className}`}
    {...props}
  />
)

interface ButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  size?: 'default' | 'icon'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const Button = ({
  children,
  variant = 'default',
  size = 'default',
  disabled,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) => {
  const baseClasses = 'rounded-md font-medium transition-colors'
  const variantClasses =
    variant === 'outline'
      ? 'border border-gray-300 bg-white hover:bg-gray-50'
      : 'bg-blue-600 text-white hover:bg-blue-700'
  const sizeClasses = size === 'icon' ? 'p-2' : 'px-4 py-2'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

export default function CreatePartnerModal({
  open,
  onOpenChange,
  onSave,
  isSubmitting,
  editingPartner,
}: CreatePartnerModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)

  const isEditMode = !!editingPartner

  // Reset and load data when modal opens
  useEffect(() => {
    if (open) {
      if (editingPartner) {
        // Edit mode - load existing data
        setCompanyName(editingPartner.companyName || '')
        setSelectedFile(null)

        // Set existing image URL - handle null/undefined cases
        if (editingPartner.image) {
          const imageUrl = editingPartner.image.startsWith('http')
            ? editingPartner.image
            : `${API_URL}${editingPartner.image}`
          setExistingImageUrl(imageUrl)
          setImagePreview(imageUrl)
        } else {
          // No existing image
          setExistingImageUrl(null)
          setImagePreview(null)
        }
      } else {
        // Create mode - reset everything
        setCompanyName('')
        setSelectedFile(null)
        setImagePreview(null)
        setExistingImageUrl(null)
      }
    }
  }, [open, editingPartner])

  // Handle modal close
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset all state when closing
      setCompanyName('')
      setSelectedFile(null)
      setImagePreview(null)
      setExistingImageUrl(null)
    }
    onOpenChange(newOpen)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setSelectedFile(file)
  }

  // Handle removing selected file
  const handleRemoveFile = () => {
    setSelectedFile(null)

    // If in edit mode, revert to existing image
    if (isEditMode && existingImageUrl) {
      setImagePreview(existingImageUrl)
    } else {
      setImagePreview(null)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!companyName.trim()) {
      alert('Company name is required')
      return
    }

    // Image is required for create mode OR if editing and there's no existing image
    if (!isEditMode && !selectedFile) {
      alert('Company logo is required')
      return
    }

    // If editing a partner with no existing image, require a new image
    if (isEditMode && !existingImageUrl && !selectedFile) {
      alert('Please upload a company logo')
      return
    }

    try {
      const formData = new FormData()
      formData.append('companyName', companyName.trim())

      // ✅ Add partner id to FormData when editing
      if (isEditMode && editingPartner?.id) {
        formData.append('id', editingPartner.id.toString())
      }

      // Only append file if a new one was selected
      if (selectedFile) {
        formData.append('image', selectedFile)
      }

      await onSave(formData) // ✅ No longer passing partnerId separately

      // Success - modal will close via parent component
    } catch (error) {
      console.error('Failed to save partner:', error)
      alert(
        `Failed to ${isEditMode ? 'update' : 'create'} partner. Please try again.`
      )
    }
  }

  const hasNewImage = selectedFile !== null
  const hasExistingImage = isEditMode && existingImageUrl !== null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Partner' : 'Add New Partner'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Company Name Input */}
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="BuildTech Solutions"
              disabled={isSubmitting}
            />
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="file">Company Logo {!isEditMode && '*'}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file')?.click()}
                className="flex-1 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                <Upload className="w-4 h-4" />
                {hasNewImage
                  ? 'Change Image'
                  : hasExistingImage
                    ? 'Replace Image'
                    : 'Upload Image'}
              </Button>
              {(hasNewImage || (hasExistingImage && imagePreview)) && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Help text */}
            {isEditMode && !hasNewImage && hasExistingImage && (
              <p className="text-xs text-gray-500 mt-1">
                Current image will be kept if no new image is uploaded
              </p>
            )}
            {!isEditMode && !selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                Please upload a company logo
              </p>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <Label>Preview</Label>
              <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden border mt-1">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                {hasNewImage && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    New Image
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Saving...'
              : isEditMode
                ? 'Update Partner'
                : 'Save Partner'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
