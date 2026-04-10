import { useState, useRef } from "react";
import styled from "styled-components";
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
    href: "https://github.com/student-yashguptya",
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
            Looking to collaborate on a high-impact project or discuss digital 
            transformation? Let&apos;s build the future together.
          </motion.p>
          {/* OLD SUBTITLE:
          <motion.p
            variants={fadeUpSm}
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Have a project in mind or want to collaborate? Let&apos;s connect.
          </motion.p>
          */}

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
                <StyledWrapper>
                  <ul className="social-list">
                    {socials.map(({ icon: Icon, href, label }) => (
                      <li key={label} className="iso-pro">
                        <span />
                        <span />
                        <span />
                        <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                          <div className="svg">
                            <Icon size={24} />
                          </div>
                        </a>
                        <div className="text">{label}</div>
                      </li>
                    ))}
                  </ul>
                </StyledWrapper>
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
                  className={`btn-shimmer btn-premium bg-white w-full flex items-center justify-center gap-2 px-10 py-4 text-sm font-medium text-black ${
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

const StyledWrapper = styled.div`
  .social-list {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .social-list li {
    cursor: pointer;
  }

  .iso-pro {
    position: relative;
    transition: 0.5s;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: visible;
  }

  .iso-pro a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 10;
    overflow: visible;
  }

  .svg {
    transition: all 0.3s;
    height: 60px;
    width: 60px;
    border-radius: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Adhering to the theme: glass effect instead of orange */
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05),
      inset 0 0 5px rgba(255, 255, 255, 0.1), 0 5px 5px rgba(0, 0, 0, 0.164);
  }

  .text {
    opacity: 0;
    border-radius: 5px;
    padding: 5px 10px;
    transition: all 0.3s;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: absolute;
    z-index: 9999;
    box-shadow: -5px 0 1px rgba(153, 153, 153, 0.1),
      -10px 0 1px rgba(153, 153, 153, 0.05),
      inset 0 0 10px rgba(255, 255, 255, 0.1), 0 5px 5px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  /* Isometric projection */
  .iso-pro:hover a > .svg {
    transform: translate(15px, -15px);
    border-radius: 100%;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .iso-pro:hover .text {
    opacity: 1;
    transform: translate(25px, -2px) skew(-5deg);
  }

  .iso-pro span {
    opacity: 0;
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1),
      inset 0 0 5px rgba(255, 255, 255, 0.2), 0 5px 5px rgba(0, 0, 0, 0.164);
    border-radius: 50%;
    transition: all 0.3s;
    height: 60px;
    width: 60px;
    pointer-events: none;
  }

  .iso-pro:hover span {
    opacity: 1;
  }

  .iso-pro:hover span:nth-child(1) {
    opacity: 0.2;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .iso-pro:hover span:nth-child(2) {
    opacity: 0.4;
    transform: translate(5px, -5px);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .iso-pro:hover span:nth-child(3) {
    opacity: 0.6;
    transform: translate(10px, -10px);
    border-color: rgba(255, 255, 255, 0.6);
  }
`;