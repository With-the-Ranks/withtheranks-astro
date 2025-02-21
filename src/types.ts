export type InquiryType = "new-project" | "spoke-services" | "general-contact" | "schedule-meeting" | ""

export interface FormData {
  name: string
  email: string
  organization: string
  needs: string
  timeline: string
  secondaryContact: string
  orgDescription: string
  primaryLocation: string
  subdomain: string
  billingAddress: string
  hearAboutUs: string
  audienceSize: string
  budget: string
}

