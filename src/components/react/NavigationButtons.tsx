import type React from "react"
import { Button } from "../ui/button"
import { ChevronRight, Send } from "lucide-react"

interface NavigationButtonsProps {
  step: number
  getMaxSteps: () => number
  setStep: (step: number) => void
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ step, getMaxSteps, setStep }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center pt-6 md:pt-8 space-y-4 md:space-y-0">
      <Button
        type="button"
        variant="outline"
        onClick={() => setStep(step - 1)}
        className="w-full md:w-auto border-white/20 text-black hover:text-white hover:bg-white/10 rounded-full px-4 md:px-6 py-2 md:py-3 text-base md:text-lg"
      >
        Back
      </Button>
      <Button
        type="submit"
        className="w-full md:w-auto solid-button text-white font-semibold py-2 md:py-3 px-4 md:px-6 text-base md:text-lg"
      >
        {step < getMaxSteps() ? (
          <>
            <span>Next</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
          </>
        ) : (
          <>
            <span>Submit</span>
            <Send className="w-4 h-4 md:w-5 md:h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}

export default NavigationButtons

