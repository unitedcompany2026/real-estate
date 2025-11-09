import { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'

interface Partner {
  id: number
  companyName: string
  image: string | null
  createdAt: string
}

interface Project {
  id: number
  projectName: string
  projectLocation: string
  image: string | null
  partnerId: number
  partner?: Partner
  createdAt: string
}

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: FormData, projectId?: number) => Promise<void> // ✅ Added projectId parameter
  isSubmitting: boolean
  editingProject?: Project | null
  partners: Partner[]
  partnersLoading: boolean
}

const API_URL = 'http://localhost:3000'

// Reusable UI Components
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
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
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

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

const Select = ({ className = '', children, ...props }: SelectProps) => (
  <select
    className={`w-full px-3 py-2 border rounded-md bg-white ${className}`}
    {...props}
  >
    {children}
  </select>
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

export default function CreateProjectModal({
  open,
  onOpenChange,
  onSave,
  isSubmitting,
  editingProject,
  partners,
  partnersLoading,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState('')
  const [projectLocation, setProjectLocation] = useState('')
  const [partnerId, setPartnerId] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)

  const isEditMode = !!editingProject

  // Reset and load data when modal opens
  useEffect(() => {
    if (open) {
      if (editingProject) {
        // Edit mode - load existing data
        setProjectName(editingProject.projectName || '')
        setProjectLocation(editingProject.projectLocation || '')
        setPartnerId(editingProject.partnerId?.toString() || '')
        setSelectedFile(null)

        // Set existing image URL
        if (editingProject.image) {
          const imageUrl = editingProject.image.startsWith('http')
            ? editingProject.image
            : `${API_URL}${editingProject.image}`
          setExistingImageUrl(imageUrl)
          setImagePreview(imageUrl)
        } else {
          setExistingImageUrl(null)
          setImagePreview(null)
        }
      } else {
        // Create mode - reset everything
        setProjectName('')
        setProjectLocation('')
        setPartnerId('')
        setSelectedFile(null)
        setImagePreview(null)
        setExistingImageUrl(null)
      }
    }
  }, [open, editingProject])

  // Handle modal close
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset all state when closing
      setProjectName('')
      setProjectLocation('')
      setPartnerId('')
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
    // Validation
    if (!projectName.trim()) {
      alert('Project name is required')
      return
    }

    if (!projectLocation.trim()) {
      alert('Project location is required')
      return
    }

    if (!partnerId) {
      alert('Please select a partner')
      return
    }

    // Image is required for create mode OR if editing and there's no existing image
    if (!isEditMode && !selectedFile) {
      alert('Project image is required')
      return
    }

    if (isEditMode && !existingImageUrl && !selectedFile) {
      alert('Please upload a project image')
      return
    }

    try {
      const formData = new FormData()
      formData.append('projectName', projectName.trim())
      formData.append('projectLocation', projectLocation.trim())
      formData.append('partnerId', partnerId)

      // Add ID to body if in edit mode
      if (isEditMode && editingProject?.id) {
        formData.append('id', editingProject.id.toString())
      }

      // Only append file if a new one was selected
      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      // ✅ FIXED: Pass projectId when in edit mode
      if (isEditMode && editingProject?.id) {
        await onSave(formData, editingProject.id)
      } else {
        await onSave(formData)
      }
    } catch (error) {
      console.error('Failed to save project:', error)
      alert(
        `Failed to ${isEditMode ? 'update' : 'create'} project. Please try again.`
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
            {isEditMode ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Project Name Input */}
          <div>
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Downtown Office Complex"
              disabled={isSubmitting}
            />
          </div>

          {/* Project Location Input */}
          <div>
            <Label htmlFor="projectLocation">Project Location *</Label>
            <Input
              id="projectLocation"
              value={projectLocation}
              onChange={e => setProjectLocation(e.target.value)}
              placeholder="New York, NY"
              disabled={isSubmitting}
            />
          </div>

          {/* Partner Selection */}
          <div>
            <Label htmlFor="partnerId">Partner Company *</Label>
            {partnersLoading ? (
              <div className="flex items-center justify-center py-3 border rounded-md bg-gray-50">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
                <span className="ml-2 text-sm text-gray-600">
                  Loading partners...
                </span>
              </div>
            ) : partners.length === 0 ? (
              <div className="py-3 px-3 border rounded-md bg-yellow-50 text-yellow-800 text-sm">
                No partners available. Please add a partner first.
              </div>
            ) : (
              <Select
                id="partnerId"
                value={partnerId}
                onChange={e => setPartnerId(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Select a partner</option>
                {partners.map(partner => (
                  <option key={partner.id} value={partner.id}>
                    {partner.companyName}
                  </option>
                ))}
              </Select>
            )}
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="file">Project Image {!isEditMode && '*'}</Label>
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
                Please upload a project image
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
                  className="w-full h-full object-cover"
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
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || partners.length === 0}
          >
            {isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Saving...'
              : isEditMode
                ? 'Update Project'
                : 'Save Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
