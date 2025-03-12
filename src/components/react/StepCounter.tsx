import type React from "react"

interface StepCounterProps {
  currentStep: number
  maxSteps: number
  onStepClick: (step: number) => void
}

const StepCounter: React.FC<StepCounterProps> = ({ currentStep, maxSteps, onStepClick }) => {
  return (
    <div className="flex justify-center items-center my-8">
      {Array.from({ length: maxSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < currentStep ? "bg-[#252753]" : "bg-[#25275325]"
            } ${i === currentStep - 1 ? "scale-150" : ""}`}
            aria-label={`Go to step ${i + 1}`}
          />
          {i < maxSteps - 1 && (
            <div
              className={`h-0.5 w-6 mx-2 transition-all duration-300 ${
                i < currentStep - 1 ? "bg-[#252753]" : "bg-[#25275325]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default StepCounter

