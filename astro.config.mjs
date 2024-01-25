import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { readFileSync } from "fs";
import { parse } from 'yaml'

function document(path, props={}) {
  let fullFilenameMDX = `./src/content/docs/${path}.mdx`;
  let fullFilename = `./src/content/docs/${path}.md`;

  let possibleFiles = [fullFilenameMDX, fullFilename];

  path = path.replace(/\/index$/, "");

  for (let file of possibleFiles) {
    try {
      // Read & parse frontmatter
      let content = readFileSync(file, "utf-8");
      let frontmatter = content.split("---")[1];
      let data = parse(frontmatter);

      let title = data.title;
      return {
        link: path,
        label: title,
        ...props
      };
    } catch (e) {
      // ignore
    }
  }

  return {
    link: path,
    label: path,
    ...props
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Minestom Wiki",
      logo: {
        src: "./public/favicon.png",
      },
      favicon: "/favicon.png",
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
          items: [
            document("setup/dependencies"),
            document("setup/your-first-server"),
          ]
        },
        {
          label: "Thread Architecture",
          items: [
            {
              label: "Aquirable API",
              items: [
                document("thread-architecture/acquirable-api/index"),
                document("thread-architecture/acquirable-api/inside-the-api"),
              ],
              collapsed: true,
            },
            document("thread-architecture/thread-safety"),
          ]
        },
        {
          label: "World",
          items: [
            document("world/anvilloader"),
            document("world/batch"),
            document("world/blocks"),
            document("world/chunk-management"),
            document("world/coordinates"),
            document("world/generation"),
            document("world/instances"),
          ]
        },
        {
          label: "Feature",
          items: [
            {
              label: "Entities",
              items: [
                document("feature/entities/index"),
                document("feature/entities/ai"),
              ],
              collapsed: true,
            },
            {
              label: "Events",
              items: [
                document("feature/events/index"),
                document("feature/events/implementation"),
                document("feature/events/server-list-ping"),
              ],
              collapsed: true,
            },
            {
              label: "Map Rendering",
              items: [
                document("feature/map-rendering/index"),
                document("feature/map-rendering/glfwmaprendering"),
              ],
              collapsed: true,
            },
            document("feature/advancements"),
            document("feature/adventure"),
            document("feature/commands"),
            document("feature/inventories"),
            document("feature/items"),
            document("feature/open-to-lan"),
            document("feature/permissions"),
            document("feature/player-skin"),
            document("feature/player-uuid"),
            document("feature/query"),
            document("feature/schedulers"),
            document("feature/tags"),
          ]
        },
        {
          label: "Expansion",
          items: [
            {
              label: "Scripting",
              items: [
                document("expansion/scripting/index"),
                document("expansion/scripting/wip-java-interoperability"),
              ],
              collapsed: true,
            },
            document("expansion/extensions"),
          ]
        },
      ],
    }),
  ],
});
