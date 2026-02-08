

export default function SearchCard()
{


    return (
        <div className="relative">
        <input
            type="text"
            placeholder="Search cards..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2">
            <div className="p-2 hover:bg-gray-50 cursor-pointer rounded">
                <div className="font-medium">Card Name 1</div>
                <div className="text-sm text-gray-500">Card Type</div>
            </div>
            <div className="p-2 hover:bg-gray-50 cursor-pointer rounded">
                <div className="font-medium">Card Name 2</div>
                <div className="text-sm text-gray-500">Card Type</div>
            </div>
            </div>
        </div>
    </div>
    )
}