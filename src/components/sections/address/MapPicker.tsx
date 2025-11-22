/// <reference types="@types/google.maps" />
'use client';

import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  addressText?: string;
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function MapPicker({
  initialLat = -2.5489,
  initialLng = 118.0149,
  addressText = '',
  onLocationChange,
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [coordinates, setCoordinates] = useState({
    lat: initialLat,
    lng: initialLng,
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!mapRef.current || map) return;

    const loadGoogleMaps = () => {
      if (typeof window !== 'undefined' && window.google?.maps) {
        initializeMap();
      } else {
        // Wait for Google Maps to load
        const checkGoogle = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkGoogle);
            initializeMap();
          }
        }, 100);

        return () => clearInterval(checkGoogle);
      }
    };

    const initializeMap = () => {
      const initialCenter = { lat: initialLat, lng: initialLng };

      const newMap = new google.maps.Map(mapRef.current!, {
        zoom: initialLat === -2.5489 && initialLng === 118.0149 ? 5 : 17,
        center: initialCenter,
        mapTypeControl: false,
      });

      setMap(newMap);

      const newMarker = new google.maps.Marker({
        map: newMap,
        position: initialCenter,
        draggable: true,
        title: addressText || 'Pilih Lokasi',
      });

      setMarker(newMarker);

      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        if (position) {
          const lat = position.lat();
          const lng = position.lng();
          setCoordinates({ lat, lng });
          onLocationChange?.(lat, lng);
        }
      });

      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(
          searchInputRef.current,
          {
            fields: ['geometry', 'name', 'formatted_address'],
          },
        );
        autocomplete.bindTo('bounds', newMap);
        autocompleteRef.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            alert('Lokasi yang dipilih tidak memiliki detail Geometri.');
            return;
          }

          newMap.setCenter(place.geometry.location);
          newMap.setZoom(17);
          newMarker.setPosition(place.geometry.location);

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setCoordinates({ lat, lng });
          onLocationChange?.(lat, lng);
        });
      }
    };

    loadGoogleMaps();
  }, [initialLat, initialLng, addressText, map, onLocationChange]);

  useEffect(() => {
    if (marker && map) {
      const newPos = { lat: initialLat, lng: initialLng };
      marker.setPosition(newPos);
      map.setCenter(newPos);
      if (initialLat !== -2.5489 || initialLng !== 118.0149) {
        map.setZoom(17);
      }
      setCoordinates(newPos);
    }
  }, [initialLat, initialLng, marker, map]);

  useEffect(() => {
    const stop = (e: Event) => {
      e.stopPropagation();
    };

    const attachListeners = () => {
      const containers = document.querySelectorAll('.pac-container');
      containers.forEach((el) => {
        el.addEventListener('mousedown', stop, true);
        el.addEventListener('click', stop, true);
      });
    };

    const observer = new MutationObserver(() => {
      attachListeners();
    });

    if (typeof window !== 'undefined') {
      observer.observe(document.body, { childList: true, subtree: true });
      attachListeners();
    }

    return () => {
      observer.disconnect();
      const containers = document.querySelectorAll('.pac-container');
      containers.forEach((el) => {
        el.removeEventListener('mousedown', stop, true);
        el.removeEventListener('click', stop, true);
      });
    };
  }, []);

  return (
    <div className='space-y-3'>
      <div className='space-y-1'>
        <Label htmlFor='map-search'>Cari Alamat</Label>
        <div className='relative'>
          <input
            ref={searchInputRef}
            id='map-search'
            role='combobox'
            aria-expanded='false'
            aria-controls='map-search-listbox'
            placeholder='Masukkan alamat atau tempat di sini'
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
          />
        </div>
      </div>

      <div
        ref={mapRef}
        className='w-full h-[300px] border border-gray-300 rounded-md relative z-0'
      />

      <p className='text-xs text-gray-500'>
        Geser pin untuk menyesuaikan lokasi yang tepat
      </p>
    </div>
  );
}
