import { HelpCircle, MessageCircle, FileQuestion, Phone, ChevronRight, ExternalLink } from 'lucide-react';
import logo from '@/assets/loanpulse-logo.png';

const faqItems = [
  {
    question: 'How long does verification take?',
    answer: 'Verification typically takes 2-3 business days, depending on document clarity and third-party checks.',
  },
  {
    question: 'What does "Action Required" mean?',
    answer: 'It means we need additional information or documents from you to continue processing your application.',
  },
  {
    question: 'Why was my application not approved?',
    answer: 'Decisions are made by lenders based on various factors. We provide general guidance for future applications.',
  },
  {
    question: 'How will I receive my loan amount?',
    answer: 'Once approved, the amount is transferred directly to your registered bank account.',
  },
];

const supportOptions = [
  {
    icon: MessageCircle,
    title: 'Chat with us',
    description: 'Get help from our support team',
    action: 'Start chat',
  },
  {
    icon: Phone,
    title: 'Call support',
    description: 'Mon-Sat, 9AM - 6PM',
    action: '1800-XXX-XXXX',
  },
  {
    icon: FileQuestion,
    title: 'Knowledge base',
    description: 'Browse articles and guides',
    action: 'View articles',
  },
];

export function HelpScreen() {
  return (
    <div className="min-h-screen flex flex-col px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <img src={logo} alt="LoanPulse" className="h-7" />
      </div>

      <h1 className="text-xl font-semibold font-serif mb-6">Help & Support</h1>

      {/* Support Options */}
      <div className="space-y-3 mb-8">
        {supportOptions.map((option) => (
          <button
            key={option.title}
            className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border text-left hover:bg-muted/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-progress-bg flex items-center justify-center flex-shrink-0">
              <option.icon className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <details 
              key={index}
              className="group bg-card rounded-xl border border-border overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="font-medium text-foreground pr-4">{item.question}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center">
        <a 
          href="#" 
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View all help articles
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
