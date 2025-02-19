"use client"

import type React from "react"
import { useState } from "react"
import type { InquiryType, FormData } from "../types"
import WelcomeStep from "./steps/WelcomeStep"
import ProjectDetailsStep from "./steps/ProjectDetailsStep"
import SpokeServicesStep from "./steps/SpokeServicesStep"
import AdditionalInfoStep from "./steps/AdditionalInfoStep"
import ThankYouStep from "./steps/ThankYouStep"
import StepCounter from "./StepCounter"
import NavigationButtons from "./NavigationButtons"
import styles from "../styles/formStyles"

export default function InquiryForm() {
  const [step, setStep] = useState(1)
  const [inquiryType, setInquiryType] = useState<InquiryType>("")
  const [formData, setFormData] = useState<FormData>({
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

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < getMaxSteps()) {
      setStep(step + 1)
    } else {
      console.log({ inquiryType, ...formData })
      setStep(5) // Move to thank you screen
    }
  }

  const getMaxSteps = () => {
    switch (inquiryType) {
      case "new-project":
        return 3
      case "spoke-services":
        return 4
      case "general-contact":
        return 2
      case "schedule-meeting":
        return 1
      default:
        return 1
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <WelcomeStep
            setInquiryType={setInquiryType}
            setStep={setStep}
            formData={formData}
            setFormData={setFormData}
          />
        )
      case 2:
        return <ProjectDetailsStep inquiryType={inquiryType} formData={formData} handleChange={handleChange} />
      case 3:
        if (inquiryType === "new-project") {
          return <ProjectDetailsStep inquiryType={inquiryType} formData={formData} handleChange={handleChange} />
        } else if (inquiryType === "spoke-services") {
          return <SpokeServicesStep formData={formData} handleChange={handleChange} />
        }
        return null
      case 4:
        return <AdditionalInfoStep inquiryType={inquiryType} formData={formData} handleChange={handleChange} />
      case 5:
        return (
          <ThankYouStep
            inquiryType={inquiryType}
            setStep={setStep}
            setInquiryType={setInquiryType}
            setFormData={setFormData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="form-container w-full max-w-[800px] mx-auto p-4 md:p-12 mt-20">
      <style>{styles}</style>
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {renderStep()}
        {step > 1 && step <= getMaxSteps() && (
          <div>
            <StepCounter
              currentStep={step}
              maxSteps={getMaxSteps()}
              onStepClick={(clickedStep) => {
                if (clickedStep < step) {
                  setStep(clickedStep)
                }
              }}
            />
            <NavigationButtons step={step} getMaxSteps={getMaxSteps} setStep={setStep} />
          </div>
        )}
      </form>
    </div>
  )
}

