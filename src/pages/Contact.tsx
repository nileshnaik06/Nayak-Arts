import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Instagram, Send, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';
import { toast } from 'sonner';
import { gsap } from '@/hooks/useGSAP';
import { sendContactForm } from '@/lib/api';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  subject: z.string().trim().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      const els = headerRef.current.querySelectorAll('[data-gsap]');
      gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }
    if (contentRef.current) {
      const left = contentRef.current.querySelector('[data-gsap-left]');
      const right = contentRef.current.querySelector('[data-gsap-right]');
      if (left) gsap.fromTo(left, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
      if (right) gsap.fromTo(right, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' });
    }
  }, [isSubmitted]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      await sendContactForm(data);
      setIsSubmitted(true);
      reset();
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-24 pb-20">
            <div className="gallery-container py-32 text-center" ref={headerRef}>
              <div data-gsap>
                <CheckCircle size={64} className="mx-auto text-gallery-sage" />
                <h1 className="mt-8 gallery-heading text-3xl md:text-4xl">Thank You!</h1>
                <p className="mt-4 gallery-body max-w-md mx-auto">
                  Your message has been received. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    reset();
                  }}
                  className="mt-8 inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-gallery-olive"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-20">
          {/* Header */}
          <section className="gallery-container py-16 text-center" ref={headerRef}>
            <div data-gsap>
              <span className="font-body text-sm uppercase tracking-[0.2em] text-gallery-terracotta">
                Get in Touch
              </span>
              <h1 className="mt-4 gallery-heading text-4xl md:text-5xl lg:text-6xl">
                Let's Create Together
              </h1>
              <p className="mt-6 max-w-2xl mx-auto gallery-body">
                Have a question, want to commission a piece, or just want to say hello? 
                I'd love to hear from you.
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="gallery-container" ref={contentRef}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Contact Info */}
              <div data-gsap-left className="space-y-8">
                <div>
                  <h2 className="font-display text-xl font-medium text-foreground mb-6">
                    Contact Information
                  </h2>
                  <ul className="space-y-6">
                    <li>
                      <a href="mailto:hello@artistry.com" className="flex items-start gap-4 group">
                        <div className="p-3 bg-secondary rounded-sm">
                          <Mail size={20} className="text-gallery-olive" />
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-1">Email</span>
                          <span className="text-foreground font-body group-hover:text-gallery-olive transition-colors">nayakarts@gmail.com</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-secondary rounded-sm">
                          <MapPin size={20} className="text-gallery-olive" />
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-1">Location</span>
                          <span className="text-foreground font-body">Chhattisgarh, India</span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                        <div className="p-3 bg-secondary rounded-sm">
                          <Instagram size={20} className="text-gallery-olive" />
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-1">Instagram</span>
                          <span className="text-foreground font-body group-hover:text-gallery-olive transition-colors">nayak.arts</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-secondary/50 rounded-sm">
                  <h3 className="font-display text-lg font-medium text-foreground mb-3">Commission Work</h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Interested in a custom piece? I accept commissions for thermocol sculptures, 
                    paintings, and mixed media works. Let's discuss your vision!
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div data-gsap-right className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-body text-foreground mb-2">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        {...register('name')}
                        className={`w-full px-4 py-3 bg-secondary/50 border ${errors.name ? 'border-destructive' : 'border-border'} rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                        placeholder="Your name" 
                      />
                      {errors.name && <p className="mt-1 text-sm text-destructive font-body">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-body text-foreground mb-2">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        {...register('email')}
                        className={`w-full px-4 py-3 bg-secondary/50 border ${errors.email ? 'border-destructive' : 'border-border'} rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                        placeholder="your@email.com" 
                      />
                      {errors.email && <p className="mt-1 text-sm text-destructive font-body">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-body text-foreground mb-2">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      {...register('subject')}
                      className={`w-full px-4 py-3 bg-secondary/50 border ${errors.subject ? 'border-destructive' : 'border-border'} rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                      placeholder="What's this about?" 
                    />
                    {errors.subject && <p className="mt-1 text-sm text-destructive font-body">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-body text-foreground mb-2">Message</label>
                    <textarea 
                      id="message" 
                      rows={6} 
                      {...register('message')}
                      className={`w-full px-4 py-3 bg-secondary/50 border ${errors.message ? 'border-destructive' : 'border-border'} rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none`}
                      placeholder="Tell me about your project or inquiry..." 
                    />
                    {errors.message && <p className="mt-1 text-sm text-destructive font-body">{errors.message.message}</p>}
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-gallery-olive shadow-soft hover:shadow-elevated disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
