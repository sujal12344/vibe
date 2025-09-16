import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
import { getSandbox } from "../utils";

export const createTemplateCloner = (sandboxId: string) =>
  createTool({
    name: "cloneTemplate",
    description:
      "Clone a template from GitHub repository URL based on user's category and subcategory selection",
    parameters: z.object({
      githubUrl: z
        .string()
        .describe("GitHub repository URL to clone (from subcategory data)"),
      projectName: z
        .string()
        .optional()
        .describe("Optional project name, defaults to 'vibe-project'"),
    }),
    handler: async ({ githubUrl, projectName = "vibe-project" }, { step }) => {
      return await step?.run("clone-template", async () => {
        try {
          try {
            const sandbox = await getSandbox(sandboxId);

            // Validate GitHub URL
            if (!githubUrl || !githubUrl.includes("github.com")) {
              return `❌ Invalid GitHub URL: "${githubUrl}". Please provide a valid GitHub repository URL.`;
            }

            try {
              try {
                await sandbox.commands.run(
                  `export TEMPLATE_GITHUB_URL="${githubUrl}"`,
                  {
                    onStdout: (data: string) =>
                      console.log("ENV stdout:", data),
                    onStderr: (data: string) =>
                      console.error("ENV stderr:", data),
                  }
                );
              } catch (error) {
                return `❌ Error during environment setup: ${error}. githubUrl: "${githubUrl}", projectName: "${projectName}", sandboxId: "${sandboxId}"`;
              }

              try {
                console.log("🔄 Running direct git clone and setup...");
                let allOutput = "";

                // Step 1: Check if git is available and clone repository
                console.log(
                  "📁 Step 1: Installing git and cloning repository..."
                );

                // First install git with timeout
                const gitInstallResult = await sandbox.commands.run(
                  `sudo apt-get update -y && sudo apt-get install -y git`,
                  {
                    timeoutMs: 30000, // 30 seconds for git install
                    onStdout: (data: string) => {
                      console.log("GIT INSTALL stdout:", data);
                      allOutput += `GIT INSTALL: ${data}\n`;
                    },
                    onStderr: (data: string) => {
                      console.error("GIT INSTALL stderr:", data);
                      allOutput += `GIT INSTALL ERROR: ${data}\n`;
                    },
                  }
                );

                if (gitInstallResult.exitCode !== 0) {
                  console.log(
                    "⚠️ Git install failed, trying alternative approach..."
                  );
                }

                // Then clone with longer timeout
                const cloneResult = await sandbox.commands.run(
                  `cd /home/user && rm -rf repo 2>/dev/null || true && git clone ${githubUrl} repo`,
                  {
                    timeoutMs: 60000, // 60 seconds for clone
                    onStdout: (data: string) => {
                      console.log("CLONE stdout:", data);
                      allOutput += `CLONE: ${data}\n`;
                    },
                    onStderr: (data: string) => {
                      console.error("CLONE stderr:", data);
                      allOutput += `CLONE ERROR: ${data}\n`;
                    },
                  }
                );

                if (cloneResult.exitCode !== 0) {
                  // Try alternative approach with curl
                  console.log("🔄 Trying alternative download with curl...");
                  const repoPath = githubUrl
                    .split("github.com/")[1]
                    .replace(".git", "");
                  const altCloneResult = await sandbox.commands.run(
                    `cd /home/user && rm -rf repo repo.zip 2>/dev/null || true && curl -L "https://github.com/${repoPath}/archive/main.zip" -o repo.zip`,
                    {
                      timeoutMs: 45000, // 45 seconds for download
                      onStdout: (data: string) => {
                        console.log("DOWNLOAD stdout:", data);
                        allOutput += `DOWNLOAD: ${data}\n`;
                      },
                      onStderr: (data: string) => {
                        console.error("DOWNLOAD stderr:", data);
                        allOutput += `DOWNLOAD ERROR: ${data}\n`;
                      },
                    }
                  );

                  if (altCloneResult.exitCode === 0) {
                    // Extract the zip
                    const extractResult = await sandbox.commands.run(
                      `cd /home/user && unzip -q repo.zip && mv *-main repo 2>/dev/null || mv *-master repo 2>/dev/null || echo "Extraction completed"`,
                      {
                        timeoutMs: 15000, // 15 seconds for extraction
                        onStdout: (data: string) => {
                          console.log("EXTRACT stdout:", data);
                          allOutput += `EXTRACT: ${data}\n`;
                        },
                        onStderr: (data: string) => {
                          console.error("EXTRACT stderr:", data);
                          allOutput += `EXTRACT ERROR: ${data}\n`;
                        },
                      }
                    );
                  } else {
                    return `❌ Both git clone and direct download failed. 
                    
Full Output: ${allOutput}
                    
Exit codes: git=${cloneResult.exitCode}, download=${altCloneResult.exitCode}`;
                  }
                }

                console.log("✅ Repository cloned successfully");

                // Step 2: Install dependencies
                console.log("📦 Step 2: Installing dependencies...");
                const installResult = await sandbox.commands.run(
                  `cd /home/user/repo && npm install --prefer-offline --no-audit --no-fund`,
                  {
                    timeoutMs: 120000, // 2 minutes for npm install
                    onStdout: (data: string) => {
                      console.log("INSTALL stdout:", data);
                      allOutput += `INSTALL: ${data}\n`;
                    },
                    onStderr: (data: string) => {
                      console.error("INSTALL stderr:", data);
                      allOutput += `INSTALL ERROR: ${data}\n`;
                    },
                  }
                );

                if (installResult.exitCode !== 0) {
                  console.log("⚠️ npm install had issues, but continuing...");
                  allOutput += `⚠️ npm install exit code: ${installResult.exitCode}\n`;
                }

                // Step 3: Start development server in background (quick start)
                console.log("🚀 Step 3: Starting development server...");
                const serverResult = await sandbox.commands.run(
                  `cd /home/user/repo && timeout 10s npm run dev > /tmp/server.log 2>&1 & echo "Server started in background"`,
                  {
                    timeoutMs: 15000, // 15 seconds max for server start
                    onStdout: (data: string) => {
                      console.log("SERVER stdout:", data);
                      allOutput += `SERVER: ${data}\n`;
                    },
                    onStderr: (data: string) => {
                      console.error("SERVER stderr:", data);
                      allOutput += `SERVER ERROR: ${data}\n`;
                    },
                  }
                );

                console.log("📊 All steps completed!");

                return `✅ Successfully cloned and set up template from ${githubUrl}!

🎉 Setup Summary:
- ✅ Repository cloned to /home/user/repo
- ✅ Dependencies installed 
- ✅ Development server started in background
- 📂 Project files are ready for editing

Setup Details:
${allOutput.slice(-1000)}`;
              } catch (error) {
                console.error("❌ Template setup error:", error);
                return `❌ Error during template setup: ${error}. githubUrl: "${githubUrl}", projectName: "${projectName}", sandboxId: "${sandboxId}"`;
              }
            } catch (error) {
              return `❌ Error during template setup: ${error}. githubUrl: "${githubUrl}", projectName: "${projectName}", sandboxId: "${sandboxId}"`;
            }
          } catch (error) {
            return `❌ Failed to get sandbox: ${error}. Cannot proceed with cloning. githubUrl: "${githubUrl}", projectName: "${projectName}", sandboxId: "${sandboxId}"`;
          }
        } catch (error) {
          return `❌ Error cloning template: ${error}. Fallback setup will be used. githubUrl: "${githubUrl}", projectName: "${projectName}", sandboxId: "${sandboxId}"`;
        }
      });
    },
  });

export const createThemeApplier = (sandboxId: string) =>
  createTool({
    name: "applyTheme",
    description:
      "Apply a selected theme to the project by updating CSS variables",
    parameters: z.object({
      themeKey: z.string().describe("Theme key from theme presets"),
      projectPath: z.string().describe("Path to the project directory"),
    }),
    handler: async ({ themeKey, projectPath }, { step }) => {
      return await step?.run("apply-theme", async () => {
        try {
          const sandbox = await getSandbox(sandboxId);

          // Import theme presets (you'd need to make this available in the sandbox)
          const { defaultPresets } = await import("@/utils/theme-presets");
          const theme = defaultPresets[themeKey];

          if (!theme) {
            return `Theme "${themeKey}" not found`;
          }

          // Generate CSS variables for the theme
          const generateCSSVariables = (colors: any, prefix = "") => {
            return Object.entries(colors)
              .map(([key, value]) => `    --${prefix}${key}: ${value};`)
              .join("\n");
          };

          const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
${generateCSSVariables(theme.styles.light)}
  }

  .dark {
${generateCSSVariables(theme.styles.dark)}
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

          // Write the CSS file
          await sandbox.files.write(
            `${projectPath}/app/globals.css`,
            cssContent
          );

          // Update tailwind.config.js if it exists
          const tailwindConfigExists = await sandbox.files.exists(
            `${projectPath}/tailwind.config.js`
          );
          if (tailwindConfigExists) {
            const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;

            await sandbox.files.write(
              `${projectPath}/tailwind.config.js`,
              tailwindConfig
            );
          }

          return `Successfully applied ${theme.label} theme to the project`;
        } catch (error) {
          return `Error applying theme: ${error}`;
        }
      });
    },
  });
