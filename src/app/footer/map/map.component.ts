import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  constructor() {};
  ngAfterViewInit(): void {
    async function initMap(): Promise<void> {
      // Initialize and add the map
      let map: google.maps.Map;
      // The location of 419 Paint & Body LLC
      const position: google.maps.LatLngLiteral = { lat: 41.11908, lng: -84.22754 };
      // Request needed libraries.
      const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      // The map, centered at 419 Paint & Body LLC
      map = new Map(
        document.getElementById('map') as HTMLElement,
        {
          zoom: 12,
          center: position,
          mapId: "map",
        }
      );

      // Create an info window to share between markers.
      const infoWindow: google.maps.InfoWindow = new InfoWindow();

      const pin: google.maps.marker.PinElement = new PinElement({
        glyph: "Dragon-Onyx Software Solutions",
        borderColor: "black",
        background: "red",
        glyphColor: "black",
        scale: 1,
      });

      // The marker, positioned at Continental, made clickable
      const marker: google.maps.marker.AdvancedMarkerElement = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Phone: 1-419-596-3558, Address: 4217 Rd 19, Continental, OH 45831",
        content: pin.element,
        gmpClickable: true,
      });

      // Custom type interface based on a mouse click event
      interface CustomMouseEvent {
        domEvent: MouseEvent;
        latLng: google.maps.LatLng
      };

      // Added a click event listener to the marker, opening and closing the info window
      marker.addListener('click', (event: CustomMouseEvent) => {
        const { domEvent, latLng } = event;
        if(!domEvent || !latLng) {
          console.log("Event: event properties missing.");
          return;
        };

        const { target } = domEvent;

        infoWindow.close();
        infoWindow.setContent(marker.title);
        infoWindow.open(marker.map, marker);
      });
    };

    async function googleCheck(): Promise<void> {
      if ((window as any).google && (window as any).google.maps) {
        initMap();
      } else {
        setTimeout(() => googleCheck(), 0);
      };
    };

    googleCheck();
  };

}
