'use client'

import { useState } from 'react'
import Link from 'next/link'
import BookingForm from '@/components/BookingForm'

export default function ContactPage() {
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert('Message sent! We will get back to you soon.')
        setFormData({ name: '', email: '', phone: '', message: '' })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
            {/* Matrix background */}
            <div className="fixed inset-0 opacity-10 pointer-events-none">
                <div className="grid grid-cols-25 gap-1 h-full">
                    {Array.from({ length: 100 }, (_, i) => (
                        <div key={i} className="text-gray-500 text-xs animate-pulse">📞</div>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative px-6 py-20 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                            Contact <span className="text-gray-400 animate-pulse">Us</span>
                        </h1>
                        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                            Need to reach us? Whether you're an event organizer, partner, or attendee, the AuthenTIX team is here to support you.
                        </p>
                    </div>

                    {/* Event Booking Section */}
                    <div className="max-w-7xl mx-auto mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
                                Select a Date & <span className="text-green-500">Time</span>
                            </h2>
                            <p className="text-gray-400 text-lg">
                                Choose from our available events and tell us about your event
                            </p>
                        </div>

                        <div className="bg-gray-950/50 border border-gray-700 p-8 rounded-lg backdrop-blur-sm shadow-2xl">
                            <BookingForm onSuccess={() => {
                                setShowSuccessToast(true)
                                setTimeout(() => setShowSuccessToast(false), 5000)
                            }} />
                        </div>
                    </div>

                    {/* Success Toast */}
                    {showSuccessToast && (
                        <div className="fixed top-24 right-6 z-50 animate-slide-in">
                            <div className="bg-green-500 text-black px-6 py-4 rounded-lg shadow-2xl shadow-green-500/50 flex items-center gap-3">
                                <div className="text-2xl">✓</div>
                                <div>
                                    <div className="font-bold">Booking Request Sent!</div>
                                    <div className="text-sm">We'll get back to you soon.</div>
                                </div>
                                <button
                                    onClick={() => setShowSuccessToast(false)}
                                    className="ml-4 text-black hover:text-gray-800 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Contact Details */}
                    <div className="max-w-5xl mx-auto mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group relative h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                                <div className="relative bg-black border border-gray-700 p-6 h-full hover:border-white transition-all duration-300">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">📞</div>
                                        <h3 className="text-lg font-bold mb-2 text-white">Phone</h3>
                                        <p className="text-gray-400 text-sm">+91-9686720494</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                                <div className="relative bg-black border border-gray-700 p-6 h-full hover:border-white transition-all duration-300">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">📧</div>
                                        <h3 className="text-lg font-bold mb-2 text-white">Email</h3>
                                        <p className="text-gray-400 text-sm">authentix@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                                <div className="relative bg-black border border-gray-700 p-6 h-full hover:border-white transition-all duration-300">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">🕐</div>
                                        <h3 className="text-lg font-bold mb-2 text-white">Support Hours</h3>
                                        <p className="text-gray-400 text-sm">Mon–Fri: 9am–6pm</p>
                                        <p className="text-gray-400 text-sm">Sat: 10am–4pm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Support */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm">
                            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500"></div>
                                        <div className="w-3 h-3 bg-yellow-500"></div>
                                        <div className="w-3 h-3 bg-green-500"></div>
                                    </div>
                                    <span className="text-gray-400 text-sm">emergency-support</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-gray-500 text-xs">24/7</span>
                                </div>
                            </div>
                            <div className="p-8 text-center">
                                <h2 className="text-2xl font-bold mb-4 text-white">Emergency Support (24/7)</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Available 24/7 for live event issues, ticket verification failures, and urgent platform support.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Services Cards */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Services & Assistance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group relative h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                                <div className="relative bg-black border border-gray-700 p-6 h-full flex flex-col hover:border-white transition-all duration-300">
                                    <div className="text-center flex-1">
                                        <div className="text-4xl mb-4">🚨</div>
                                        <h3 className="text-lg font-bold mb-3 text-white">Emergency Support</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            24/7 assistance for critical event issues and platform emergencies.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                                <div className="relative bg-black border border-gray-700 p-6 h-full flex flex-col hover:border-white transition-all duration-300">
                                    <div className="text-center flex-1">
                                        <div className="text-4xl mb-4">📦</div>
                                        <h3 className="text-lg font-bold mb-3 text-white">Custom Packages</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Speak with our team about tailored verification workflows, bulk ticketing, or enterprise use cases.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                                <div className="relative bg-black border border-gray-700 p-6 h-full flex flex-col hover:border-white transition-all duration-300">
                                    <div className="text-center flex-1">
                                        <div className="text-4xl mb-4">🏢</div>
                                        <h3 className="text-lg font-bold mb-3 text-white">Site Visits</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Request an on-ground venue inspection and pre-event setup assistance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm">
                            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500"></div>
                                        <div className="w-3 h-3 bg-yellow-500"></div>
                                        <div className="w-3 h-3 bg-green-500"></div>
                                    </div>
                                    <span className="text-gray-400 text-sm">contact-form</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-6 text-white">Send Us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                                            placeholder="+91-XXXXXXXXXX"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
                                            placeholder="Tell us how we can help..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="group relative cursor-pointer w-full"
                                    >
                                        <div className="absolute inset-0 border border-gray-600 bg-gray-900/20 transition-all duration-300 group-hover:border-white"></div>
                                        <div className="relative border border-white bg-white text-black font-bold px-8 py-4 text-lg transition-all duration-300 group-hover:bg-gray-100 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 text-center">
                                            Send Message
                                        </div>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-gray-950 border border-gray-700 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-white">Team AuthenTIX</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Advanced ticket authentication and verification system for concerts, events, and festivals.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
                                    <div className="space-y-2">
                                        <Link href="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                            → Home
                                        </Link>
                                        <Link href="/events" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                            → Events
                                        </Link>
                                        <Link href="/admin" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                            → Organize Event
                                        </Link>
                                        <Link href="/tickets" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                            → Booking
                                        </Link>
                                        <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                            → Contact Us
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
                                    <div className="space-y-2 text-sm text-gray-400">
                                        <p>📞 +91 7760290528</p>
                                        <p>📧 info@authentix.com</p>
                                        <p>📍 Yelahanka, Bengaluru, India</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                                <p className="text-gray-500 text-sm">
                                    © 2025 – Built by Team AuthenTIX
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
