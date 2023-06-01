import React from 'react'
import Map, { Marker } from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import { MAP_BOX_API_KEY } from '../utils/constants'
import 'maplibre-gl/dist/maplibre-gl.css'

const MapView = ({ coordinates, style }) => {
    const displayCasesCount = nombreDeCas => new maplibregl.Popup({ offset: 25 }).setText(`#${nombreDeCas} Cases`)
    return (
        <>
            <Map
                initialViewState={coordinates.length > 0 && { latitude: coordinates[0].latitude, longitude: coordinates[0].longitude, zoom: 5 }}
                mapLib={maplibregl}
                style={{ width: '100%', height: '300px', ...style }}
                mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAP_BOX_API_KEY}`} >
                {
                    coordinates.length > 0 && coordinates.map((coordinate, index) => (
                        <Marker key={index} longitude={coordinate.longitude} latitude={coordinate.latitude} color='red' popup={displayCasesCount(3)} />
                    ))
                }
            </Map>

        </>
    )
}

export default MapView