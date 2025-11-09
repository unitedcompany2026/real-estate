import { useState } from 'react'
import { Facebook, Instagram } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  interface SubmitEvent {
    preventDefault: () => void
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="relative h-[480px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop)', // Use a high-res image or the one from the design
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="text-white text-left ml-10">
            <h1 className="text-4xl lg:text-5xl font-bold mb-2">
              LET'S FIND YOUR
              <br />
              DREAM HOME.
            </h1>
            <p className="text-2xl lg:text-3xl font-serif italic font-light">
              Contact Us
            </p>
          </div>

          <div className="bg-white  bg-opacity-70 p-8 rounded-lg shadow-xl w-full max-w-md mr-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-gray-800"
              />
              <button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-md transition-colors duration-300 uppercase tracking-wide"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white py-12 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div className="w-1/3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              OUR OFFICE
            </h2>
            <div className="space-y-2 text-gray-600 text-sm">
              <p className="leading-relaxed">
                123 Realty Blvd, Suite 456,
                <br />
                Metropolis, CA 90210
              </p>
              <p>Phone: (555) 123-467</p>
              <p>Email: Info@realestates.com</p>
            </div>
          </div>

          <div className="w-1/3 text-right">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              FOLLOW US
            </h3>
            <div className="flex justify-end gap-3">
              <a
                href="#"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </div>
                <span className="text-xs">Facebook</span>
              </a>
              <a
                href="#"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-xs">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
