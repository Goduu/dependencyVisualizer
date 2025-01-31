export const diagramDataEx = {
    "nodes": [
        {
            "path": "next.config.ts",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "nextConfig"
                ]
            },
            "imports": [
                {
                    "source": "next",
                    "items": [
                        "NextConfig"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/app/api/graphql/route.ts",
            "exports": {
                "functions": [
                    "GET",
                    "POST"
                ],
                "components": [],
                "variables": [
                    "driver",
                    "neo4jGraphQL",
                    "schema",
                    "server",
                    "handler"
                ]
            },
            "imports": [
                {
                    "source": "neo4j-driver",
                    "items": [
                        "neo4j"
                    ]
                },
                {
                    "source": "@as-integrations/next",
                    "items": [
                        "startServerAndCreateNextHandler"
                    ]
                },
                {
                    "source": "@apollo/server",
                    "items": [
                        "ApolloServer"
                    ]
                },
                {
                    "source": "@neo4j/graphql",
                    "items": [
                        "Neo4jGraphQL"
                    ]
                },
                {
                    "source": "next/server",
                    "items": [
                        "NextRequest"
                    ]
                },
                {
                    "source": "@/ogm-resolver/schema",
                    "items": [
                        "typeDefs"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/app/api/openai/route.ts",
            "exports": {
                "functions": [
                    "POST"
                ],
                "components": [],
                "variables": [
                    "body",
                    "text",
                    "token",
                    "endpoint",
                    "modelName",
                    "openai",
                    "completion",
                    "aiResponse",
                    "test"
                ]
            },
            "imports": [
                {
                    "source": "@/lib/prompt",
                    "items": [
                        "promptText"
                    ]
                },
                {
                    "source": "@/lib/validateApiReturnObject",
                    "items": [
                        "validateApiReturnObject"
                    ]
                },
                {
                    "source": "next/server",
                    "items": [
                        "NextRequest"
                    ]
                },
                {
                    "source": "openai",
                    "items": [
                        "OpenAI"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/app/layout.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "RootLayout"
                ],
                "variables": [
                    "geistSans",
                    "geistMono",
                    "metadata"
                ]
            },
            "imports": [
                {
                    "source": "next",
                    "items": [
                        "Metadata"
                    ]
                },
                {
                    "source": "next/font/local",
                    "items": [
                        "localFont"
                    ]
                },
                {
                    "source": "@/components/page-menu/page-menu",
                    "items": [
                        "PageMenu"
                    ]
                },
                {
                    "source": "@/lib/apollo-provider",
                    "items": [
                        "ApolloWrapper"
                    ]
                },
                {
                    "source": "@/components/logo",
                    "items": [
                        "Logo"
                    ]
                },
                {
                    "source": "next/navigation",
                    "items": [
                        "redirect"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/app/page.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "Home"
                ],
                "variables": []
            },
            "imports": [
                {
                    "source": "@/components/text-input/text-input-page",
                    "items": [
                        "TextInputPage"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/app/patient-data/[patientId]/page.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientDetails"
                ],
                "variables": [
                    "PatientDetails"
                ]
            },
            "imports": [
                {
                    "source": "@/components/patient/details-page/patient-data-card-skeleton",
                    "items": [
                        "PatientDataCardSkeleton"
                    ]
                },
                {
                    "source": "@/components/patient/details-page/patient-details-page",
                    "items": [
                        "PatientDetailsPage"
                    ]
                },
                {
                    "source": "react",
                    "items": [
                        "React",
                        "Suspense",
                        "use"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/app/patient-data/page.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientInformation"
                ],
                "variables": [
                    "PatientInformation"
                ]
            },
            "imports": [
                {
                    "source": "@/components/patient/cards-page/patient-cards-page",
                    "items": [
                        "PatientCardsPage"
                    ]
                },
                {
                    "source": "react",
                    "items": [
                        "React"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/app/text-input/page.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "TextInput"
                ],
                "variables": [
                    "TextInput"
                ]
            },
            "imports": [
                {
                    "source": "@/components/text-input/text-input-page",
                    "items": [
                        "TextInputPage"
                    ]
                },
                {
                    "source": "react",
                    "items": [
                        "React"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/logo.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "Logo"
                ],
                "variables": []
            },
            "imports": [
                {
                    "source": "next/navigation",
                    "items": [
                        "redirect"
                    ]
                },
                {
                    "source": "react",
                    "items": [
                        "FC",
                        "SVGProps"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/page-menu/page-menu.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PageMenu"
                ],
                "variables": [
                    "menuItems"
                ]
            },
            "imports": [
                {
                    "source": "react",
                    "items": [
                        "React"
                    ]
                },
                {
                    "source": "../ui/navigation-menu",
                    "items": [
                        "NavigationMenu",
                        "NavigationMenuItem",
                        "NavigationMenuLink",
                        "NavigationMenuList",
                        "NavigationMenuTrigger",
                        "navigationMenuTriggerStyle"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/cards-page/patient-cards-page.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientCardsPage"
                ],
                "variables": [
                    "PatientCardsPage"
                ]
            },
            "imports": [
                {
                    "source": "../../ui/card",
                    "items": [
                        "Card",
                        "CardHeader",
                        "CardTitle"
                    ]
                },
                {
                    "source": "@apollo/client",
                    "items": [
                        "useQuery"
                    ]
                },
                {
                    "source": "@/lib/gqls/patientGQLs",
                    "items": [
                        "GET_PATIENTS_ID_NAME"
                    ]
                },
                {
                    "source": "next/navigation",
                    "items": [
                        "redirect"
                    ]
                },
                {
                    "source": "./patient-cards-skeleton",
                    "items": [
                        "PatientCardsSkeleton"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/cards-page/patient-cards-skeleton.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientCardsSkeleton"
                ],
                "variables": []
            },
            "imports": [
                {
                    "source": "@/components/ui/skeleton",
                    "items": [
                        "Skeleton"
                    ]
                },
                {
                    "source": "react",
                    "items": [
                        "React"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/details-page/patient-basic-information.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientBasicInformation"
                ],
                "variables": []
            },
            "imports": [
                {
                    "source": "react",
                    "items": [
                        "React",
                        "FC"
                    ]
                },
                {
                    "source": "lucide-react",
                    "items": [
                        "User"
                    ]
                },
                {
                    "source": "@/ogm-resolver/ogm-types",
                    "items": [
                        "Patient"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/details-page/patient-data-card-skeleton.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientDataCardSkeleton"
                ],
                "variables": []
            },
            "imports": [
                {
                    "source": "@/components/ui/skeleton",
                    "items": [
                        "Skeleton"
                    ]
                },
                {
                    "source": "react",
                    "items": [
                        "React"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/details-page/patient-details-page.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientDetailsPage"
                ],
                "variables": []
            },
            "imports": [
                {
                    "source": "react",
                    "items": [
                        "React",
                        "FC"
                    ]
                },
                {
                    "source": "./patient-information-card",
                    "items": [
                        "PatientDataCard"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/details-page/patient-information-card.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientDataCard"
                ],
                "variables": [
                    "patientData",
                    "PatientDataCard"
                ]
            },
            "imports": [
                {
                    "source": "../../ui/card",
                    "items": [
                        "Card",
                        "CardContent",
                        "CardHeader",
                        "CardTitle"
                    ]
                },
                {
                    "source": "./patient-basic-information",
                    "items": [
                        "PatientBasicInformation"
                    ]
                },
                {
                    "source": "./patient-medication",
                    "items": [
                        "PatientMedication"
                    ]
                },
                {
                    "source": "./patient-shift-notes",
                    "items": [
                        "PatientShiftNotes"
                    ]
                },
                {
                    "source": "./patient-vitals",
                    "items": [
                        "PatientVitals"
                    ]
                },
                {
                    "source": "@/ogm-resolver/ogm-types",
                    "items": [
                        "Patient"
                    ]
                },
                {
                    "source": "@apollo/client",
                    "items": [
                        "useQuery"
                    ]
                },
                {
                    "source": "@/lib/gqls/patientGQLs",
                    "items": [
                        "GET_PATIENT"
                    ]
                },
                {
                    "source": "./patient-data-card-skeleton",
                    "items": [
                        "PatientDataCardSkeleton"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/details-page/patient-medication.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientMedication"
                ],
                "variables": []
            },
            "imports": [
                {
                    "source": "react",
                    "items": [
                        "React",
                        "FC"
                    ]
                },
                {
                    "source": "lucide-react",
                    "items": [
                        "Tablets"
                    ]
                },
                {
                    "source": "@/ogm-resolver/ogm-types",
                    "items": [
                        "Patient"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/details-page/patient-shift-notes.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientShiftNotes"
                ],
                "variables": [
                    "lastShiftSummary",
                    "lastNextShift"
                ]
            },
            "imports": [
                {
                    "source": "react",
                    "items": [
                        "React",
                        "FC"
                    ]
                },
                {
                    "source": "../../ui/textarea",
                    "items": [
                        "Textarea"
                    ]
                },
                {
                    "source": "lucide-react",
                    "items": [
                        "NotebookPen"
                    ]
                },
                {
                    "source": "@/ogm-resolver/ogm-types",
                    "items": [
                        "Patient"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/details-page/patient-vitals.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "PatientVitals"
                ],
                "variables": [
                    "lastVital"
                ]
            },
            "imports": [
                {
                    "source": "react",
                    "items": [
                        "React",
                        "FC"
                    ]
                },
                {
                    "source": "lucide-react",
                    "items": [
                        "Activity"
                    ]
                },
                {
                    "source": "@/ogm-resolver/ogm-types",
                    "items": [
                        "VitalsObservation"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/patient/types.ts",
            "exports": {
                "functions": [],
                "components": [],
                "variables": []
            },
            "imports": [],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/text-input/createPatient.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "useCreatePatient",
                    "createPatient",
                    "dateNow"
                ]
            },
            "imports": [
                {
                    "source": "@apollo/client",
                    "items": [
                        "useMutation"
                    ]
                },
                {
                    "source": "../patient/types",
                    "items": [
                        "PatientData"
                    ]
                },
                {
                    "source": "@/lib/gqls/patientGQLs",
                    "items": [
                        "CREATE_PATIENT"
                    ]
                }
            ],
            "hooks": [
                {
                    "name": "useCreatePatient",
                    "dependencies": []
                }
            ],
            "hocs": []
        },
        {
            "path": "src/components/text-input/processTextInput.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "transformInputIntoData",
                    "apiResult",
                    "apiResponse",
                    "validatedResponse"
                ]
            },
            "imports": [
                {
                    "source": "@/lib/validateApiReturnObject",
                    "items": [
                        "validateApiReturnObject"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/text-input/text-input-page.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "TextInputPage"
                ],
                "variables": [
                    "createPatient",
                    "handlePatientData",
                    "patientData"
                ]
            },
            "imports": [
                {
                    "source": "react",
                    "items": [
                        "React",
                        "FC",
                        "useState",
                        "useTransition"
                    ]
                },
                {
                    "source": "../ui/textarea",
                    "items": [
                        "Textarea"
                    ]
                },
                {
                    "source": "../ui/button",
                    "items": [
                        "Button"
                    ]
                },
                {
                    "source": "../patient/types",
                    "items": [
                        "PatientData"
                    ]
                },
                {
                    "source": "./processTextInput",
                    "items": [
                        "transformInputIntoData"
                    ]
                },
                {
                    "source": "./createPatient",
                    "items": [
                        "useCreatePatient"
                    ]
                },
                {
                    "source": "lucide-react",
                    "items": [
                        "Spline"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/accordion.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "Accordion",
                    "AccordionItem",
                    "AccordionTrigger",
                    "AccordionContent"
                ]
            },
            "imports": [
                {
                    "source": "lucide-react",
                    "items": [
                        "ChevronDown"
                    ]
                },
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/button.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "buttonVariants",
                    "Button",
                    "Comp"
                ]
            },
            "imports": [
                {
                    "source": "@radix-ui/react-slot",
                    "items": [
                        "Slot"
                    ]
                },
                {
                    "source": "class-variance-authority",
                    "items": [
                        "cva",
                        "VariantProps"
                    ]
                },
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/card.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "Card",
                    "CardHeader",
                    "CardTitle",
                    "CardDescription",
                    "CardContent",
                    "CardFooter"
                ]
            },
            "imports": [
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/checkbox.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "Checkbox"
                ]
            },
            "imports": [
                {
                    "source": "lucide-react",
                    "items": [
                        "Check"
                    ]
                },
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/input.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "Input"
                ]
            },
            "imports": [
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/menubar.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "MenubarShortcut"
                ],
                "variables": [
                    "MenubarMenu",
                    "MenubarGroup",
                    "MenubarPortal",
                    "MenubarSub",
                    "MenubarRadioGroup",
                    "Menubar",
                    "MenubarTrigger",
                    "MenubarSubTrigger",
                    "MenubarSubContent",
                    "MenubarContent",
                    "MenubarItem",
                    "MenubarCheckboxItem",
                    "MenubarRadioItem",
                    "MenubarLabel",
                    "MenubarSeparator",
                    "MenubarShortcut"
                ]
            },
            "imports": [
                {
                    "source": "lucide-react",
                    "items": [
                        "Check",
                        "ChevronRight",
                        "Circle"
                    ]
                },
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/navigation-menu.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "NavigationMenu",
                    "NavigationMenuList",
                    "NavigationMenuItem",
                    "navigationMenuTriggerStyle",
                    "NavigationMenuTrigger",
                    "NavigationMenuContent",
                    "NavigationMenuLink",
                    "NavigationMenuViewport",
                    "NavigationMenuIndicator"
                ]
            },
            "imports": [
                {
                    "source": "class-variance-authority",
                    "items": [
                        "cva"
                    ]
                },
                {
                    "source": "lucide-react",
                    "items": [
                        "ChevronDown"
                    ]
                },
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/skeleton.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "Skeleton"
                ],
                "variables": [
                    "Skeleton"
                ]
            },
            "imports": [
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/components/ui/textarea.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "Textarea"
                ]
            },
            "imports": [
                {
                    "source": "@/lib/utils",
                    "items": [
                        "cn"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/lib/apollo-provider.tsx",
            "exports": {
                "functions": [],
                "components": [
                    "ApolloWrapper"
                ],
                "variables": [
                    "client"
                ]
            },
            "imports": [
                {
                    "source": "@apollo/client",
                    "items": [
                        "ApolloClient",
                        "ApolloProvider",
                        "InMemoryCache"
                    ]
                },
                {
                    "source": "react",
                    "items": [
                        "FC"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/lib/gqls/patientGQLs.ts",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "GET_PATIENTS_ID_NAME",
                    "GET_PATIENT",
                    "CREATE_PATIENT",
                    "UPDATE_PATIENT",
                    "DELETE_TAG"
                ]
            },
            "imports": [
                {
                    "source": "@apollo/client",
                    "items": [
                        "gql"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/lib/prompt.ts",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "promptText"
                ]
            },
            "imports": [],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/lib/utils.ts",
            "exports": {
                "functions": [
                    "cn"
                ],
                "components": [],
                "variables": []
            },
            "imports": [
                {
                    "source": "clsx",
                    "items": [
                        "clsx",
                        "ClassValue"
                    ]
                },
                {
                    "source": "tailwind-merge",
                    "items": [
                        "twMerge"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/lib/validateApiReturnObject.tsx",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "defaultPatientData",
                    "validateApiReturnObject",
                    "data",
                    "validatedData"
                ]
            },
            "imports": [
                {
                    "source": "@/components/patient/types",
                    "items": [
                        "PatientData"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/ogm-resolver/index.js",
            "exports": {
                "functions": [
                    "main"
                ],
                "components": [],
                "variables": [
                    "driver",
                    "ogm",
                    "resolvers",
                    "neoSchema",
                    "outFile",
                    "server"
                ]
            },
            "imports": [
                {
                    "source": "@apollo/server",
                    "items": [
                        "ApolloServer"
                    ]
                },
                {
                    "source": "@apollo/server/standalone",
                    "items": [
                        "startStandaloneServer"
                    ]
                },
                {
                    "source": "@neo4j/graphql",
                    "items": [
                        "Neo4jGraphQL"
                    ]
                },
                {
                    "source": "@neo4j/graphql-ogm",
                    "items": [
                        "pkg"
                    ]
                },
                {
                    "source": "neo4j-driver",
                    "items": [
                        "neo4j"
                    ]
                },
                {
                    "source": "./schema.js",
                    "items": [
                        "typeDefs"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/ogm-resolver/ogm-types.ts",
            "exports": {
                "functions": [],
                "components": [],
                "variables": []
            },
            "imports": [
                {
                    "source": "graphql",
                    "items": [
                        "SelectionSetNode",
                        "DocumentNode"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/ogm-resolver/schema.js",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "typeDefs"
                ]
            },
            "imports": [],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "src/ogm-resolver/utils.js",
            "exports": {
                "functions": [
                    "createJWT",
                    "comparePassword"
                ],
                "components": [],
                "variables": []
            },
            "imports": [
                {
                    "source": "bcrypt",
                    "items": [
                        "bcrypt"
                    ]
                },
                {
                    "source": "jsonwebtoken",
                    "items": [
                        "jwt"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        },
        {
            "path": "tailwind.config.ts",
            "exports": {
                "functions": [],
                "components": [],
                "variables": [
                    "config"
                ]
            },
            "imports": [
                {
                    "source": "tailwindcss",
                    "items": [
                        "Config"
                    ]
                }
            ],
            "hooks": [],
            "hocs": []
        }
    ],
    "edges": [
        {
            "from": "src/ogm-resolver/schema.js",
            "to": "src/app/api/graphql/route.ts",
            "type": "import"
        },
        {
            "from": "src/lib/prompt.ts",
            "to": "src/app/api/openai/route.ts",
            "type": "import"
        },
        {
            "from": "src/lib/validateApiReturnObject.tsx",
            "to": "src/app/api/openai/route.ts",
            "type": "import"
        },
        {
            "from": "src/components/page-menu/page-menu.tsx",
            "to": "src/app/layout.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/apollo-provider.tsx",
            "to": "src/app/layout.tsx",
            "type": "import"
        },
        {
            "from": "src/components/logo.tsx",
            "to": "src/app/layout.tsx",
            "type": "import"
        },
        {
            "from": "src/components/text-input/text-input-page.tsx",
            "to": "src/app/page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/details-page/patient-data-card-skeleton.tsx",
            "to": "src/app/patient-data/[patientId]/page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/details-page/patient-details-page.tsx",
            "to": "src/app/patient-data/[patientId]/page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/cards-page/patient-cards-page.tsx",
            "to": "src/app/patient-data/page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/text-input/text-input-page.tsx",
            "to": "src/app/text-input/page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/ui/navigation-menu.tsx",
            "to": "src/components/page-menu/page-menu.tsx",
            "type": "import"
        },
        {
            "from": "src/components/ui/card.tsx",
            "to": "src/components/patient/cards-page/patient-cards-page.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/gqls/patientGQLs.ts",
            "to": "src/components/patient/cards-page/patient-cards-page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/cards-page/patient-cards-skeleton.tsx",
            "to": "src/components/patient/cards-page/patient-cards-page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/ui/skeleton.tsx",
            "to": "src/components/patient/cards-page/patient-cards-skeleton.tsx",
            "type": "import"
        },
        {
            "from": "src/ogm-resolver/ogm-types.ts",
            "to": "src/components/patient/details-page/patient-basic-information.tsx",
            "type": "import"
        },
        {
            "from": "src/components/ui/skeleton.tsx",
            "to": "src/components/patient/details-page/patient-data-card-skeleton.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/details-page/patient-information-card.tsx",
            "to": "src/components/patient/details-page/patient-details-page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/ui/card.tsx",
            "to": "src/components/patient/details-page/patient-information-card.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/details-page/patient-basic-information.tsx",
            "to": "src/components/patient/details-page/patient-information-card.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/details-page/patient-medication.tsx",
            "to": "src/components/patient/details-page/patient-information-card.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/details-page/patient-shift-notes.tsx",
            "to": "src/components/patient/details-page/patient-information-card.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/details-page/patient-vitals.tsx",
            "to": "src/components/patient/details-page/patient-information-card.tsx",
            "type": "import"
        },
        {
            "from": "src/ogm-resolver/ogm-types.ts",
            "to": "src/components/patient/details-page/patient-information-card.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/gqls/patientGQLs.ts",
            "to": "src/components/patient/details-page/patient-information-card.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/details-page/patient-data-card-skeleton.tsx",
            "to": "src/components/patient/details-page/patient-information-card.tsx",
            "type": "import"
        },
        {
            "from": "src/ogm-resolver/ogm-types.ts",
            "to": "src/components/patient/details-page/patient-medication.tsx",
            "type": "import"
        },
        {
            "from": "src/components/ui/textarea.tsx",
            "to": "src/components/patient/details-page/patient-shift-notes.tsx",
            "type": "import"
        },
        {
            "from": "src/ogm-resolver/ogm-types.ts",
            "to": "src/components/patient/details-page/patient-shift-notes.tsx",
            "type": "import"
        },
        {
            "from": "src/ogm-resolver/ogm-types.ts",
            "to": "src/components/patient/details-page/patient-vitals.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/types.ts",
            "to": "src/components/text-input/createPatient.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/gqls/patientGQLs.ts",
            "to": "src/components/text-input/createPatient.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/validateApiReturnObject.tsx",
            "to": "src/components/text-input/processTextInput.tsx",
            "type": "import"
        },
        {
            "from": "src/components/ui/textarea.tsx",
            "to": "src/components/text-input/text-input-page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/ui/button.tsx",
            "to": "src/components/text-input/text-input-page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/types.ts",
            "to": "src/components/text-input/text-input-page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/text-input/processTextInput.tsx",
            "to": "src/components/text-input/text-input-page.tsx",
            "type": "import"
        },
        {
            "from": "src/components/text-input/createPatient.tsx",
            "to": "src/components/text-input/text-input-page.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/accordion.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/button.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/card.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/checkbox.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/input.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/menubar.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/navigation-menu.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/skeleton.tsx",
            "type": "import"
        },
        {
            "from": "src/lib/utils.ts",
            "to": "src/components/ui/textarea.tsx",
            "type": "import"
        },
        {
            "from": "src/components/patient/types.ts",
            "to": "src/lib/validateApiReturnObject.tsx",
            "type": "import"
        },
        {
            "from": "src/ogm-resolver/schema.js",
            "to": "src/ogm-resolver/index.js",
            "type": "import"
        }
    ]
}