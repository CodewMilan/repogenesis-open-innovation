'use client'

interface TimeSlotSelectorProps {
    selectedTime: string | null
    onTimeSelect: (time: string) => void
}

export default function TimeSlotSelector({ selectedTime, onTimeSelect }: TimeSlotSelectorProps) {
    const timeSlots = [
        '9:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '1:00 PM',
        '2:00 PM',
        '3:00 PM',
        '4:00 PM',
        '5:00 PM',
        '6:00 PM',
        '7:00 PM'
    ]

    return (
        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4">Select Time Slot</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                    <button
                        key={time}
                        onClick={() => onTimeSelect(time)}
                        className={`
              py-3 px-4 rounded-lg font-medium transition-all text-sm
              ${selectedTime === time
                                ? 'bg-green-500 text-black hover:bg-green-400'
                                : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                            }
            `}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    )
}
