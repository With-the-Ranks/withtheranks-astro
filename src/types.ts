export type InquiryType = "new-project" | "spoke" | "general-contact" | "schedule-meeting" | ""

export interface FormData {
  name: string
  email: string
  organization: string
  needs: string
  timeline: string
  secondaryContact: string
  orgDescription: string
  hearAboutUs: string
  budget: string
}

