'use client'

import { useState } from 'react'

interface BookingCalendarProps {
    selectedDate: Date | null
    onDateSelect: (date: Date) => void
}

export default function BookingCalendar({ selectedDate, onDateSelect }: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        return { daysInMonth, startingDayOfWeek }
    }

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const isToday = (day: number) => {
        const today = new Date()
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        )
    }

    const isSelected = (day: number) => {
        if (!selectedDate) return false
        return (
            day === selectedDate.getDate() &&
            currentMonth.getMonth() === selectedDate.getMonth() &&
            currentMonth.getFullYear() === selectedDate.getFullYear()
        )
    }

    const isPast = (day: number) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        return date < today
    }

    const handleDateClick = (day: number) => {
        if (isPast(day)) return
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        onDateSelect(date)
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    return (
        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={previousMonth}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                >
                    ←
                </button>
                <h3 className="text-white font-bold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    onClick={nextMonth}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                >
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day) => (
                    <div key={day} className="text-center text-gray-500 text-sm font-medium">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const past = isPast(day)
                    const today = isToday(day)
                    const selected = isSelected(day)

                    return (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            disabled={past}
                            className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${past ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'}
                ${today ? 'bg-green-500/20 border border-green-500' : ''}
                ${selected ? 'bg-green-500 text-black hover:bg-green-400' : ''}
              `}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
