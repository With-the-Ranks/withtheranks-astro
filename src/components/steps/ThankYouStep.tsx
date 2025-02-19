import type React from "react"
import { Button } from "../ui/button"
import { RefreshCw } from "lucide-react"
import type { InquiryType, FormData } from "../../types"

interface ThankYouStepProps {
  inquiryType: InquiryType
  setStep: (step: number) => void
  setInquiryType: (type: InquiryType) => void
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

const ThankYouStep: React.FC<ThankYouStepProps> = ({ inquiryType, setStep, setInquiryType, setFormData }) => {
  return (
    <div className="space-y-6 md:space-y-8 text-center">
      <h2 className="serif-heading font-bold text-2xl md:text-4xl text-white leading-tight">
        Thank You for Your Inquiry!
      </h2>
      <p className="text-base md:text-xl text-gray-300">
        We appreciate you taking the time to reach out to us. Our team will review your information and get back to you
        shortly.
      </p>
      {inquiryType === "schedule-meeting" && (
        <p className="text-base md:text-xl text-gray-300">You'll be redirected to our scheduling page in a moment.</p>
      )}
      <Button
        onClick={() => {
          setStep(1)
          setInquiryType("")
          setFormData({
            name: "",
            email: "",
            organization: "",
            needs: "",
            timeline: "",
            secondaryContact: "",
            orgDescription: "",
            primaryLocation: "",
            subdomain: "",
            billingAddress: "",
            hearAboutUs: "",
            audienceSize: "",
            budget: "",
          })
        }}
        className="solid-button text-white font-semibold py-4 md:py-6 px-6 md:px-8 text-base md:text-lg"
      >
        <RefreshCw className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        Start Over
      </Button>
    </div>
  )
}

export default ThankYouStep

