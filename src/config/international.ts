/** Separate endpoint avoids silently changing the existing appointment API contract.
 * Accepts POST JSON: name,email,phone,country,timezone,treatment,time,consent,mode,
 * and arrival/departure/flexible for visit mode. A 2xx response must mean accepted delivery.
 * No endpoint: explicit, user-confirmed WhatsApp handoff; never simulated delivery.
 */
export const international = {
  endpoint: (import.meta.env?.VITE_INTERNATIONAL_ENDPOINT ||
    null) as string | null,
  faqs: [
    {
      question: "Can I arrange an online consultation before travelling?",
      answer:
        "You can request an initial online discussion to explain your goals and plans. The team will contact you to arrange availability and explain any consultation fee before you proceed. Final treatment recommendations require a clinical assessment.",
    },
    {
      question: "How do you coordinate different time zones?",
      answer:
        "Include your city or time zone and preferred contact time in your enquiry. Clinic opening hours are shown in Pakistan time (PKT, UTC+5); the team will agree a suitable time with you.",
    },
    {
      question: "Can I receive an estimate before I travel?",
      answer:
        "Discuss your treatment interest with the team. Any initial estimate is provisional; the final plan and fees depend on assessment and any investigations required.",
    },
    {
      question: "Can my treatment fit into a short stay?",
      answer:
        "Some treatments involve several visits, laboratory work, healing or follow-up. Tell us your proposed travel dates so the team can discuss a realistic provisional schedule. Completion within a fixed stay cannot be guaranteed.",
    },
    {
      question: "What about follow-up after I return home?",
      answer:
        "Discuss follow-up arrangements with your clinician before starting treatment or booking return travel. The appropriate plan depends on your treatment and individual needs.",
    },
    {
      question: "When is my appointment confirmed?",
      answer:
        "Submitting an enquiry does not reserve an appointment. The clinic team will contact you to confirm a suitable time and the next steps.",
    },
  ],
}
