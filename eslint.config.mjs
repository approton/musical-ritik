import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  prettier,
  globalIgnores([
    ".next/**",
    ".next-preview/**",
    ".next-dev/**",
    ".next-production/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
  {
    files: ["integrations/google-apps-script/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: Object.fromEntries(
        [
          "PropertiesService",
          "SpreadsheetApp",
          "HtmlService",
          "Utilities",
          "CacheService",
          "MailApp",
          "Calendar",
          "ScriptApp",
          "LockService",
          "ContentService",
          "availableSlots",
          "assertSlotFree",
          "availabilityResponse",
          "bookingConfig",
          "bookingSheet",
          "readRequest",
          "writeRequest",
          "escapeHtml",
          "responsePage",
          "tokenDigest",
          "validateInquiry",
          "requestSummary",
          "createInquiry",
          "authorizedRequest",
          "reviewInquiry",
          "decideInquiry",
        ].map((name) => [name, "readonly"]),
      ),
    },
  },
  {
    files: ["src/features/**/*.js"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*/components/*",
                "@/features/*/lib/*",
                "@/features/*/data/*",
              ],
              message: "Import other features through their public index.js entry point.",
            },
          ],
        },
      ],
    },
  },
]);
