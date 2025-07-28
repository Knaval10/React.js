import React, { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON.js";
import Style from "ol/style/Style.js";
import Stroke from "ol/style/Stroke.js";
import Fill from "ol/style/Fill.js";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { defaults as defaultControls, FullScreen } from "ol/control";

function MapView() {
  const mapRef: any = useRef(null);
  const vectorLayerRef: any = useRef(null);
  const mapInstance: any = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const geojsonObject = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Sample District" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [84.2, 28.5],
                [84.3, 28.5],
                [84.3, 28.6],
                [84.2, 28.6],
                [84.2, 28.5],
              ],
            ],
          },
        },
      ],
    };

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject, {
        featureProjection: "EPSG:3857",
      }),
    });

    const defaultStyle = new Style({
      stroke: new Stroke({ color: "blue", width: 2 }),
      fill: new Fill({ color: "rgba(0,0,255,0.1)" }),
    });

    const highlightStyle = new Style({
      stroke: new Stroke({ color: "orange", width: 3 }),
      fill: new Fill({ color: "rgba(255,165,0,0.3)" }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: defaultStyle,
    });

    vectorLayerRef.current = vectorLayer;

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: fromLonLat([84.25, 28.55]),
        zoom: 6,
      }),
      controls: defaultControls().extend([new FullScreen()]),
    });

    mapInstance.current = map;
    map.on("pointermove", (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
      map.getTargetElement().style.backgroundColor = hit ? "red" : "";
    });
    map.on("singleclick", (evt) => {
      let clickedFeature: any = null;

      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        clickedFeature = feature;
      });

      if (clickedFeature) {
        // Highlight clicked feature
        clickedFeature.setStyle(highlightStyle);

        // Zoom to feature extent with some padding
        const geometry = clickedFeature.getGeometry();
        const extent = geometry.getExtent();

        map.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
          duration: 5000,
        });
      } else {
        // Reset styles if clicked outside features
        vectorSource.getFeatures().forEach((f) => f.setStyle(defaultStyle));
      }
    });

    return () => map.setTarget(null);
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "97vh" }} />;
}

export default MapView;
