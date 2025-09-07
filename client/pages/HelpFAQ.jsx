// client/src/pages/HelpFAQ.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full text-left p-4 flex justify-between items-center">
        <span className="font-medium">{q}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-4 border-t text-gray-700 bg-white">{a}</div>}
    </div>
  );
}

export default function HelpFAQ() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    document.title = "Help & FAQ — CivicConnect";
    const fetch = async () => {
      try {
        const res = await api.get("/faq");
        setFaqs(res.data?.faqs || []);
      } catch {
        // fallback default FAQs
        setFaqs([
          { q: "How do I report an issue?", a: "Use the Report page to upload a photo, add details and submit." },
          { q: "How are reports verified?", a: "Admins review, and AI helps classify and surface suspicious reports." },
          { q: "How do I earn points?", a: "Points for validated reports, early responders, and community helpers." },
        ]);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-semibold mb-4">
          Help & FAQ
        </motion.h1>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <AccordionItem key={idx} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
