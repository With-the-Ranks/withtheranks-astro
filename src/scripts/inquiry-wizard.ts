const CALENDLY = "https://calendly.com/with-the-ranks/team-meeting";

type Flow = "new-project" | "spoke-services" | "general-contact" | "schedule-meeting";

const FLOW_MAX: Partial<Record<Flow, number>> = {
	"new-project": 4,
	"spoke-services": 4,
	"general-contact": 2,
};

const THANK_YOU_STEP = 5;
/** First wizard step with fields (intro step 1 removed site-wide). */
const FIRST_STEP = 2;

function maxSteps(flow: Flow): number {
	return FLOW_MAX[flow] ?? 1;
}

const qs = (root: HTMLElement | Document, sel: string) => root.querySelector(sel) as HTMLElement | null;
const qsa = (root: HTMLElement, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

const openCalendly = () => window.open(CALENDLY, "_blank", "noopener,noreferrer");

const smoothScrollTo = (el: Element) =>
	el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

function setDotState(dot: HTMLElement, active: boolean, done: boolean) {
	dot.dataset.state = active ? "active" : done ? "done" : "pending";
}

function setFlowFields(root: HTMLElement, flow: Flow) {
	const hidden = qs(root, "[data-inquiry-type-field]");
	if (hidden instanceof HTMLInputElement) hidden.value = flow;
}

function collectParams(form: HTMLFormElement): URLSearchParams {
	const p = new URLSearchParams();
	for (const [k, v] of new FormData(form).entries()) if (typeof v === "string") p.set(k, v);
	return p;
}

function clearBodyFields(form: HTMLFormElement) {
	for (const el of form.querySelectorAll("input, textarea, select")) {
		if ((el as HTMLInputElement).name === "inquiryType") continue;
		if (el instanceof HTMLSelectElement) {
			el.selectedIndex = 0;
			continue;
		}
		if (el instanceof HTMLTextAreaElement) {
			el.value = "";
			continue;
		}
		const i = el as HTMLInputElement;
		if (i.type === "checkbox" || i.type === "radio") {
			i.checked = false;
			continue;
		}
		if (i.type === "range") {
			i.value = "1";
			i.dispatchEvent(new Event("input", { bubbles: true }));
			continue;
		}
		i.value = "";
	}
}

function syncThankYou(root: HTMLElement, flow: Flow) {
	qs(root, "[data-thank-normal]")?.classList.toggle("hidden", flow === "schedule-meeting");
	qs(root, "[data-thank-schedule]")?.classList.toggle("hidden", flow !== "schedule-meeting");
}

function updateDisabledFields(root: HTMLElement) {
	for (const el of root.querySelectorAll("input, select, textarea")) {
		const inp = el as HTMLInputElement;
		if (inp.name === "inquiryType") continue;
		const stepPanel = inp.closest("[data-wizard-step]");
		let dis = false;
		if (stepPanel) {
			dis = stepPanel.classList.contains("hidden");
			const inner = inp.closest("[data-step3-for], [data-step4-for]");
			if (inner?.classList.contains("hidden")) dis = true;
		}
		inp.disabled = !!stepPanel && dis;
	}
}

function validateActiveStep(root: HTMLElement, step: number): boolean {
	const panel = qs(root, `[data-wizard-step="${step}"]`);
	if (!panel || panel.classList.contains("hidden")) return true;
	for (const el of qsa(panel, "input, select, textarea")) {
		const f = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
		if (f.disabled || f.name === "inquiryType") continue;
		if (!f.checkValidity()) {
			f.reportValidity();
			return false;
		}
	}
	return true;
}

function updateStepPanels(root: HTMLElement, step: number) {
	for (const el of qsa(root, "[data-wizard-step]")) {
		const s = Number.parseInt(el.dataset.wizardStep ?? "-1", 10);
		if (s >= 0) el.classList.toggle("hidden", s !== step);
	}
	updateDisabledFields(root);
}

function updateFooter(root: HTMLElement, step: number, flow: Flow) {
	const footer = qs(root, "[data-inquiry-footer]");
	if (!footer) return;
	const mx = maxSteps(flow);
	footer.classList.toggle("hidden", step <= 1 || step > mx);
}

function updateBackButton(root: HTMLElement, step: number) {
	const back = qs(root, "[data-inquiry-back]");
	const row = qs(root, "[data-inquiry-footer-row]");
	if (!back) return;
	const atFirst = step <= FIRST_STEP;
	back.classList.toggle("hidden", atFirst);
	back.setAttribute("aria-hidden", atFirst ? "true" : "false");
	back.style.display = atFirst ? "none" : "";
	if (row && row.dataset.footerSpoke !== "true") {
		row.classList.toggle("justify-between", !atFirst);
		row.classList.toggle("justify-end", atFirst);
	}
}

function updateDots(root: HTMLElement, step: number, flow: Flow) {
	const row = qs(root, "[data-step-dots]");
	if (!row) return;

	if (row.dataset.stepDotsMode === "spoke-signup") {
		if (step <= 2) {
			row.classList.add("hidden");
			return;
		}
		row.classList.remove("hidden");
		const activeIndex = step - 1;
		for (const dot of qsa(row, "[data-dot-index]")) {
			const i = Number.parseInt(dot.dataset.dotIndex ?? "0", 10);
			setDotState(dot, i === activeIndex, i < activeIndex);
			dot.classList.remove("hidden");
		}
		const spokeSegs = qsa(row, "[data-dot-seg]");
		for (let i = 0; i < spokeSegs.length; i++) {
			spokeSegs[i].dataset.state = activeIndex > i + 1 ? "done" : "pending";
			spokeSegs[i].classList.remove("hidden");
		}
		return;
	}

	const mx = maxSteps(flow);
	for (const dot of qsa(row, "[data-dot-index]")) {
		const i = Number.parseInt(dot.dataset.dotIndex ?? "0", 10);
		dot.classList.toggle("hidden", i > mx);
		if (i <= mx) setDotState(dot, i === step, i < step);
	}
	const segs = qsa(row, "[data-dot-seg]");
	for (let i = 0; i < segs.length; i++) {
		const idx = i + 1;
		segs[i].classList.toggle("hidden", idx >= mx);
		if (idx < mx) segs[i].dataset.state = i < step - 1 ? "done" : "pending";
	}
}

function setInquiryPrimaryPart(el: Element | null, visible: boolean) {
	if (!(el instanceof HTMLElement)) return;
	if (visible) {
		el.classList.remove("hidden");
		el.removeAttribute("hidden");
		el.style.removeProperty("display");
	} else {
		el.classList.add("hidden");
		el.setAttribute("hidden", "");
		el.style.setProperty("display", "none", "important");
	}
}

function updatePrimaryLabel(root: HTMLElement, step: number, flow: Flow, loading: boolean) {
	const submitBtn = qs(root, "[data-inquiry-submit]") as HTMLButtonElement | null;
	if (!submitBtn) return;
	const nextL = submitBtn.querySelector("[data-label-next]");
	const subL = submitBtn.querySelector("[data-label-submit]");
	const sendL = submitBtn.querySelector("[data-label-sending]");
	if (loading) {
		submitBtn.disabled = true;
		setInquiryPrimaryPart(nextL, false);
		setInquiryPrimaryPart(subL, false);
		setInquiryPrimaryPart(sendL, true);
		return;
	}
	submitBtn.disabled = false;
	setInquiryPrimaryPart(sendL, false);
	const mx = maxSteps(flow);
	const onNext = step < mx;
	setInquiryPrimaryPart(nextL, onNext);
	setInquiryPrimaryPart(subL, !onNext);
}

function bindRangeLabels(root: HTMLElement) {
	for (const r of qsa(root, "input[type=range][data-range-labels]")) {
		const labels = (r.dataset.rangeLabels ?? "").split("|");
		const out = qs(root, `[data-range-output="${r.id}"]`);
		const tick = () => {
			const v = Number.parseInt((r as HTMLInputElement).value, 10) || 1;
			if (out) out.textContent = labels[v - 1] ?? "";
		};
		r.addEventListener("input", tick);
		tick();
	}
}

function scrollTarget(root: HTMLElement) {
	if (root.dataset.inquiryDisableScroll === "true") return;
	const signupSection = root.closest("#signup");
	if (signupSection) return smoothScrollTo(signupSection);
	const el = qs(root, "[data-inquiry-scroll-target]");
	if (el) smoothScrollTo(el);
}

function syncOneSignupFilled(wrap: HTMLElement) {
	const control = wrap.querySelector(":scope > input, :scope > textarea, :scope > select");
	if (
		!(control instanceof HTMLInputElement) &&
		!(control instanceof HTMLTextAreaElement) &&
		!(control instanceof HTMLSelectElement)
	) {
		return;
	}
	wrap.toggleAttribute("data-filled", control.value.trim() !== "");
}

function syncSignupFieldFilled(root: HTMLElement) {
	for (const wrap of qsa(root, "[data-inquiry-signup-field]")) syncOneSignupFilled(wrap);
}

function hubHideAllPanels(root: HTMLElement) {
	for (const p of qsa(root, "[data-inquiry-hub-panel]")) p.classList.add("hidden");
}

function hubShowChooser(root: HTMLElement) {
	hubHideAllPanels(root);
	qs(root, "[data-inquiry-hub-chooser]")?.classList.remove("hidden");
}

function initSingleRoot(root: HTMLElement) {
	if (root.dataset.inquiryInited === "true") return;
	root.dataset.inquiryInited = "true";

	const form = qs(root, "[data-inquiry-form]") as HTMLFormElement | null;
	if (!form) return;

	const flow = (root.dataset.inquiryFlow ?? "") as Flow;
	const compact = root.dataset.inquiryCompact === "true";
	let step = FIRST_STEP;
	let loading = false;
	let skipScrollOnce = true;

	const render = () => {
		setFlowFields(root, flow);
		syncThankYou(root, flow);
		updateStepPanels(root, step);
		updateFooter(root, step, flow);
		updateBackButton(root, step);
		updateDots(root, step, flow);
		updatePrimaryLabel(root, step, flow, loading);
		syncSignupFieldFilled(root);
		if (skipScrollOnce) skipScrollOnce = false;
		else scrollTarget(root);
	};

	const go = (next: number) => {
		step = next;
		render();
	};

	render();
	bindRangeLabels(root);

	const onSignupFieldChange = (e: Event) => {
		const t = e.target;
		if (t instanceof HTMLElement) {
			const wrap = t.closest("[data-inquiry-signup-field]");
			if (wrap instanceof HTMLElement) {
				syncOneSignupFilled(wrap);
				return;
			}
		}
		syncSignupFieldFilled(root);
	};
	root.addEventListener("input", onSignupFieldChange);
	root.addEventListener("change", onSignupFieldChange);
	form.addEventListener("reset", () => queueMicrotask(() => syncSignupFieldFilled(root)));

	root.addEventListener("inquiry:reset", () => {
		form.reset();
		step = FIRST_STEP;
		render();
	});

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (loading || !validateActiveStep(root, step)) return;
		if (step < maxSteps(flow)) {
			go(step + 1);
			return;
		}
		if (step > maxSteps(flow)) return;

		loading = true;
		updatePrimaryLabel(root, step, flow, loading);
		setFlowFields(root, flow);
		try {
			const res = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: collectParams(form).toString(),
			});
			const result = (await res.json()) as { success?: boolean; error?: string };
			if (result.success) {
				clearBodyFields(form);
				setFlowFields(root, flow);
				go(THANK_YOU_STEP);
			} else throw new Error(result.error ?? "Unknown error");
		} catch (err) {
			console.error("Email submission failed:", err);
		} finally {
			loading = false;
			updatePrimaryLabel(root, step, flow, loading);
		}
	});

	qs(root, "[data-inquiry-back]")?.addEventListener("click", () => {
		if (step > FIRST_STEP) go(step - 1);
	});

	qs(root, "[data-inquiry-start-over]")?.addEventListener("click", () => {
		form.reset();
		step = FIRST_STEP;
		render();
		if (compact) root.dispatchEvent(new CustomEvent("inquiry:compact-close", { bubbles: true }));
	});

	qs(root, "[data-calendly-open]")?.addEventListener("click", openCalendly);
}

function initHubRoot(root: HTMLElement) {
	if (root.dataset.inquiryHubInited === "true") return;
	root.dataset.inquiryHubInited = "true";

	for (const btn of qsa(root, "[data-pick-flow]")) {
		btn.addEventListener("click", () => {
			const f = btn.dataset.pickFlow as Flow;
			if (f === "schedule-meeting") return openCalendly();
			hubHideAllPanels(root);
			qs(root, "[data-inquiry-hub-chooser]")?.classList.add("hidden");
			qs(root, `[data-inquiry-hub-panel="${f}"]`)?.classList.remove("hidden");
		});
	}

	for (const b of qsa(root, "[data-inquiry-hub-back]")) b.addEventListener("click", () => hubShowChooser(root));
}

function boot() {
	document.querySelectorAll<HTMLElement>("[data-inquiry-root][data-inquiry-single]").forEach(initSingleRoot);
	document.querySelectorAll<HTMLElement>("[data-inquiry-hub]").forEach(initHubRoot);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
