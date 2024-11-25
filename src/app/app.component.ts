import { Component } from '@angular/core';

import { MoveDirection, ClickMode, HoverMode, OutMode, tsParticles } from "tsparticles-engine";
import type { Container, Engine } from 'tsparticles-engine';
import { loadSlim } from "tsparticles-slim";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public readonly title = 'mean-ddbjr';
  public readonly id: string = "tsparticles";
  public readonly particlesUrl: string = "http://foo.bar/particles.json";
  public readonly particlesOptions: object = {
    fullScreen: {
      enable: true,
      zIndex: 0
    },
    background: {
      // image: "url('../assets/images/2023-02-01.jpg')",
      // size: "100% 100%",
      // position: "center",
      // repeat: "no-repeat"
      color: {
        value: "#0d47a1",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: false,
          mode: ClickMode.push,
        },
        onHover: {
          enable: false,
          mode: HoverMode.repulse,
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: false,
        speed: 3,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
        // type: "image",
        // image: {
        //   src: "../assets/icons/tow-truck.png",
        //   width: 100,
        //   height: 100
        // }
      },
      size: {
        value: { min: 1, max: 20 },
      },
    },
    detectRetina: true,
  };

  particlesLoaded(container: Container): void {
    console.log(container);
  };

  async particlesInit(engine: Engine): Promise<void> {
    console.log(engine);
    // await loadFull(engine);
    await loadSlim(engine);
  };
}
