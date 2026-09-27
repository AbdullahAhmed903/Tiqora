"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  Ticket,
  CreditCard,
  ShieldCheck,
  Trophy,
  Wrench,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileAttachmentZone } from "@/components/common/file-attachment-zone";
import { CONTACT_DEPARTMENTS, COUNTRY_CODES } from "@/lib/contact-data";
import { contactFormSchema } from "@/lib/validations/contact";
import { ContactDepartment } from "@/types/contact";

export function ContactForm() {
  // Form fields state
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("+20");
  const [department, setDepartment] = React.useState<ContactDepartment | "">("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [attachment, setAttachment] = React.useState<File | null>(null);

  // UI state
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedRef, setSubmittedRef] = React.useState("");
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Close department dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle department selection
  const handleDepartmentSelect = (deptId: ContactDepartment) => {
    setDepartment(deptId);
    setIsDeptDropdownOpen(false);
    if (errors.department) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.department;
        return next;
      });
    }
  };

  // Helper for department icon
  const getDepartmentIcon = (deptId: ContactDepartment | "") => {
    switch (deptId) {
      case "tickets":
        return <Ticket className="w-4 h-4 text-blue-400" />;
      case "payments":
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case "stadium":
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case "organizers":
        return <Trophy className="w-4 h-4 text-purple-400" />;
      case "technical":
        return <Wrench className="w-4 h-4 text-rose-400" />;
      case "general":
        return <HelpCircle className="w-4 h-4 text-cyan-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  // Validate form using Zod schema (reusing unified tokens from shared.ts)
  const validateForm = () => {
    const cleanPhone = phone.trim().replace(/[\s-]/g, "");
    const formattedPhone = cleanPhone
      ? cleanPhone.startsWith("+")
        ? cleanPhone
        : `${countryCode}${cleanPhone.replace(/^0+/, "")}`
      : "";

    const result = contactFormSchema.safeParse({
      fullName,
      email,
      phone: formattedPhone,
      department,
      subject: subject.trim() || undefined,
      message,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields marked below.");
      return;
    }

    setIsSubmitting(true);

    // Simulate network submission for UI demonstration
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const refCode = `TIQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRef(refCode);
      setIsSubmitted(true);

      toast.success(
        `Your inquiry has been received! Our support team will get back to you shortly.`,
        {
          description: `Reference Number: ${refCode}`,
          duration: 6000,
        }
      );
    } catch {
      toast.error("Failed to send message. Please try again or call our hotline.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setSubject("");
    setMessage("");
    setAttachment(null);
    setErrors({});
    setIsSubmitted(false);
    setSubmittedRef("");
  };

  const selectedDepartmentObj = CONTACT_DEPARTMENTS.find((d) => d.id === department);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative rounded-3xl p-6 sm:p-8 md:p-10 bg-zinc-900/90 dark:bg-[#0E1526]/90 border border-zinc-800 dark:border-zinc-800/80 shadow-2xl backdrop-blur-xl"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          /* ================= SUCCESS CONFIRMATION VIEW ================= */
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-8 sm:py-12 space-y-6"
          >
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            {/* Header text */}
            <div className="space-y-2 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                <span>Inquiry Submitted Successfully</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Thank You, {fullName.split(" ")[0]}!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Your message has been assigned to our{" "}
                <span className="text-white font-medium">
                  {selectedDepartmentObj?.label || "Support"}
                </span>{" "}
                team. You will receive an email confirmation and updates at{" "}
                <span className="text-blue-400 font-medium">{email}</span>.
              </p>
            </div>

            {/* Reference Card */}
            <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-left space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-2.5">
                <span>Inquiry Reference</span>
                <span className="font-mono font-bold text-blue-400">{submittedRef}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-2.5">
                <span>Department</span>
                <span className="text-zinc-200 font-medium">
                  {selectedDepartmentObj?.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-2.5">
                <span>Contact Phone</span>
                <span className="text-zinc-200 font-medium">
                  {countryCode} {phone}
                </span>
              </div>
              {attachment && (
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Attachment</span>
                  <span className="text-zinc-200 font-medium truncate max-w-[200px]">
                    {attachment.name}
                  </span>
                </div>
              )}
            </div>

            {/* Turnaround Guarantee */}
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Average response time during match days is under 15 minutes. For urgent stadium turnstile entry, please call our hotline.
            </p>

            {/* Reset Button */}
            <div className="pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={handleResetForm}
                className="gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Send Another Message</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          /* ================= MAIN INTERACTIVE FORM ================= */
          <form key="contact-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Fill out the form below and our team will get in touch with you promptly.
              </p>
            </div>

            {/* 1. Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-zinc-300"
                >
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.fullName;
                          return n;
                        });
                      }
                    }}
                    placeholder="e.g. Mohamed Salah"
                    className={`w-full bg-zinc-950/80 border ${
                      errors.fullName ? "border-rose-500/80 focus:border-rose-500" : "border-zinc-800 focus:border-[#2563EB]"
                    } rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-zinc-300"
                >
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.email;
                          return n;
                        });
                      }
                    }}
                    placeholder="e.g. mohamed@example.com"
                    className={`w-full bg-zinc-950/80 border ${
                      errors.email ? "border-rose-500/80 focus:border-rose-500" : "border-zinc-800 focus:border-[#2563EB]"
                    } rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 2. Phone Number & Department Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Phone Number with Country Code */}
              <div className="sm:col-span-6 space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-zinc-300"
                >
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Country Prefix Selector */}
                  <div className="relative shrink-0">
                    <select
                      aria-label="Country Code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-2.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone input */}
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.phone;
                            return n;
                          });
                        }
                      }}
                      placeholder="010 1234 5678"
                      className={`w-full bg-zinc-950/80 border ${
                        errors.phone ? "border-rose-500/80 focus:border-rose-500" : "border-zinc-800 focus:border-[#2563EB]"
                      } rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all`}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Department Dropdown / Selector */}
              <div className="sm:col-span-6 space-y-1.5" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-zinc-300">
                  Department / Issue Area <span className="text-rose-400">*</span>
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDeptDropdownOpen((prev) => !prev)}
                    className={`w-full bg-zinc-950/80 border ${
                      errors.department
                        ? "border-rose-500/80 focus:border-rose-500"
                        : "border-zinc-800 focus:border-[#2563EB]"
                    } rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getDepartmentIcon(department)}
                      <span
                        className={`truncate ${
                          selectedDepartmentObj ? "text-white font-medium" : "text-zinc-500"
                        }`}
                      >
                        {selectedDepartmentObj ? selectedDepartmentObj.label : "Select relevant department..."}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform ${
                        isDeptDropdownOpen ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDeptDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-30 left-0 right-0 mt-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-2 max-h-72 overflow-y-auto custom-scrollbar"
                      >
                        {CONTACT_DEPARTMENTS.map((dept) => {
                          const isSelected = department === dept.id;
                          return (
                            <button
                              key={dept.id}
                              type="button"
                              onClick={() => handleDepartmentSelect(dept.id)}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                                isSelected
                                  ? "bg-blue-600/15 border border-blue-500/30"
                                  : "hover:bg-zinc-900 border border-transparent"
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {getDepartmentIcon(dept.id)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div
                                  className={`text-xs sm:text-sm font-semibold ${
                                    isSelected ? "text-blue-400" : "text-white"
                                  }`}
                                >
                                  {dept.label}
                                </div>
                                <div className="text-[11px] text-zinc-400 leading-snug line-clamp-1">
                                  {dept.description}
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {errors.department && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.department}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 3. Subject Line */}
            <div className="space-y-1.5">
              <label
                htmlFor="subject"
                className="block text-xs font-semibold text-zinc-300"
              >
                Subject / Brief Summary{" "}
                <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Issue scanning QR ticket at Gate 4 - Cairo Derby match"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#2563EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>
            </div>

            {/* 4. Message Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-zinc-300"
                >
                  Message / Issue Details <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-zinc-500">{message.length}/1000</span>
              </div>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <textarea
                  id="message"
                  rows={4}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.message;
                        return n;
                      });
                    }
                  }}
                  placeholder="Please describe your problem or question in detail. Mention any match name, booking reference ID, or stadium gate if relevant..."
                  className={`w-full bg-zinc-950/80 border ${
                    errors.message ? "border-rose-500/80 focus:border-rose-500" : "border-zinc-800 focus:border-[#2563EB]"
                  } rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all resize-y min-h-[110px]`}
                />
              </div>
              {errors.message && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* 5. Separate Reusable File Attachment Zone Component */}
            <FileAttachmentZone
              file={attachment}
              onFileChange={setAttachment}
              label="Attach Picture or File"
              helperText="Screenshots, tickets, receipts, or PDF docs"
            />

            {/* 6. Submit Button & Security Note */}
            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full justify-center shadow-lg shadow-blue-600/25 cursor-pointer py-3.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Send Message to Support</span>
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Your contact details are encrypted and securely stored.</span>
              </div>
            </div>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
