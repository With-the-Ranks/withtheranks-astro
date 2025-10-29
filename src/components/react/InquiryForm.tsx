"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChevronRight, Send, RefreshCw, Loader2 } from "lucide-react";
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
`;

type InquiryType =
	| "new-project"
	| "spoke-services"
	| "general-contact"
	| "schedule-meeting"
	| "";

var calendlyLink = "https://calendly.com/with-the-ranks/team-meeting";

export interface InquiryFormProps {
	initialInquiryType?: InquiryType
	removeTopMargin?: boolean
	showAllOptions?: boolean
	title?: string
	subtitle?: string
	helloText?: string
	turnstileSiteKey?: string
}

const InquiryForm: React.FC<InquiryFormProps> = ({
	showAllOptions = true,
	title="Let us know how we can help.",
	subtitle="Got a project or need support? We're here to help.",
	helloText="Not sure what to choose? Just drop us a message and we'll get you pointed in the right direction",
	initialInquiryType,
	removeTopMargin,
	turnstileSiteKey,
}) => {
	const siteKey = turnstileSiteKey;
	const topMarginClass = removeTopMargin ? "" : "mt-16";
	const turnstileStep1Ref = useRef<HTMLDivElement>(null);
	const turnstileFinalRef = useRef<HTMLDivElement>(null);
	const widgetIdStep1 = useRef<string | null>(null);
	const widgetIdFinal = useRef<string | null>(null);

	const startingStep = initialInquiryType ? 2 : 1;
	const [step, setStep] = useState(startingStep);
	const [inquiryType, setInquiryType] = useState<InquiryType>(initialInquiryType ?? "");
	const [isLoading, setIsLoading] = useState(false);
	const [quickSignUpError, setQuickSignUpError] = useState<string | null>(null);

	const maxSteps = inquiryType === "new-project" || inquiryType === "spoke-services" ? 4 : inquiryType === "general-contact" ? 2 : 1;

	useEffect(() => {
		if (step !== 1 || !siteKey) return;
		
		if (widgetIdStep1.current !== null) {
			try {
				if (typeof window !== 'undefined' && (window as any).turnstile) {
					(window as any).turnstile.remove(widgetIdStep1.current);
				}
			} catch (e) {
				// Ignore
			}
			widgetIdStep1.current = null;
		}
		
		const timer = setTimeout(() => {
			if (typeof window !== 'undefined' && (window as any).turnstile && turnstileStep1Ref.current && widgetIdStep1.current === null) {
				try {
					widgetIdStep1.current = (window as any).turnstile.render(turnstileStep1Ref.current, {
						sitekey: siteKey,
						theme: 'dark',
						size: 'normal',
					});
				} catch (e) {
					// Ignore render errors
				}
			}
		}, 150);
		
		return () => {
			clearTimeout(timer);
			if (widgetIdStep1.current !== null) {
				try {
					if (typeof window !== 'undefined' && (window as any).turnstile) {
						(window as any).turnstile.remove(widgetIdStep1.current);
					}
				} catch (e) {
					// Ignore
				}
				widgetIdStep1.current = null;
			}
		};
	}, [siteKey, step]);

	useEffect(() => {
		if (step !== maxSteps || !siteKey) return;
		
		if (widgetIdFinal.current !== null) {
			try {
				if (typeof window !== 'undefined' && (window as any).turnstile) {
					(window as any).turnstile.remove(widgetIdFinal.current);
				}
			} catch (e) {
				// Ignore
			}
			widgetIdFinal.current = null;
		}
		
		const timer = setTimeout(() => {
			if (typeof window !== 'undefined' && (window as any).turnstile && turnstileFinalRef.current && widgetIdFinal.current === null) {
				try {
					widgetIdFinal.current = (window as any).turnstile.render(turnstileFinalRef.current, {
						sitekey: siteKey,
						theme: 'light',
						size: 'normal',
					});
				} catch (e) {
					// Ignore render errors
				}
			}
		}, 150);
		
		return () => {
			clearTimeout(timer);
			if (widgetIdFinal.current !== null) {
				try {
					if (typeof window !== 'undefined' && (window as any).turnstile) {
						(window as any).turnstile.remove(widgetIdFinal.current);
					}
				} catch (e) {
					// Ignore
				}
				widgetIdFinal.current = null;
			}
		};
	}, [siteKey, step, maxSteps]);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		organization: "",
		needs: "",
		timeline: "1",
		secondaryContact: "",
		orgDescription: "",
		primaryLocation: "",
		subdomain: "",
		billingAddress: "",
		hearAboutUs: "",
		audienceSize: "",
		budget: "1",
	});
	const [submitError, setSubmitError] = useState<string | null>(null);

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (step < getMaxSteps()) {
			handleStepChange(step + 1);
			return;
		}
	
		setSubmitError(null);
		setIsLoading(true);
	
		// Get Turnstile response
		const turnstileInput = document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement;
		const turnstileResponse = turnstileInput?.value || '';
	
		// Prepare email data
			const emailData = new URLSearchParams({
				name: formData.name,
				email: formData.email,
				inquiryType,
				organization: formData.organization,
				needs: formData.needs,
				timeline: formData.timeline,
				secondaryContact: formData.secondaryContact,
				orgDescription: formData.orgDescription,
				primaryLocation: formData.primaryLocation,
				subdomain: formData.subdomain,
				billingAddress: formData.billingAddress,
				hearAboutUs: formData.hearAboutUs,
				audienceSize: formData.audienceSize,
				budget: formData.budget,
				'cf-turnstile-response': turnstileResponse,
			}).toString();

			try {
				const response = await fetch("/api/send-email", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: emailData,
				});
		
				const result = await response.json();
		
				if (result.success) {
					handleStepChange(5); // Move to Thank You screen
					setFormData({
						name: "",
						email: "",
						organization: "",
						needs: "",
						timeline: "1",
						secondaryContact: "",
						orgDescription: "",
						primaryLocation: "",
						subdomain: "",
						billingAddress: "",
						hearAboutUs: "",
						audienceSize: "",
						budget: "1",
					});
					setSubmitError(null);
				} else {
					throw new Error(result.error);
				}
			} catch (error) {
				setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred");
			} finally {
				setIsLoading(false);
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
	
		// Validate inputs
		if (!formData.name.trim() || !formData.email.trim()) {
			setQuickSignUpError("Please enter your name and email.");
			return;
		}
	
		setIsLoading(true);
		setQuickSignUpError(null);
	
		// Get Turnstile response
		const turnstileInput = document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement;
		const turnstileResponse = turnstileInput?.value || '';
	
		try {
				const params = new URLSearchParams({
					name: formData.name,
					email: formData.email,
					'cf-turnstile-response': turnstileResponse,
				});
				
				const response = await fetch("/api/send-email", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: params.toString(),
				});
		
				const result = await response.json();
		
				if (result.success) {
					setStep(5);
					setFormData((prev) => ({ ...prev, name: "", email: "" }));
					setQuickSignUpError(null);
				} else {
					throw new Error(result.error || "An unexpected error occurred.");
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "There was an error signing up. Please try again.";
				setQuickSignUpError(errorMessage);
			} finally {
				setIsLoading(false);
			}
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div className='space-y-8 md:space-y-12'>
						<div className='space-y-4 md:space-y-6 pt-8 px-4'>
							<h2 className='serif-heading font-bold text-3xl mb-0 md:text-5xl lg:text-7xl text-[#252753] leading-tight'>
								{ title }
							</h2>
							<p className='text-lg lg:text-2xl text-[#252753]'>
								{ subtitle }
							</p>
						</div>
						<div className={`grid gap-4 ${showAllOptions ? 'md:gap-6 md:grid-cols-2' : 'md:gap-6 md:grid-cols-1'}`}>
						{showAllOptions && (
							<>
							<button
								type="button"
								onClick={() => {
									setInquiryType("new-project");
									handleStepChange(2);
								}}
								className='highlight-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all'>
								<span className='tag'>Custom Websites</span>
								<h3 className='text-xl md:text-2xl font-bold mb-2 md:mb-3'>
									Start a New Project
								</h3>
								<span className='text-sm md:text-base opacity-80 mb-3 md:mb-4'>
									From custom websites to full-fledged web products, let us know
									what you need.
								</span>
							</button>
							<button
								type="button"
								onClick={() => {
									setInquiryType("spoke-services");
									handleStepChange(2);
								}}
								className='secondary-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all'>
								<span className='tag'>P2P Texting</span>
								<h3 className='text-xl md:text-2xl font-bold mb-2 md:mb-3'>
									Sign Up for Spoke
								</h3>
								<span className='text-sm md:text-base opacity-80 mb-3 md:mb-4'>
									Power your organizing efforts with affordable peer-to-peer
									texting at scale.
								</span>
							</button>
							</>
						)}
							<button
								type="button"
								onClick={() => {
									setInquiryType("general-contact");
									handleStepChange(2);
								}}
								className='tertiary-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all'>
								<span className='tag'>Support</span>
								<h3 className='text-xl md:text-2xl font-bold mb-2 md:mb-3'>
									Just say hello
								</h3>
								<span className='text-sm md:text-base opacity-80 mb-3 md:mb-4'>
									{ helloText }
								</span>
							</button>
							{showAllOptions && (
								<>
								<button
									type="button"
									onClick={() => {
										setInquiryType("schedule-meeting");
										handleStepChange(5); // Go directly to thank you screen
										window.open(calendlyLink);
									}}
									className='purple-card p-6 md:p-8 text-left hover:transform hover:scale-[1.02] transition-all'>
									<span className='tag'>Quick Chat</span>
									<h3 className='text-xl md:text-2xl font-bold mb-2 md:mb-3'>
										Schedule a Meeting
									</h3>
									<span className='text-sm md:text-base mb-3 md:mb-4'>
										Prefer to meet virtually? Book a time with a team member and
										we’ll help point you in the right direction.
									</span>
								</button>
							</>
							)}
						</div>
						<div className='card text-center p-6 md:p-8 space-y-4 md:space-y-6 py-6 md:py-16'>
							<div className='max-w-xl mx-auto'>
								<h4 className='text-2xl md:text-4xl mb-3 font-bold'>
									Just want to stay in the loop?
								</h4>
								<span className='text-sm md:text-base'>
									If you’re just interested in following along with what we’re
									building - from scaling a tech cooperative to optimizing for
									organizing at scale - leave your name and email and we’ll send
									you an email on occasion.
								</span>
							</div>
							<div className='flex flex-col md:flex-row items-baseline gap-3 max-w-xl mx-auto'>
								<Input
									type='text'
									name='name'
									placeholder='Your Name'
									value={formData.name}
									onChange={handleChange}
									className='bg-white/10 border-white/20 placeholder-gray-400 rounded-xl h-10 md:h-12'
								/>
								<Input
									type='email'
									name='email'
									placeholder='Email Address'
									value={formData.email}
									onChange={handleChange}
									className='bg-white/10 border-white/20 placeholder-gray-400 rounded-xl h-10 md:h-12'
								/>
								<Button
									disabled={isLoading}
									type="submit"
									onClick={handleQuickSignUp}
									className='w-full solid-button py-4 md:py-6 text-base md:text-lg font-semibold'>
									Sign Up
								</Button>
							</div>
							{siteKey && (
								<div className="flex justify-center my-4">
									<div ref={turnstileStep1Ref}></div>
								</div>
							)}
							<div>
								{quickSignUpError && <p className="text-red-500 text-sm">{quickSignUpError}</p>}
							</div>
						</div>
					</div>
				);
			case 2:
				return (
					<div className='space-y-6 md:space-y-8'>
						<div className='space-y-2 pt-8 px-4'>
							<h3 className='text-xl md:text-5xl font-bold mb-0 md:mb-3'>
								{inquiryType === "new-project" && "Tell us about your project"}
								{inquiryType === "spoke-services" &&
									"Sign up for Spoke Services"}
								{inquiryType === "general-contact" && "Get in touch"}
							</h3>
							<p className='text-lg md:text-2xl'>
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
								required
								className='bg-white/10 border-white/20  placeholder:text-white rounded-xl h-10 md:h-12'
							/>
							<Input
								type='email'
								name='email'
								placeholder='Email Address'
								value={formData.email}
								onChange={handleChange}
								required
								className='bg-white/10 border-white/20  placeholder:text-white rounded-xl h-10 md:h-12'
							/>
							<Input
								type='text'
								name='organization'
								placeholder='Organization Name'
								value={formData.organization}
								onChange={handleChange}
								className='bg-white/10 border-white/20  placeholder:text-white rounded-xl h-10 md:h-12'
							/>
							{inquiryType === "spoke-services" && (
								<>
									<Input
										type='text'
										name='secondaryContact'
										placeholder='Secondary Contact (optional)'
										value={formData.secondaryContact}
										onChange={handleChange}
										className='bg-white/10 border-white/20  placeholder:text-white rounded-xl h-10 md:h-12'
									/>
									<Textarea
										name='orgDescription'
										placeholder="Short description of your organization's work"
										value={formData.orgDescription}
										onChange={handleChange}
										className='bg-white/10 border-white/20  placeholder:text-white min-h-[100px] md:min-h-[120px] rounded-xl'
									/>
								</>
							)}
							{inquiryType === "general-contact" ? (
								<Textarea
									name='needs'
									placeholder={"How can we help you?"}
									value={formData.needs}
									onChange={handleChange}
									className='bg-white/10 border-white/20  placeholder:text-white min-h-[100px] md:min-h-[120px] rounded-xl'
								/>
							) : null}
						</div>
					</div>
				);
			case 3:
				if (inquiryType === "new-project") {
					return (
						<div className='space-y-6 md:space-y-8'>
							<div className='space-y-2 pt-8 px-4'>
								<h3 className='text-xl md:text-5xl font-bold  mb-0 md:mb-3'>
									Project Details
								</h3>
								<p className='text-lg md:text-2xl'>
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
								<h3 className='text-xl md:text-5xl font-bold mb-0 md:mb-3'>
									Spoke Services Details
								</h3>
								<p className='text-lg md:text-2xl'>
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
									className='bg-white/10 border-white/20  placeholder:text-white rounded-xl h-10 md:h-12'
								/>
								<Input
									type='text'
									name='subdomain'
									placeholder='Preferred Subdomain'
									value={formData.subdomain}
									onChange={handleChange}
									className='bg-white/10 border-white/20  placeholder:text-white rounded-xl h-10 md:h-12'
								/>
								<Textarea
									name='billingAddress'
									placeholder='Billing Address'
									value={formData.billingAddress}
									onChange={handleChange}
									className='bg-white/10 border-white/20  placeholder:text-white min-h-[100px] md:min-h-[120px] rounded-xl'
								/>
							</div>
						</div>
					);
				}
				return null;
			case 4:
				return (
					<div className='space-y-6 md:space-y-8'>
						<div className='space-y-2 pt-8 px-4'>
							<h3 className='text-xl md:text-5xl font-bold mb-0 md:mb-3'>
								Additional Information
							</h3>
							<p className='text-lg md:text-2xl'>
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
					<div className='space-y-6 md:space-y-8 text-center pb-8'>
						<h2 className='serif-heading font-bold text-2xl md:text-5xl pt-8 px-4 leading-tight'>
							Thank You for Your Inquiry!
						</h2>
						{inquiryType != "schedule-meeting" && (
							<p className='text-lg md:text-2xl'>
								We appreciate you taking the time to reach out to us. Our team
								will review your information and get back to you shortly.
							</p>
						)}
						{inquiryType === "schedule-meeting" && (
							<div>
								<p className='text-base md:text-2xl'>
									Navigate to our scheduling page here:
								</p>
								<Button
									className='button font-semibold py-4 md:py-6 px-6 md:px-8 text-base md:text-lg'
									variant='default'
									onClick={() => window.open(calendlyLink)}>
									Schedule a call with us!
								</Button>
							</div>
						)}
						<Button
							onClick={() => {
								handleStepChange(1);
								setInquiryType("");
								setFormData({
									name: "",
									email: "",
									organization: "",
									needs: "",
									timeline: "1",
									secondaryContact: "",
									orgDescription: "",
									primaryLocation: "",
									subdomain: "",
									billingAddress: "",
									hearAboutUs: "",
									audienceSize: "",
									budget: "1",
								});
							}}
							className='solid-button font-semibold py-4 md:py-6 px-6 md:px-8 text-base md:text-lg'>
							<RefreshCw className='w-4 h-4 md:w-5 md:h-5 mr-2' />
							Start Over
						</Button>
					</div>
				);
			default:
				return null;
		}
	};
	const formRef = useRef<HTMLDivElement>(null);
	const handleStepChange = (newStep: number) => {
		setStep(newStep);
		formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};
	
	return (
		<div id="contact" ref={formRef} className='container w-full mx-auto'>
			<style>{styles}</style>
			<div className='bg-[#FFFCF7] w-full p-2 sm:p-8 md:p-12 rounded-[32px]'>
				<form
					onSubmit={handleSubmit}
					className={`space-y-6 max-w-[800px] md:space-y-8 mx-auto lg:mt-6 text-[#232656] ${topMarginClass}`}>
					{renderStep()}
					
					{step > 1 && step <= getMaxSteps() && (
						<div>
							<StepCounter
								currentStep={step}
								maxSteps={getMaxSteps()}
								onStepClick={(clickedStep) => {
									if (clickedStep < step) {
										handleStepChange(clickedStep);
									}
								}}
							/>
							{siteKey && step === getMaxSteps() && (
								<div className="flex justify-center my-4">
									<div ref={turnstileFinalRef}></div>
								</div>
							)}
							{submitError && (
								<div className="text-red-500 text-sm pb-2">{submitError}</div>
							)}
							<div className='flex gap-4 align-middle center flex-row justify-between items-baseline md:pt-3 space-y-4 md:space-y-0'>
								<Button
									disabled={isLoading}
									type='button'
									variant='outline'
									onClick={() => handleStepChange(step - 1)}
									className='w-full md:w-auto dark:border-black/5 dark:bg-white text-black hover:bg-slate-200 rounded-full px-4 md:px-6 py-2 md:py-3 text-base md:text-lg'>
									Back
								</Button>
								<Button
									disabled={isLoading}
									type='submit'
									className='w-full md:w-auto solid-button font-semibold py-2 md:py-3 px-4 md:px-6 text-base md:text-lg'>
									{isLoading ? (
										<>
											<Loader2 className='w-4 h-4 md:w-5 md:h-5 animate-spin mr-2' />{" "}
											Sending...
										</>
									) : step < getMaxSteps() ? (
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
		</div>
	);
}

export default InquiryForm