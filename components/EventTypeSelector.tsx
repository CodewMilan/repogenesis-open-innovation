'use client'

interface EventTypeSelectorProps {
    selectedType: string
    onTypeSelect: (type: string) => void
}

export default function EventTypeSelector({ selectedType, onTypeSelect }: EventTypeSelectorProps) {
    const eventTypes = [
        'Concert',
        'Corporate Event',
        'Wedding',
        'Birthday Party',
        'Festival',
        'Conference',
        'Club Night',
        'Private Party',
        'Other'
    ]

    return (
        <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4">Event Type</h3>
            <select
                value={selectedType}
                onChange={(e) => onTypeSelect(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
            >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    )
}
