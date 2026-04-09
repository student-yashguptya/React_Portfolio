import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import {
  Instagram, Linkedin, Mail, MapPin, Phone, Send, Github,
} from "lucide-react";
import {
  staggerContainer, fadeUp, fadeUpSm, headingReveal, dividerReveal,
  slideFromLeft, slideFromRight,
} from "../lib/animations";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "gyash6328@gmail.com",
    href: "mailto:gyash6328@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9520102418",
    href: "tel:+919520102418",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "A-138 Suresh Sharma Nagar Pilibhit Bypass road, Bareilly",
    href: null,
  },
];

const socials = [
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/yash-gupta-4178062a8/",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "https://github.com/yashgupta6",
    label: "GitHub",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/yash.gupta6/?next=%2F&hl=en",
    label: "Instagram",
  },
];

export const ContactSection = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

    emailjs
      .sendForm(serviceId, templateId, form.current, { publicKey })
      .then(
        () => {
          setIsSubmitting(false);
          setSubmitStatus("success");
          form.current.reset();
          setTimeout(() => setSubmitStatus(null), 5000);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setIsSubmitting(false);
          setSubmitStatus("error");
        }
      );
  };

  return (
    <section id="contact" className="bg-black py-16 sm:py-20 md:py-24 text-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="mx-auto max-w-6xl"
        >
          <div className="overflow-hidden mb-3 sm:mb-4">
            <motion.h2
              variants={headingReveal}
              className="text-center text-2xl sm:text-3xl font-normal md:text-5xl"
            >
              Get In Touch
            </motion.h2>
          </div>

          <motion.div variants={dividerReveal} className="section-divider mx-auto mb-5 max-w-xs" />

          <motion.p
            variants={fadeUpSm}
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Have a project in mind or want to collaborate? Let&apos;s connect.
          </motion.p>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Contact info */}
            <motion.div
              variants={slideFromLeft}
              className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8"
            >
              <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-medium">
                Contact Information
              </h3>

              <div className="space-y-4 sm:space-y-5">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3 sm:gap-4">
                      <div className="icon-box rounded-lg border border-white/20 p-2 flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-300">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm sm:text-base font-medium break-all transition-colors duration-300 hover:text-gray-300"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm sm:text-base font-medium break-all">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 sm:mt-8">
                <h4 className="mb-3 text-xs sm:text-sm text-gray-300">
                  Connect With Me
                </h4>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      title={`Visit ${label} profile`}
                      aria-label={label}
                      whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border border-white/20 p-2 transition-colors duration-300"
                    >
                      <Icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              variants={slideFromRight}
              className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8"
            >
              <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-medium">
                Send a Message
              </h3>
              <form ref={form} onSubmit={sendEmail} className="space-y-4 sm:space-y-5">
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-green-400 text-sm"
                  >
                    Message sent successfully! I will get back to you soon.
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm"
                  >
                    Failed to send message. Please try again or email me directly.
                  </motion.div>
                )}

                {[
                  { id: "user_name", label: "Your Name", type: "text", placeholder: "Enter your name" },
                  { id: "user_email", label: "Your Email", type: "email", placeholder: "Enter your email" },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-2 block text-xs sm:text-sm text-gray-300">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      placeholder={field.placeholder}
                      className="input-glow w-full rounded-lg border border-white/20 bg-black/40 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="mb-2 block text-xs sm:text-sm text-gray-300">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Enter your message"
                    className="input-glow w-full resize-none rounded-lg border border-white/20 bg-black/40 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                  transition={{ duration: 0.18 }}
                  className={`btn-shimmer inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-black ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : <><span>Send Message</span><Send size={16} /></>}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};