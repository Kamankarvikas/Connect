

import React, { useState } from 'react';
import Button from '../shared/Button';
import { GoogleIcon, WhatsAppIcon, TemplateIcon, BranchIcon, UsersGroupIcon, WalletIcon, SparklesIcon, ChevronDownIcon, CheckCircleIcon } from '../Icons';

interface LandingPageProps {
  onNavigateToAuth: () => void;
}

// Sub-components defined within the main file for simplicity

const Header: React.FC<{ onNavigateToAuth: () => void }> = ({ onNavigateToAuth }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-stone-800 tracking-tight">
            <span className="text-emerald-600">Agro</span><span className="text-amber-500">BEET</span> Connect
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {/* Nav items removed as per request */}
        </nav>
        <Button variant="outline" onClick={onNavigateToAuth}>
          Login
        </Button>
      </div>
    </header>
  );
};

const HeroSection: React.FC<{ onNavigateToAuth: () => void }> = ({ onNavigateToAuth }) => {
  return (
    <section 
      className="relative bg-cover bg-center min-h-screen flex items-center" 
      style={{backgroundImage: "url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1920')"}}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Reach, Engage, and Grow Your <span className="text-emerald-400">Agricultural Network</span>.
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-stone-200">
            The ultimate communication platform for agribusiness. Launch targeted campaigns on WhatsApp, SMS, and in-app to build stronger relationships with farmers.
          </p>
          <div className="mt-8">
            <Button className="px-8 py-4 text-lg bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onNavigateToAuth}>
              Get Started for Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const features = [
    { icon: <WhatsAppIcon className="w-8 h-8 text-emerald-600" />, title: "Multi-Channel Outreach", description: "Engage your audience on the platforms they use most: WhatsApp, SMS, and your own app." },
    { icon: <TemplateIcon className="w-8 h-8 text-blue-600" />, title: "Intuitive Template Builder", description: "Craft beautiful, reusable message templates with our live WhatsApp preview and easy-to-use editor." },
    { icon: <BranchIcon className="w-8 h-8 text-amber-600" />, title: "Powerful Automations", description: "Set up welcome messages, follow-ups, and more with our visual workflow builder. Save time and engage customers 24/7." },
    { icon: <UsersGroupIcon className="w-8 h-8 text-indigo-600" />, title: "Smart Audience Segmentation", description: "Send the right message to the right people. Group your contacts based on their behavior and profile." },
    { icon: <WalletIcon className="w-8 h-8 text-slate-600" />, title: "Wallet & Analytics", description: "Manage your budget with a clear, simple wallet system and gain actionable insights from your campaign performance." },
    { icon: <SparklesIcon className="w-8 h-8 text-pink-600" />, title: "AI-Powered Insights", description: "Leverage Gemini AI to analyze your spending patterns and get actionable recommendations for your campaigns." },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-stone-800">Everything You Need to Grow</h3>
          <p className="mt-2 text-stone-600">A powerful suite of tools for modern agricultural communication.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-stone-50/80 p-6 rounded-xl border border-stone-200/60 hover:shadow-lg hover:border-emerald-300 transition-all duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold text-stone-800 mb-2">{feature.title}</h4>
              <p className="text-stone-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection: React.FC = () => {
    const steps = [
        { number: 1, title: "Connect Your Channels", description: "Securely link your WhatsApp Business, SMS gateways, or mobile app in just a few clicks." },
        { number: 2, title: "Create Your Message", description: "Use our powerful template builder with live previews to design engaging messages." },
        { number: 3, title: "Launch & Automate", description: "Send your campaign immediately or schedule it. Set up automated workflows to engage contacts 24/7." }
    ];
    return (
        <section id="how-it-works" className="py-20 bg-stone-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-stone-800">Get Started in 3 Simple Steps</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {index < steps.length - 1 && <div className="hidden md:block absolute top-1/2 left-full transform -translate-y-1/2 w-full h-px bg-stone-300 border-t-2 border-dashed"></div>}
                            <div className="bg-white p-8 rounded-xl shadow-md border border-stone-200/60 h-full">
                                <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-600 font-bold text-xl rounded-full">
                                    {step.number}
                                </div>
                                <h4 className="text-xl font-semibold text-stone-800 mb-2">{step.title}</h4>
                                <p className="text-stone-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const testimonials = [
    { quote: "AgroBEET Connect has transformed how we communicate with our farmers. The template builder is a lifesaver, and we've seen a 20% increase in engagement since we started.", author: "J. Appleseed", company: "Appleseed Farms", avatar: "https://picsum.photos/seed/farmer1/100/100" },
    { quote: "The automation feature for new subscribers is fantastic. It's set-it-and-forget-it, ensuring every new contact gets a warm welcome and our latest offers.", author: "Maria Garcia", company: "Greenfield Co-op", avatar: "https://picsum.photos/seed/farmer2/100/100" },
    { quote: "Finally, a platform that understands the agricultural sector. The analytics are clear and help us decide where to put our marketing budget next season.", author: "Sandeep Singh", company: "Punjab Growers", avatar: "https://picsum.photos/seed/farmer3/100/100" },
];

const TestimonialsSection: React.FC = () => {
    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-stone-800">Trusted by Farmers and Agribusinesses</h3>
                    <p className="mt-2 text-stone-600">Here's what our customers are saying.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                         <div key={index} className="bg-stone-50/80 p-8 rounded-xl shadow-sm border border-stone-200/60 flex flex-col">
                            <p className="text-stone-600 italic flex-grow">"{testimonial.quote}"</p>
                            <div className="flex items-center mt-6">
                                <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full"/>
                                <div className="ml-4">
                                    <p className="font-semibold text-stone-800">{testimonial.author}</p>
                                    <p className="text-sm text-stone-500">{testimonial.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const PricingSection: React.FC<{ onNavigateToAuth: () => void }> = ({ onNavigateToAuth }) => {
    const plans = [
        { name: "Starter", price: "Free", features: ["1 Channel", "500 Contacts", "1 Automation Workflow", "Basic Analytics"], buttonText: "Start for Free", variant: "outline" },
        { name: "Growth", price: "₹4,999", price_desc: "/month", features: ["3 Channels", "5,000 Contacts", "5 Automation Workflows", "AI-Powered Analytics"], buttonText: "Choose Plan", variant: "primary", popular: true },
        { name: "Scale", price: "Custom", features: ["Unlimited Channels", "Unlimited Contacts", "Unlimited Workflows", "Dedicated Support"], buttonText: "Contact Sales", variant: "secondary" }
    ];
    return (
        <section id="pricing" className="py-20 bg-stone-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-stone-800">Simple, Transparent Pricing</h3>
                    <p className="mt-2 text-stone-600">Choose the plan that's right for your business.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <div key={index} className={`relative bg-white p-8 rounded-2xl border ${plan.popular ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-stone-200/80'} shadow-lg flex flex-col`}>
                            {plan.popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>}
                            <h4 className="text-2xl font-bold text-stone-800">{plan.name}</h4>
                            <p className="mt-4 text-4xl font-extrabold text-stone-900">{plan.price} <span className="text-base font-medium text-stone-500">{plan.price_desc}</span></p>
                            <ul className="mt-6 space-y-3 text-stone-600 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button variant={plan.variant as any} className="w-full mt-8 py-3" onClick={onNavigateToAuth}>{plan.buttonText}</Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const faqs = [
    { q: "Is it hard to set up?", a: "No! AgroBeet is designed to be user-friendly. You can connect your channels and start your first campaign in minutes. Our interface guides you through every step." },
    { q: "What channels do you support?", a: "We currently support WhatsApp, SMS, and in-app messaging. We are always working on adding new channels based on customer feedback." },
    { q: "Can I import my existing contacts?", a: "Yes, you can easily import your contacts via a CSV file. Our audience management tools make it simple to segment and manage your lists." },
    { q: "Is my data secure?", a: "Absolutely. We take data security very seriously. All your data is encrypted and stored securely. We are compliant with industry-standard privacy regulations." },
];

const FaqItem: React.FC<{ faq: { q: string, a: string } }> = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-stone-200 py-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <span className="text-lg font-semibold text-stone-800">{faq.q}</span>
                <ChevronDownIcon className={`w-5 h-5 text-stone-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && <p className="mt-2 text-stone-600 pr-4">{faq.a}</p>}
        </div>
    );
};

const FaqSection: React.FC = () => {
    return (
        <section id="faq" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-stone-800">Frequently Asked Questions</h3>
                </div>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {faqs.map((faq, index) => <FaqItem key={index} faq={faq} />)}
                </div>
            </div>
        </section>
    );
};

const CtaSection: React.FC<{ onNavigateToAuth: () => void }> = ({ onNavigateToAuth }) => {
  return (
    <section className="relative py-20 bg-cover bg-center" style={{backgroundImage: "url('https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1920')"}}>
        <div className="absolute inset-0 bg-emerald-900/80"></div>
        <div className="relative container mx-auto px-6 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white">Ready to Grow Your Community?</h3>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-emerald-100">
            Join hundreds of other agribusinesses and start building stronger relationships with your farmers today.
            </p>
            <div className="mt-8">
            <Button variant="secondary" className="px-8 py-4 text-lg" onClick={onNavigateToAuth}>
                Sign Up Now
            </Button>
            </div>
        </div>
    </section>
  );
};


const Footer: React.FC = () => {
    return (
        <footer className="bg-stone-900 text-stone-300">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: Brand and Socials */}
                    <div className="md:col-span-1">
                         <div className="text-2xl font-bold tracking-tight">
                            <span className="text-emerald-500">Agro</span><span className="text-amber-500">BEET</span> <span className="text-white">Connect</span>
                        </div>
                        <p className="mt-4 text-stone-400 text-sm max-w-xs">The all-in-one platform to engage, inform, and grow your farming community.</p>
                        <div className="mt-6 flex space-x-4">
                            <a href="#" className="text-stone-400 hover:text-white"><span className="sr-only">Facebook</span><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
                            <a href="#" className="text-stone-400 hover:text-white"><span className="sr-only">Twitter</span><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
                            <a href="#" className="text-stone-400 hover:text-white"><span className="sr-only">LinkedIn</span><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg></a>
                        </div>
                    </div>
                    {/* Column 2: Links */}
                    <div>
                        <h5 className="font-semibold tracking-wide uppercase text-stone-200">Product</h5>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li><a href="#features" className="text-stone-400 hover:text-white transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="text-stone-400 hover:text-white transition-colors">How It Works</a></li>
                            <li><a href="#pricing" className="text-stone-400 hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#faq" className="text-stone-400 hover:text-white transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                    {/* Column 3: Links */}
                    <div>
                        <h5 className="font-semibold tracking-wide uppercase text-stone-200">Company</h5>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li><a href="#" className="text-stone-400 hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                    {/* Column 4: Newsletter */}
                    <div>
                         <h5 className="font-semibold tracking-wide uppercase text-stone-200">Stay Updated</h5>
                         <p className="mt-4 text-stone-400 text-sm">Get the latest news and product updates.</p>
                         <form className="mt-4">
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <div className="flex rounded-md shadow-sm">
                                <input type="email" name="email-address" id="email-address" autoComplete="email" required className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md bg-stone-800 border-stone-700 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white" placeholder="Enter your email" />
                                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900 focus:ring-emerald-500">
                                    Subscribe
                                </button>
                            </div>
                         </form>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-stone-800 text-center text-sm text-stone-500">
                    &copy; {new Date().getFullYear()} AgroBEET Connect. All rights reserved.
                </div>
            </div>
        </footer>
    );
};


const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="bg-white text-stone-800 font-sans">
      <Header onNavigateToAuth={onNavigateToAuth} />
      <main>
        <HeroSection onNavigateToAuth={onNavigateToAuth} />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection onNavigateToAuth={onNavigateToAuth} />
        <FaqSection />
        <CtaSection onNavigateToAuth={onNavigateToAuth} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;