
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon } from '../components/icons';

const faqData = [
  {
    question: "How do I report an issue?",
    answer: "Navigate to the 'Report Issue' page. Upload a photo of the issue, and our AI will help you generate a description and find your location. After a quick analysis, you can confirm and post your report."
  },
  {
    question: "How does the AI analysis work?",
    answer: "When you upload an image and provide a description, our system uses a powerful AI model (Gemini) to automatically categorize the issue (e.g., Pothole, Streetlight) and assess its priority level based on the visual evidence and text. This helps route your report to the correct department faster."
  },
  {
    question: "What happens after I report an issue?",
    answer: "Your report appears on the 'Issues Feed' for other community members to see and upvote. It is also sent to the relevant local authorities. You can track its status—from 'Reported' to 'Acknowledged' and finally 'Resolved'—on the issue's detail page."
  },
  {
    question: "How do I earn points and badges?",
    answer: "You earn points for every valid issue you report, and for being the first to report a particular issue. As you accumulate points, you'll climb the leaderboard and unlock badges that recognize your contributions to the community."
  },
   {
    question: "Is my personal data safe?",
    answer: "We take your privacy seriously. Reports are submitted with your username, but we do not share your personal contact information publicly. All data is handled securely."
  }
];

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  // FIX: Assign motion components to capitalized variables to resolve TypeScript type inference issues.
  const MotionDiv = motion.div;
  const MotionHeader = motion.header;
  const MotionSection = motion.section;

  return (
    <MotionDiv layout className="border-b border-gray-700">
      <MotionHeader
        initial={false}
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center p-4 cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-white">{question}</h3>
        <MotionDiv
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <ChevronUpIcon className="w-6 h-6 text-cyan-400" />
        </MotionDiv>
      </MotionHeader>
      <AnimatePresence>
        {isOpen && (
          <MotionSection
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="p-4 pt-0 text-gray-300">{answer}</p>
          </MotionSection>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
};


const HelpFAQ = () => {
  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-cyan-400 mb-2">Help & FAQ</h1>
        <p className="text-lg text-gray-300">Find answers to common questions about PragatiPath.</p>
      </header>
      
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg">
        {faqData.map((faq, index) => (
          <AccordionItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </MotionDiv>
  );
};

export default HelpFAQ;