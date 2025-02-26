"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChevronRight, Send, RefreshCw } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import ImprovedSlider from "./ImprovedSlider";
import StepCounter from "./StepCounter";

const styles = `
  .form-container {
    background: #FFFCF7;
    border-radius: 32px;
		color: #232656;
  }
  
  .solid-button {
    background-color: #8C9DFF;
    border-radius: 100px;
    transition: all 0.3s ease;
  }
  
  .solid-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(140, 157, 255, 0.3);
  }
  
  .card {
		background: #252753;	
    border-radius: 32px;
		color: #FFFCF7;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
	.purple-card {
		border-radius: 32px;
		background: #8C9DFF;	
		color: #232656;
	}
  .highlight-card {
    background: #FFE872;
    color: #282D55;
    border-radius: 32px;
  }
  
  .secondary-card {
    background: #7FFFD4;
    color: #282D55;
    border-radius: 32px;
  }
  
  .tertiary-card {
		background: rgba(10, 16, 141, 0.50);
    color: #282D55;
    border-radius: 32px;
  }
  
  .tag {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.1);
    display: inline-block;
    margin-bottom: 8px;
		color: #282D55;
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    color: inherit;
    opacity: 0.8;
    transition: all 0.2s ease;
  }

  .read-more:hover {
    opacity: 1;
  }
`;

type InquiryType =
	| "new-project"
	| "spoke-services"
	| "general-contact"
	| "schedule-meeting"
	| "";

export default function InquiryForm() {
	const [step, setStep] = useState(1);
	const [inquiryType, setInquiryType] = useState<InquiryType>("");
	const [formData, setFormData] = useState({
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
	});

	const handleChange = (
		e:
			| React.ChangeEvent<
					HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			  >
			| { target: { name: string; value: string } }
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (step < getMaxSteps()) {
			setStep(step + 1);
		} else {
			console.log({ inquiryType, ...formData });
			setStep(5); // Move to thank you screen
		}
	};

	const getMaxSteps = () => {
		switch (inquiryType) {
			case "new-project":
			case "spoke-services":
				return 4;
			case "general-contact":
				return 2;
			case "schedule-meeting":
				return 1;
			default:
				return 1;
		}
	};

	const handleQuickSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					name: formData.name,
					email: formData.email,
				}).toString(),
			});

			const result = await response.json();

			if (result.success) {
				setStep(5);
				setFormData((prev) => ({ ...prev, name: "", email: "" }));
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.error("Signup failed:", error);
			alert("There was an error signing up. Please try again.");
		}
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div className='space-y-8 md:space-y-12'>
						<div className='space-y-4 md:space-y-6'>
							<h2 className='serif-heading font-bold text-5xl md:text-7xl text-[#252753] leading-tight'>
								Let us know how we can help.
							</h2>
							<p className='text-[#252753]'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
								eiusmod tempor incididunt ut labore.
							</p>
						</div>
						<div className='grid gap-4 md:gap-6 md:grid-cols-2'>
							<button
								onClick={() => {
									setInquiryType("new-project");
									setStep(2);
								}}
								className='highlight-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all'>
								<span className='tag'>Custom Websites</span>
								<h3 className='text-xl md:text-2xl font-bold mb-2 md:mb-3'>
									Start a New Project
								</h3>
								<p className='text-sm md:text-base opacity-80 mb-3 md:mb-4'>
									Launch your next digital initiative with us
								</p>
							</button>
							<button
								onClick={() => {
									setInquiryType("spoke-services");
									setStep(2);
								}}
								className='secondary-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all'>
								<span className='tag'>P2P Texting</span>
								<h3 className='text-xl md:text-2xl font-bold mb-2 md:mb-3'>
									Sign Up for Spoke
								</h3>
								<p className='text-sm md:text-base opacity-80 mb-3 md:mb-4'>
									Power your organizing efforts with affordable peer-to-peer
									texting at scale.
								</p>
							</button>
							<button
								onClick={() => {
									setInquiryType("general-contact");
									setStep(getMaxSteps() + 1);
								}}
								className='tertiary-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all'>
								<span className='tag'>Support</span>
								<h3 className='text-xl md:text-2xl font-bold mb-2 md:mb-3'>
									General Contact
								</h3>
								<p className='text-sm md:text-base opacity-80 mb-3 md:mb-4'>
									Not sure what to choose? Just drop us a message and we’ll get
									you pointed in the right direction!
								</p>
							</button>
							<button
								onClick={() => {
									setInquiryType("schedule-meeting");
									setStep(5); // Go directly to thank you screen
								}}
								className='purple-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all'>
								<span className='tag'>Quick Chat</span>
								<h3 className='text-xl md:text-2xl font-bold mb-2 md:mb-3'>
									Schedule a Meeting
								</h3>
								<p className='text-sm md:text-base mb-3 md:mb-4'>
									Prefer to meet virtually? Book a time with a team member and
									we’ll help point you in the right direction.
								</p>
							</button>
						</div>
						<div className='card text-center p-6 md:p-8 space-y-4 md:space-y-6 py-6 md:py-16'>
							<div className="max-w-xl mx-auto">
								<h4 className='text-5xl md:text-2xl mb-0 font-bold'>
									Just want to stay in the loop?
								</h4>
								<p className='text-sm md:text-base'>
									If you’re just interested in following along with what we’re
									building - from scaling a tech cooperative to optimizing for
									organizing at scale - leave your name and email and we’ll send
									you an email on occasion.
								</p>
							</div>
							<div className='space-x-4 flex max-w-xl mx-auto'>
								<Input
									type='text'
									name='name'
									placeholder='Your Name'
									value={formData.name}
									onChange={handleChange}
									className='bg-white/10 border-white/20  placeholder-gray-400 rounded-xl h-10 md:h-12'
								/>
								<Input
									type='email'
									name='email'
									placeholder='Email Address'
									value={formData.email}
									onChange={handleChange}
									required
									className='bg-white/10 border-white/20  placeholder-gray-400 rounded-xl h-10 md:h-12'
								/>
								<Button
									onClick={handleQuickSignUp}
									className='w-full solid-button  py-4 md:py-6 text-base md:text-lg font-semibold'>
									Sign Up
								</Button>
							</div>
						</div>
					</div>
				);
			case 2:
				return (
					<div className='space-y-6 md:space-y-8'>
						<div className='space-y-2'>
							<h3 className='text-xl md:text-5xl font-bold '>
								{inquiryType === "new-project" && "Tell us about your project"}
								{inquiryType === "spoke-services" &&
									"Sign up for Spoke Services"}
								{inquiryType === "general-contact" && "Get in touch"}
							</h3>
							<p className='text-lg md:text-bas'>
								{inquiryType === "new-project" &&
									"We're excited to learn about your project ideas."}
								{inquiryType === "spoke-services" &&
									"Let's get you set up with Spoke, our powerful P2P texting platform."}
								{inquiryType === "general-contact" &&
									"We're here to answer any questions you may have."}
							</p>
						</div>
						<div className='card p-6 md:p-8 space-y-4 md:space-y-6'>
							<Input
								type='text'
								name='name'
								placeholder='Your Name'
								value={formData.name}
								onChange={handleChange}
								className='bg-white/10 border-white/20  placeholder-gray-400 rounded-xl h-10 md:h-12'
							/>
							<Input
								type='email'
								name='email'
								placeholder='Email Address'
								value={formData.email}
								onChange={handleChange}
								required
								className='bg-white/10 border-white/20  placeholder-gray-400 rounded-xl h-10 md:h-12'
							/>
							<Input
								type='text'
								name='organization'
								placeholder='Organization Name'
								value={formData.organization}
								onChange={handleChange}
								className='bg-white/10 border-white/20  placeholder-gray-400 rounded-xl h-10 md:h-12'
							/>
							{inquiryType === "spoke-services" && (
								<>
									<Input
										type='text'
										name='secondaryContact'
										placeholder='Secondary Contact (optional)'
										value={formData.secondaryContact}
										onChange={handleChange}
										className='bg-white/10 border-white/20  placeholder-gray-400 rounded-xl h-10 md:h-12'
									/>
									<Textarea
										name='orgDescription'
										placeholder="Short description of your organization's work"
										value={formData.orgDescription}
										onChange={handleChange}
										className='bg-white/10 border-white/20  placeholder-gray-400 min-h-[100px] md:min-h-[120px] rounded-xl'
									/>
								</>
							)}
							<Textarea
								name='needs'
								placeholder={
									inquiryType === "new-project"
										? "Tell us about your project ideas"
										: inquiryType === "general-contact"
											? "How can we help you?"
											: "Tell us about your texting needs"
								}
								value={formData.needs}
								onChange={handleChange}
								className='bg-white/10 border-white/20  placeholder-gray-400 min-h-[100px] md:min-h-[120px] rounded-xl'
							/>
						</div>
					</div>
				);
			case 3:
				if (inquiryType === "new-project") {
					return (
						<div className='space-y-6 md:space-y-8'>
							<div className='space-y-2'>
								<h3 className='text-xl md:text-5xl font-bold '>
									Project Details
								</h3>
								<p className='text-lg md:text-base'>
									Help us understand your project timeline and budget.
								</p>
							</div>
							<div className='card p-6 md:p-8 space-y-6 md:space-y-8'>
								<ImprovedSlider
									id='timeline'
									label='Project Timeline'
									min={1}
									max={4}
									step={1}
									value={Number.parseInt(formData.timeline) || 1}
									onChange={(value) =>
										setFormData((prev) => ({
											...prev,
											timeline: value.toString(),
										}))
									}
									labels={["ASAP", "1-2 months", "3-6 months", "Flexible"]}
								/>
								<ImprovedSlider
									id='budget'
									label='Budget Range'
									min={1}
									max={4}
									step={1}
									value={Number.parseInt(formData.budget) || 1}
									onChange={(value) =>
										setFormData((prev) => ({
											...prev,
											budget: value.toString(),
										}))
									}
									labels={["$2k-$5k", "$5k-$10k", "$10k+", "Unsure"]}
								/>
							</div>
						</div>
					);
				} else if (inquiryType === "spoke-services") {
					return (
						<div className='space-y-6 md:space-y-8'>
							<div className='space-y-2'>
								<h3 className='text-xl md:text-5xl font-bold '>
									Spoke Services Details
								</h3>
								<p className='text-lg md:text-bas'>
									Let's get some specifics about your Spoke needs.
								</p>
							</div>
							<div className='card p-6 md:p-8 space-y-4 md:space-y-6'>
								<Input
									type='text'
									name='primaryLocation'
									placeholder='Primary Location (for phone number)'
									value={formData.primaryLocation}
									onChange={handleChange}
									className='bg-white/10 border-white/20  placeholder-gray-400 rounded-xl h-10 md:h-12'
								/>
								<Input
									type='text'
									name='subdomain'
									placeholder='Preferred Subdomain'
									value={formData.subdomain}
									onChange={handleChange}
									className='bg-white/10 border-white/20  placeholder-gray-400 rounded-xl h-10 md:h-12'
								/>
								<Textarea
									name='billingAddress'
									placeholder='Billing Address'
									value={formData.billingAddress}
									onChange={handleChange}
									className='bg-white/10 border-white/20  placeholder-gray-400 min-h-[100px] md:min-h-[120px] rounded-xl'
								/>
							</div>
						</div>
					);
				}
				return null;
			case 4:
				return (
					<div className='space-y-6 md:space-y-8'>
						<div className='space-y-2'>
							<h3 className='text-xl md:text-5xl font-bold '>
								Additional Information
							</h3>
							<p className='text-lg md:text-base'>
								{inquiryType === "new-project"
									? "Help us understand your project better."
									: "Help us understand your texting needs better."}
							</p>
						</div>
						<div className='card p-6 md:p-8 space-y-4 md:space-y-6'>
							<Select
								name='hearAboutUs'
								onValueChange={(value) =>
									handleChange({
										target: { name: "hearAboutUs", value: value || "" },
									})
								}>
								<SelectTrigger className='bg-white/10 border-white/20  rounded-xl'>
									<SelectValue placeholder='How did you hear about us?' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='search'>Search Engine</SelectItem>
									<SelectItem value='referral'>Referral</SelectItem>
									<SelectItem value='social'>Social Media</SelectItem>
									<SelectItem value='other'>Other</SelectItem>
								</SelectContent>
							</Select>
							{inquiryType === "spoke-services" && (
								<Select
									name='audienceSize'
									onValueChange={(value) =>
										handleChange({
											target: { name: "audienceSize", value: value || "" },
										})
									}>
									<SelectTrigger className='bg-white/10 border-white/20  rounded-xl'>
										<SelectValue placeholder="What's your expected audience size?" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='small'>Less than 1,000</SelectItem>
										<SelectItem value='medium'>1,000 - 10,000</SelectItem>
										<SelectItem value='large'>10,000 - 100,000</SelectItem>
										<SelectItem value='xlarge'>More than 100,000</SelectItem>
									</SelectContent>
								</Select>
							)}
							<Textarea
								name='needs'
								placeholder={
									inquiryType === "new-project"
										? "Any additional details about your project?"
										: "Tell us about your texting needs and goals"
								}
								value={formData.needs}
								onChange={handleChange}
								className='bg-white/10 border-white/20  placeholder-gray-400 min-h-[100px] md:min-h-[120px] rounded-xl'
							/>
						</div>
					</div>
				);
			case 5: // Thank you screen
				return (
					<div className='space-y-6 md:space-y-8 text-center'>
						<h2 className='serif-heading font-bold text-2xl md:text-5xl  leading-tight'>
							Thank You for Your Inquiry!
						</h2>
						<p className='text-lg md:text-xl'>
							We appreciate you taking the time to reach out to us. Our team
							will review your information and get back to you shortly.
						</p>
						{inquiryType === "schedule-meeting" && (
							<p className='text-base md:text-xl'>
								You'll be redirected to our scheduling page in a moment.
							</p>
						)}
						<Button
							onClick={() => {
								setStep(1);
								setInquiryType("");
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
								});
							}}
							className='solid-button  font-semibold py-4 md:py-6 px-6 md:px-8 text-base md:text-lg'>
							<RefreshCw className='w-4 h-4 md:w-5 md:h-5 mr-2' />
							Start Over
						</Button>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className='form-container w-full mx-auto p-4 md:p-12 mt-20'>
			<style>{styles}</style>
			<form
				onSubmit={handleSubmit}
				className='space-y-6 md:space-y-8 max-w-[800px] mx-auto mt-16'>
				{renderStep()}
				{step > 1 && step <= getMaxSteps() && (
					<div>
						<StepCounter
							currentStep={step}
							maxSteps={getMaxSteps()}
							onStepClick={(clickedStep) => {
								if (clickedStep < step) {
									setStep(clickedStep);
								}
							}}
						/>
						<div className='flex flex-col md:flex-row justify-between items-center pt-6 md:pt-8 space-y-4 md:space-y-0'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setStep(step - 1)}
								className='w-full md:w-auto border-white/20 text-black hover: hover:bg-white/10 rounded-full px-4 md:px-6 py-2 md:py-3 text-base md:text-lg'>
								Back
							</Button>
							<Button
								type='submit'
								className='w-full md:w-auto solid-button  font-semibold py-2 md:py-3 px-4 md:px-6 text-base md:text-lg'>
								{step < getMaxSteps() ? (
									<>
										<span>Next</span>
										<ChevronRight className='w-4 h-4 md:w-5 md:h-5 ml-2' />
									</>
								) : (
									<>
										<span>Submit</span>
										<Send className='w-4 h-4 md:w-5 md:h-5 ml-2' />
									</>
								)}
							</Button>
						</div>
					</div>
				)}
			</form>
		</div>
	);
}
