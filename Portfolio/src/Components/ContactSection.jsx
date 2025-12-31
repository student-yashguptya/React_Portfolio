import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";


export const ContactSection = () => {
  
  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Get In <span className="text-primary">Touch</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Feel free to reach out.
          I'm always open to discussing new opportunities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
  <div className="space-y-8">
    <h3 className="text-2xl font-semibold mb-6">
      Contact Information
    </h3>

    <div className="space-y-6 justify-center">
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-base font-medium">Email</p>
          <a
            href="mailto:gyash6328@example.com"
            className="text-muted-foreground hover:underline"
          >
            gyash6328@example.com
          </a>
        </div>
      </div> 
       <div className="flex items-start space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-base font-medium">Phone</p>
          <a
            href="tel:919520102418"
            className="text-muted-foreground hover:underline"
          >
            (+91) 9520102418
          </a>
        </div>
      </div>
       <div className="flex items-start space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-base font-medium">Location</p>
          <a
            className="text-muted-foreground hover:underline"
          >
            Bareilly, Uttar Pradesh, India
          </a>
        </div>
      </div>
    </div>
    <div className="pt-8">
  <h4 className="font-medium mb-4">Connect With Me</h4>
  <div className="flex space-x-4 justify-center">
    <a href="https://www.linkedin.com/in/yash-gupta-4178062a8/" target="_blank" rel="noopener noreferrer">
      <Linkedin />
    </a>
    
    <a href="https://www.instagram.com/yash.gupta6/?next=%2F&hl=en" target="_blank" rel="noopener noreferrer">
      <Instagram />
    </a>
  </div>
  </div>
  </div>
  <div className="bg-card p-8 rounded-lg shadow-xs">
  <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
  <form className="space-y-6">
    <div>
      <label htmlFor="name" className='block text-sm font-medium mb-2'>
        Your Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
        placeholder="Enter your name"
        required
      />
    </div>
    <div>
      <label htmlFor="email" className='block text-sm font-medium mb-2'>
        Your Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
        placeholder="Enter your Email"
        required
      />
    </div>
    <div>
      <label htmlFor="message" className='block text-sm font-medium mb-2'>
        Your Message
      </label>
      <textarea
        id="message"
        name="message"
        className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
        placeholder="Enter your massage"
        required
      />
    </div>
   <button
                type="submit"
                
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2"
                )}
              >
                <Send size={16} />
              </button>

  </form>
</div>

</div>
</div>
    </section>
  );
};
