
import React from 'react';
import { MapPinIcon } from './icons';

interface MapPlaceholderProps {
    address: string;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ address }) => {
    // In a real app, you would use an API like Google Maps Static API
    // For this demo, we'll use a placeholder service with a relevant seed
    const seed = address.replace(/[^a-zA-Z0-9]/g, '');
    const mapImageUrl = `https://picsum.photos/seed/${seed}/800/400`;

    return (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-700">
            <img src={mapImageUrl} alt={`Map of ${address}`} className="w-full h-48 object-cover grayscale" />
            <div className="absolute inset-0 bg-gray-900/50 flex flex-col items-center justify-center p-4">
                <MapPinIcon className="w-10 h-10 text-cyan-400 mb-2"/>
                <p className="text-white text-center font-semibold">{address}</p>
                <p className="text-xs text-gray-400 mt-1">(Live map view coming soon)</p>
            </div>
        </div>
    );
};

export default MapPlaceholder;
