// CHANGE DIRECTION BUTTON/FUNCTIONALITY AND SOURCE/DESTINATION DISPLAY

import React, { Fragment, useEffect, useRef, useState } from "react";
import L from "leaflet";

import Form from './Form'

import './styles/Map.css'
import axios from "axios";

const Map = () => {

    const mapRef = useRef(null)
    const tileRef = useRef(null)
    const layerRef = useRef(null)
    const [ chosenRoute, setChosenRoute ] = useState("1")
    const [ mapData, setMapData ] = useState({})
    const [ directionID, setDirectionID ] = useState("0")
    const [ source, setSource ] = useState("")
    const [ destination, setDestination ] = useState("")

    const changeDirection = (e) => {
        e.preventDefault()
        if (directionID === "0") {
            setDirectionID("1")
        } else {
            setDirectionID("0")
        }
    }

    // Create our map tile layer:
    tileRef.current = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlraGFlbHJ0ZCIsImEiOiJjanMzdHdpdHAwM2Q3NDRvMW5ueWlpaXh6In0.5QRX579-FSS4GO9VRrNx1A`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1
    })

    // Define the styles that are to be passed to the map instance:
    const mapStyles = {
        overflow: "hidden",
        width: "100%",
        height: "92vh",
        float: "left",
    }

    // Define an object literal with params that will be passed to the map:
    const mapParams = {
        center: [37.9545389, -121.2858201],
        layers: [tileRef.current],
        maxZoom: 19,
        maxNativeZoom: 17,
        scrollWheelZoom: false, // Prevents the map from moving when scrolling (only allows two finger scroll or mouse click)
    }
    
    useEffect(() => {
        mapRef.current = L.map("map", mapParams);
        /* eslint-disable-next-line */
    }, []);

    useEffect(() => {
        layerRef.current = L.layerGroup().addTo(mapRef.current)
    }, [])

    useEffect(() => {
        const getMapData = async () => {
            await axios.get(`../json/route_details/${chosenRoute}.json`)
            .then((res) => {setMapData(res.data.routes[0])})
            .catch((e) => {
                console.log(e)
            })
        }
        getMapData()
    }, [chosenRoute])

    useEffect(() => {
        layerRef.current.clearLayers()

        let dID = ""
        if (chosenRoute.length > 1 || chosenRoute === "5") {
            dID = directionID
        } else {
            dID = "0"
        }
        console.log(chosenRoute)

        const latlon = []

        if (mapData.shapes) {
            let max = 0
            let index = -1
            mapData.shapes.forEach(shape => {
                if (shape.locs.length > max && shape.directionId === dID) {
                        max = shape.locs.length
                }
            })

            index = mapData.shapes.findIndex((element, index) => {
                if (element.locs.length === max) {
                    return true
                }
                return false
            })
            
            mapData.shapes[index].locs.forEach(loc => {
                latlon.push([loc.lat, loc.lon])
            })

            if (chosenRoute === "2") {
                mapData.shapes[2].locs.forEach(loc => {
                    latlon.push([loc.lat, loc.lon])
                })
            }

            const polyline = L.polyline(
                latlon,
                {
                    color: "black",
                    weight: 2.5
            }).addTo(layerRef.current)

            mapRef.current.fitBounds(polyline.getBounds())
        }

        if (mapData.directions) {
            const busStops = mapData.directions[dID].stops
            setSource(busStops[0].name)
            setDestination(busStops[busStops.length - 1].name)
            console.log(source + " - " + destination)

            mapData.directions[dID].stops.forEach((stop, index) => {
                let textColor = "#800000"
                if (stop.name === source) {
                    textColor = "#EDAF00"
                } else if (stop.name === destination) {
                    textColor = "#4285F4"
                }

                L.circleMarker(
                    [stop.lat, stop.lon], 
                    { 
                        radius: 11,
                        fillOpacity: 1,
                        fillColor: textColor,
                        color: "white"
                    }).addTo(layerRef.current)
                    .bindPopup(`<h3>${index + 1} - ${stop.name}</h3>`) 
            })
        }
    }, [mapData, directionID, source, destination])

    return (
        <Fragment>
            <div data-testid="formDiv" className="routeSelection">
                <Form 
                    handleSelect={(route) => setChosenRoute(route)} 
                />
                { 
                    source !== destination ? (
                        <div className="directionDiv">
                            <label className="direction">Direction: </label>
                            <div className="srcAndDest">
                                <p><span data-testid="source" className="src">{source}</span> → <span data-testid="dest" className="dest">{destination}</span></p>
                            </div>
                            <form className="reverseForm" onSubmit={changeDirection}>
                                <button className="reverseButton" type="submit">Change Direction</button>
                            </form>
                        </div>
                    ) : (<p data-testid="loading"></p>)
                }
            </div> 
            <div data-testid="mapDiv" id="map" style={mapStyles} />
        </Fragment>
    )
}

export default Map