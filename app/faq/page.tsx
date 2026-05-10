"use client";
import { faqs } from "@/data/faq";
import { useState } from "react";

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const toggle = (i: number) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <section className="w-full max-w-4xl mx-auto p-6">
            <h2 className="text-4xl font-extrabold mb-8 text-center tracking-wide text-blue-900">
                FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="space-y-4">
                {faqs.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg text-blue-900 hover:bg-blue-50 transition duration-200"
                        >
                            <span>{item.question}</span>
                            <span className="text-2xl font-bold text-blue-700">
                                {openIndex === index ? "−" : "+"}
                            </span>
                        </button>

                        {openIndex === index && (
                            <div className="p-5 text-gray-700 text-base leading-relaxed border-t border-gray-200 bg-blue-50 animate-fadeIn">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
