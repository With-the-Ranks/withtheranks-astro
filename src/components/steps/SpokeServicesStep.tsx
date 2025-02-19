import type React from "react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import type { FormData } from "../../types"

interface SpokeServicesStepProps {
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

const SpokeServicesStep: React.FC<SpokeServicesStepProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-white">Spoke Services Details</h3>
        <p className="text-sm md:text-base text-gray-300">Let's get some specifics about your Spoke needs.</p>
      </div>
      <div className="card p-6 md:p-8 space-y-4 md:space-y-6">
        <Input
          type="text"
          name="primaryLocation"
          placeholder="Primary Location (for phone number)"
          value={formData.primaryLocation}
          onChange={handleChange}
          className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-10 md:h-12"
        />
        <Input
          type="text"
          name="subdomain"
          placeholder="Preferred Subdomain"
          value={formData.subdomain}
          onChange={handleChange}
          className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-10 md:h-12"
        />
        <Textarea
          name="billingAddress"
          placeholder="Billing Address"
          value={formData.billingAddress}
          onChange={handleChange}
          className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px] md:min-h-[120px] rounded-xl"
        />
      </div>
    </div>
  )
}

export default SpokeServicesStep

