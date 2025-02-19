import type React from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import type { InquiryType, FormData } from "../../types"

interface WelcomeStepProps {
  setInquiryType: (type: InquiryType) => void
  setStep: (step: number) => void
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ setInquiryType, setStep, formData, setFormData }) => {
  const handleQuickSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("Quick Sign Up:", { name: formData.name, email: formData.email })
    setFormData((prev) => ({ ...prev, name: "", email: "" }))
  }

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="space-y-4 md:space-y-6">
        <h2 className="serif-heading font-bold text-3xl md:text-5xl text-white leading-tight">
          How can we help you today?
        </h2>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        <button
          onClick={() => {
            setInquiryType("new-project")
            setStep(2)
          }}
          className="highlight-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all"
        >
          <span className="tag">Custom Websites</span>
          <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Start a New Project</h3>
          <p className="text-sm md:text-base opacity-80 mb-3 md:mb-4">Launch your next digital initiative with us</p>
        </button>
        <button
          onClick={() => {
            setInquiryType("spoke-services")
            setStep(2)
          }}
          className="secondary-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all"
        >
          <span className="tag">P2P Texting</span>
          <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Sign Up for Spoke</h3>
          <p className="text-sm md:text-base opacity-80 mb-3 md:mb-4">Power your outreach with our texting platform</p>
        </button>
        <button
          onClick={() => {
            setInquiryType("general-contact")
            setStep(5)
          }}
          className="tertiary-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all"
        >
          <span className="tag">Support</span>
          <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">General Contact</h3>
          <p className="text-sm md:text-base opacity-80 mb-3 md:mb-4">Get in touch with our team</p>
        </button>
        <button
          onClick={() => {
            setInquiryType("schedule-meeting")
            setStep(5)
          }}
          className="card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all"
        >
          <span className="tag text-white">Quick Chat</span>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Schedule a Meeting</h3>
          <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">Book a time to discuss your needs</p>
        </button>
      </div>
      <div className="card p-6 md:p-8 space-y-4 md:space-y-6">
        <div className="space-y-2">
          <h4 className="text-xl md:text-2xl font-bold text-white">Stay Updated</h4>
          <p className="text-sm md:text-base text-gray-300">Join our mailing list for exclusive updates and offers.</p>
        </div>
        <div className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-10 md:h-12"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-10 md:h-12"
          />
          <Button
            onClick={handleQuickSignUp}
            className="w-full solid-button text-white py-4 md:py-6 text-base md:text-lg font-semibold"
          >
            Join Mailing List
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeStep

