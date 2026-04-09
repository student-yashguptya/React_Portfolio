import { motion } from "framer-motion";
import { ExternalLink, Rocket, Cpu, BarChart3, Globe } from "lucide-react";
import styled from "styled-components";
import {
  staggerContainer,
  fadeUp,
  headingReveal,
  dividerReveal,
  slideFromLeft,
  slideFromRight,
} from "../lib/animations";

export const CompanySection = () => {
  return (
    <section id="company" className="bg-black py-16 sm:py-20 md:py-24 text-white overflow-hidden">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mx-auto max-w-6xl"
        >
          {/* Section Header */}
          <div className="overflow-hidden mb-3 sm:mb-4">
            <motion.h2
              variants={headingReveal}
              className="text-center text-2xl sm:text-3xl font-normal md:text-5xl"
            >
              Co-Founder @ Katalyx Solutions
            </motion.h2>
          </div>

          <motion.div
            variants={dividerReveal}
            className="section-divider mx-auto mb-8 max-w-xs"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Branding & Mission */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div variants={slideFromLeft} className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
                  <Rocket size={16} className="text-emerald-400" />
                  Founded January 2025
                </div>
                <h3 className="text-3xl md:text-4xl font-medium leading-tight">
                  Building Future-Ready <br />
                  <span className="text-emerald-400">Digital Infrastructure.</span>
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                  At Katalyx, we believe digital transformation should be seamless and secure — 
                  powered by intelligent, real-time AI, not inefficiency or manual bottlenecks. 
                  We build AI-powered software, automation systems, and scalable platforms.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Cpu,
                    title: "AI & Automation",
                    desc: "Replacing legacy systems with intelligent, scalable AI layers."
                  },
                  {
                    icon: BarChart3,
                    title: "Scale Smarter",
                    desc: "Enabling businesses to grow rapidly with robust infrastructure."
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <item.icon size={24} className="text-emerald-400 mb-4" />
                    <h4 className="text-lg font-medium mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp} className="pt-4">
                <motion.a
                  href="https://katalyxsolutions.com"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-shimmer inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-medium text-black shadow-2xl shadow-emerald-500/10"
                >
                  Visit Company Website <ExternalLink size={18} />
                </motion.a>
              </motion.div>
            </div>

            {/* Right Column: Interactive Card / Visual */}
            <motion.div 
              variants={slideFromRight}
              className="lg:col-span-5 relative"
            >
              <StyledCard>
                <div className="card-inner p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                      <Globe size={24} className="text-emerald-400 transition-transform duration-500 group-hover:rotate-12" />
                    </div>
                    <span className="text-xs font-mono text-emerald-400/60 tracking-widest uppercase">Identity</span>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <h4 className="text-xl font-medium">Digital Innovation Partner</h4>
                    <div className="space-y-3">
                      {[
                        "Enterprise-Grade Scalability",
                        "Outcome-Oriented Development",
                        "Strategic Global Partnerships",
                        "AI-Powered Operational Efficiency"
                      ].map((text, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                          <div className="h-1 w-1 rounded-full bg-emerald-400" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Vision 2026</span>
                      <span>Global Expansion</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Visual Glows */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              </StyledCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const StyledCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  backdrop-filter: blur(12px);
  position: relative;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(16, 185, 129, 0.3);
    transform: translateY(-5px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;
