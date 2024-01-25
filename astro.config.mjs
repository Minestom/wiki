import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://wiki.minestom.net",
  integrations: [
    starlight({
      title: "Minestom Wiki",
      logo: {
        src: "./public/logo.png",
      },
      social: {
        github: "https://github.com/Minestom/Minestom",
        discord: "https://minestom.net/discord",
      },
      editLink: {
        baseUrl: "https://github.com/Minestom/wiki/edit/master/",
      },
      customCss: ["./src/content/index.css"],
      sidebar: [
        {
          label: "Presentation",
          link: "/",
        },
        {
          label: "Setup",
          autogenerate: { directory: "setup" },
        },
        {
          label: "Thread Architecture",
          autogenerate: { directory: "thread-architecture" },
        },
        {
          label: "World",
          autogenerate: { directory: "world" },
        },
        {
          label: "Feature",
          autogenerate: { directory: "feature" },
        },
        {
          label: "Expansion",
          autogenerate: { directory: "expansion" },
        }
      ],
    }),
  ],
});
