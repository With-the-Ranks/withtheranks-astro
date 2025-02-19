import type React from "react"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { InquiryType, FormData } from "../../types"

interface AdditionalInfoStepProps {
  inquiryType: InquiryType
  formData: FormData
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: string } },
  ) => void
}

const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({ inquiryType, formData, handleChange }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-white">Additional Information</h3>
        <p className="text-sm md:text-base text-gray-300">
          {inquiryType === "new-project"
            ? "Help us understand your project better."
            : "Help us understand your texting needs better."}
        </p>
      </div>
      <div className="card p-6 md:p-8 space-y-4 md:space-y-6">
        <Select
          name="hearAboutUs"
          onValueChange={(value) => handleChange({ target: { name: "hearAboutUs", value: value || "" } })}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
            <SelectValue placeholder="How did you hear about us?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="search">Search Engine</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {inquiryType === "spoke-services" && (
          <Select
            name="audienceSize"
            onValueChange={(value) => handleChange({ target: { name: "audienceSize", value: value || "" } })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
              <SelectValue placeholder="What's your expected audience size?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Less than 1,000</SelectItem>
              <SelectItem value="medium">1,000 - 10,000</SelectItem>
              <SelectItem value="large">10,000 - 100,000</SelectItem>
              <SelectItem value="xlarge">More than 100,000</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Textarea
          name="needs"
          placeholder={
            inquiryType === "new-project"
              ? "Any additional details about your project?"
              : "Tell us about your texting needs and goals"
          }
          value={formData.needs}
          onChange={handleChange}
          className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px] md:min-h-[120px] rounded-xl"
        />
      </div>
    </div>
  )
}

export default AdditionalInfoStep

