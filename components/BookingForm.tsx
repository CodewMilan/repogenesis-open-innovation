'use client'

import { useState } from 'react'
import BookingCalendar from './BookingCalendar'
import TimeSlotSelector from './TimeSlotSelector'
import EventTypeSelector from './EventTypeSelector'

interface BookingFormProps {
    onSuccess?: () => void
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedEventType, setSelectedEventType] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        details: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedDate || !selectedTime || !selectedEventType) {
            alert('Please select date, time, and event type')
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Reset form
        setSelectedDate(null)
        setSelectedTime(null)
        setSelectedEventType('')
        setFormData({
            name: '',
            email: '',
            phone: '',
            location: '',
            details: ''
        })

        setIsSubmitting(false)
        onSuccess?.()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Calendar and Time */}
                <div className="space-y-6">
                    <BookingCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />
                    <TimeSlotSelector
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                    />
                    <EventTypeSelector
                        selectedType={selectedEventType}
                        onTypeSelect={setSelectedEventType}
                    />
                </div>

                {/* Right Column: Contact Information */}
                <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-lg backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-6 text-xl">Contact Information</h3>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="+91-XXXXXXXXXX"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-2">
                                Event Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="Venue or address"
                            />
                        </div>

                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-400 mb-2">
                                Additional Details
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
                                placeholder="Please provide any specific requirements or details about your event"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative cursor-pointer px-12 py-4 bg-green-500 text-black font-bold text-lg rounded-lg transition-all duration-300 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                        </div>
                    ) : (
                        'Request Booking'
                    )}
                </button>
            </div>
        </form>
    )
}
