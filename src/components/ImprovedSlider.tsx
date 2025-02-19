import type React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Label } from "./ui/label"

interface ImprovedSliderProps {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  labels: string[]
}

const ImprovedSlider: React.FC<ImprovedSliderProps> = ({ id, label, min, max, step, value, onChange, labels }) => {
  return (
    <div className="space-y-4">
      <Label htmlFor={id} className="text-white text-xl font-semibold block">
        {label}
      </Label>
      <SliderPrimitive.Root
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="relative flex items-center select-none touch-none w-full h-6"
      >
        <SliderPrimitive.Track className="bg-white/10 relative grow rounded-full h-2">
          <SliderPrimitive.Range className="absolute bg-[#8C9DFF] rounded-full h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-6 h-6 bg-white rounded-full shadow-lg border-2 border-[#8C9DFF] focus:outline-none focus:ring-2 focus:ring-[#8C9DFF] transition-transform hover:scale-110" />
      </SliderPrimitive.Root>
      <div className="flex justify-between mt-2">
        {labels.map((label, index) => (
          <span
            key={index}
            className={`text-base transition-all duration-300 ${
              index === value - 1 ? "text-[#8C9DFF] font-bold scale-110" : "text-gray-400"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ImprovedSlider

