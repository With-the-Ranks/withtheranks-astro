import type React from "react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import type { InquiryType, FormData } from "../../types"
import ImprovedSlider from "../ImprovedSlider"

interface ProjectDetailsStepProps {
  inquiryType: InquiryType
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({ inquiryType, formData, handleChange }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-white">
          {inquiryType === "new-project" ? "Tell us about your project" : "Project Details"}
        </h3>
        <p className="text-sm md:text-base text-gray-300">
          {inquiryType === "new-project"
            ? "We're excited to learn about your project ideas."
            : "Help us understand your project timeline and budget."}
        </p>
      </div>
      <div className="card p-6 md:p-8 space-y-4 md:space-y-6">
        {inquiryType === "new-project" && (
          <>
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-10 md:h-12"
            />
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-10 md:h-12"
            />
            <Input
              type="text"
              name="organization"
              placeholder="Organization Name"
              value={formData.organization}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl h-10 md:h-12"
            />
            <Textarea
              name="needs"
              placeholder="Tell us about your project ideas"
              value={formData.needs}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px] md:min-h-[120px] rounded-xl"
            />
          </>
        )}
        <ImprovedSlider
          id="timeline"
          label="Project Timeline"
          min={1}
          max={4}
          step={1}
          value={Number.parseInt(formData.timeline) || 1}
          onChange={(value) => handleChange({ target: { name: "timeline", value: value.toString() } } as any)}
          labels={["ASAP", "1-2 months", "3-6 months", "Flexible"]}
        />
        <ImprovedSlider
          id="budget"
          label="Budget Range"
          min={1}
          max={4}
          step={1}
          value={Number.parseInt(formData.budget) || 1}
          onChange={(value) => handleChange({ target: { name: "budget", value: value.toString() } } as any)}
          labels={["$2k-$5k", "$5k-$10k", "$10k+", "Unsure"]}
        />
      </div>
    </div>
  )
}

export default ProjectDetailsStep

