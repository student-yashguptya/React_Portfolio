import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
} from "lucide-react";

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

export const ContactSection = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Requires environment variables. Fallback placeholders show the needed setup in Vercel.
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

    emailjs
      .sendForm(serviceId, templateId, form.current, {
        publicKey: publicKey,
      })
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mx-auto max-w-6xl"
        >
          <motion.h2 variants={itemVariants} className="mb-3 sm:mb-4 text-center text-2xl sm:text-3xl font-normal md:text-5xl">
            Get In Touch
          </motion.h2>

          <motion.p variants={itemVariants} className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300">
            Have a project in mind or want to collaborate? Let&apos;s connect.
          </motion.p>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            <motion.div variants={itemVariants} className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8">
              <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-medium">
                Contact Information
              </h3>

              <div className="space-y-4 sm:space-y-5">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-lg border border-white/20 p-2 flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-300">
                          {item.label}
                        </p>
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
                  <a
                    href="https://www.linkedin.com/in/yash-gupta-4178062a8/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/20 p-2 transition-colors duration-300 hover:bg-white hover:text-black"
                    title="Visit LinkedIn profile"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="https://github.com/yashgupta6"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/20 p-2 transition-colors duration-300 hover:bg-white hover:text-black"
                    title="Visit GitHub profile"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/yash.gupta6/?next=%2F&hl=en"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/20 p-2 transition-colors duration-300 hover:bg-white hover:text-black"
                    title="Visit Instagram profile"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8">
              <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-medium">
                Send a Message
              </h3>
              <form ref={form} onSubmit={sendEmail} className="space-y-4 sm:space-y-5">
                {submitStatus === "success" && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-green-400 text-sm">
                    Message sent successfully! I will get back to you soon.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm">
                    Failed to send message. Please try again later or email me directly.
                  </div>
                )}
                <div>
                  <label
                    htmlFor="user_name"
                    className="mb-2 block text-xs sm:text-sm text-gray-300"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-white/20 bg-black/40 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-gray-400 focus:border-white/50 focus:outline-none transition-colors duration-300"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="user_email"
                    className="mb-2 block text-xs sm:text-sm text-gray-300"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-white/20 bg-black/40 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-gray-400 focus:border-white/50 focus:outline-none transition-colors duration-300"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs sm:text-sm text-gray-300"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Enter your message"
                    className="w-full resize-none rounded-lg border border-white/20 bg-black/40 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-gray-400 focus:border-white/50 focus:outline-none transition-colors duration-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-black transition-colors duration-300 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
                  }`}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
