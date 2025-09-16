export interface SubcategoryData {
  live_link: string;
  github_link: string;
  tech_stack: string[];
  pages: string[];
  data: Record<string, any>;
}

export interface CategoryData {
  [subcategory: string]: SubcategoryData;
}

export const subcategoriesData: Record<string, CategoryData> = {
  ecommerce: {
    fashion_store: {
      live_link: "https://fashion-store-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "Stripe", "Supabase"],
      pages: ["Home", "Shop", "Product Details", "Cart", "Checkout"],
      data: {
        store_name: "TrendyWear",
        products: [
          {
            name: "Denim Jacket",
            price: 59.99,
            currency: "USD",
            image: "https://example.com/denim-jacket.png",
            category: "Jackets"
          }
        ],
        contact: {
          email: "support@trendywear.com",
          instagram: "https://instagram.com/trendywear"
        }
      }
    },
    electronics_store: {
      live_link: "https://electronics-store-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "Stripe", "MongoDB"],
      pages: ["Home", "Products", "Categories", "Cart", "Checkout"],
      data: {
        store_name: "GadgetHub",
        products: [
          {
            name: "Wireless Headphones",
            price: 129.99,
            currency: "USD",
            image: "https://example.com/headphones.png",
            category: "Audio"
          }
        ],
        contact: {
          email: "hello@gadgethub.com",
          twitter: "https://twitter.com/gadgethub"
        }
      }
    }
  },

  portfolio: {
    developer_portfolio: {
      live_link: "https://dev-portfolio-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "TypeScript", "Framer Motion", "shadcn/ui"],
      pages: ["Home", "About", "Projects", "Blog", "Contact"],
      data: {
        name: "John Doe",
        title: "Full Stack Developer",
        about: "I am a passionate developer skilled in building modern web applications.",
        projects: [
          {
            title: "AI Companion",
            description: "Custom AI chat companion builder",
            tech: ["Next.js", "OpenAI API", "Stripe"],
            link: "https://ai-companion.vercel.app"
          }
        ],
        contact: {
          email: "johndoe@example.com",
          github: "https://github.com/johndoe",
          linkedin: "https://linkedin.com/in/johndoe"
        }
      }
    },
    artist_portfolio: {
      live_link: "https://artist-portfolio-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "Sanity CMS"],
      pages: ["Home", "Gallery", "About", "Exhibitions", "Contact"],
      data: {
        name: "Emily Smith",
        title: "Digital Artist",
        about: "I create illustrations and digital art inspired by nature and emotions.",
        gallery: [
          {
            title: "Dreamscape",
            image: "https://example.com/dreamscape.png",
            year: 2024
          }
        ],
        contact: {
          email: "emilysmith@example.com",
          instagram: "https://instagram.com/emilyart"
        }
      }
    },
    business_person_portfolio: {
      live_link: "https://business-portfolio-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "TypeScript"],
      pages: ["Home", "About", "Services", "Testimonials", "Contact"],
      data: {
        name: "Sarah Johnson",
        title: "Business Consultant",
        about: "Helping businesses grow through strategic planning and execution.",
        services: ["Strategic Planning", "Market Analysis", "Team Building"],
        contact: {
          email: "sarah@businessconsult.com",
          linkedin: "https://linkedin.com/in/sarahjohnson"
        }
      }
    },
    photographer_portfolio: {
      live_link: "https://photo-portfolio-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "Cloudinary"],
      pages: ["Home", "Portfolio", "About", "Services", "Contact"],
      data: {
        name: "Alex Chen",
        title: "Professional Photographer",
        about: "Capturing moments that tell stories through my lens.",
        services: ["Wedding Photography", "Portrait Sessions", "Event Coverage"],
        contact: {
          email: "alex@photostudio.com",
          instagram: "https://instagram.com/alexchenphotos"
        }
      }
    }
  },

  blog: {
    personal_blog: {
      live_link: "https://personal-blog-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "MDX", "Supabase"],
      pages: ["Home", "Articles", "Categories", "About", "Contact"],
      data: {
        author: "Jane Doe",
        bio: "Writer & Traveler sharing thoughts and experiences.",
        posts: [
          {
            title: "My Trip to Bali",
            slug: "trip-to-bali",
            content: "This is a story about my Bali journey...",
            tags: ["travel", "lifestyle"]
          }
        ],
        contact: {
          email: "jane@example.com",
          twitter: "https://twitter.com/janeblogs"
        }
      }
    },
    tech_blog: {
      live_link: "https://tech-blog-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "TypeScript", "Contentlayer"],
      pages: ["Home", "Tutorials", "Guides", "Projects", "About"],
      data: {
        author: "Mike Ross",
        bio: "Software Engineer writing tutorials on modern web tech.",
        posts: [
          {
            title: "Next.js 15 New Features",
            slug: "nextjs-15-features",
            content: "Next.js 15 introduced app router improvements...",
            tags: ["nextjs", "javascript"]
          }
        ],
        contact: {
          email: "mike@example.com",
          github: "https://github.com/mikeross"
        }
      }
    },
    travel_blog: {
      live_link: "https://travel-blog-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "Prisma", "PostgreSQL"],
      pages: ["Home", "Destinations", "Travel Tips", "About", "Contact"],
      data: {
        author: "Lisa Adventure",
        bio: "Exploring the world one destination at a time.",
        destinations: ["Bali", "Tokyo", "Paris", "New York"],
        contact: {
          email: "lisa@traveladventure.com",
          instagram: "https://instagram.com/lisaadventure"
        }
      }
    }
  },

  social: {
    friend_connection_app: {
      live_link: "https://social-connect-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "Socket.io", "PostgreSQL"],
      pages: ["Feed", "Friends", "Messages", "Profile", "Settings"],
      data: {
        app_name: "SocialConnect",
        features: ["Real-time messaging", "Friend requests", "Photo sharing", "Status updates"],
        contact: {
          email: "support@socialconnect.com"
        }
      }
    },
    professional_networking_app: {
      live_link: "https://pro-network-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "TypeScript", "Prisma"],
      pages: ["Dashboard", "Network", "Jobs", "Messages", "Profile"],
      data: {
        app_name: "ProNetwork",
        features: ["Professional profiles", "Job postings", "Skill endorsements", "Company pages"],
        contact: {
          email: "hello@pronetwork.com"
        }
      }
    }
  },

  saas_tools: {
    project_management_tool: {
      live_link: "https://project-mgmt-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "TypeScript", "Prisma", "Stripe"],
      pages: ["Dashboard", "Projects", "Tasks", "Team", "Reports"],
      data: {
        app_name: "TaskFlow",
        features: ["Kanban boards", "Time tracking", "Team collaboration", "Reporting"],
        pricing: ["Free", "Pro $9/month", "Team $19/month"],
        contact: {
          email: "support@taskflow.com"
        }
      }
    },
    note_taking_app: {
      live_link: "https://notes-app-example.vercel.app",
      github_link: "https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git",
      tech_stack: ["Next.js", "TailwindCSS", "TypeScript", "Supabase"],
      pages: ["Dashboard", "Notes", "Folders", "Search", "Settings"],
      data: {
        app_name: "NoteMaster",
        features: ["Rich text editor", "Folder organization", "Search", "Sync across devices"],
        contact: {
          email: "hello@notemaster.com"
        }
      }
    }
  }
};

export const subcategories = {
  ecommerce: [
    "single vendor store",
    "multi vendor marketplace",
    "digital products store",
    "subscription box store",
    "dropshipping store",
    "fashion ecommerce",
    "electronics ecommerce",
    "handmade crafts store",
    "books & stationery store",
    "furniture ecommerce"
  ],
  portfolio: [
    "developer portfolio",
    "artist portfolio",
    "business person portfolio",
    "photographer portfolio",
    "designer portfolio",
    "writer/author portfolio",
    "musician portfolio",
    "student/academic portfolio",
    "startup founder portfolio",
    "actor/model portfolio"
  ],
  blog: [
    "personal blog",
    "tech blog",
    "travel blog",
    "food blog",
    "fashion blog",
    "lifestyle blog",
    "health & fitness blog",
    "business & finance blog",
    "educational blog",
    "news & current affairs blog"
  ],
  social: [
    "friend connection app",
    "professional networking app",
    "dating app",
    "community forum",
    "microblogging platform",
    "photo sharing app",
    "short video sharing app",
    "gaming community platform",
    "book lovers club",
    "music community"
  ],
  saas_tools: [
    "project management tool",
    "team collaboration app",
    "note-taking app",
    "time tracking tool",
    "habit tracker",
    "CRM system",
    "invoice management app",
    "AI content generator",
    "form builder",
    "resume builder"
  ],
  education: [
    "online course platform",
    "quiz app",
    "flashcards app",
    "student-teacher portal",
    "assignment submission portal",
    "exam preparation app",
    "language learning app",
    "virtual classroom",
    "career guidance app",
    "college alumni network"
  ],
  health_fitness: [
    "workout tracker",
    "meal planner",
    "diet tracking app",
    "yoga guidance app",
    "mental health journal",
    "doctor appointment booking",
    "telemedicine app",
    "fitness community app",
    "sleep tracker",
    "step counter app"
  ],
  finance: [
    "expense tracker",
    "budget planner",
    "stock market portfolio tracker",
    "crypto wallet",
    "personal finance dashboard",
    "loan calculator app",
    "subscription tracker",
    "investment guidance app",
    "freelancer invoicing app",
    "savings goal tracker"
  ],
  entertainment: [
    "movie review site",
    "music streaming app",
    "book reading & sharing app",
    "podcast platform",
    "meme sharing app",
    "event ticket booking app",
    "sports updates app",
    "gaming leaderboard",
    "fan club platform",
    "OTT content aggregator"
  ],
  productivity: [
    "to-do list app",
    "kanban board app",
    "calendar scheduling app",
    "daily journal",
    "focus timer / pomodoro app",
    "mind mapping tool",
    "document collaboration app",
    "knowledge base app",
    "file sharing system",
    "task automation tool"
  ],
  travel: [
    "trip planner",
    "hotel booking app",
    "flight booking app",
    "itinerary sharing app",
    "local guide explorer",
    "ride sharing app",
    "car rental app",
    "travel community",
    "language translator",
    "currency converter"
  ],
  others: [
    "job board",
    "freelancer marketplace",
    "NGO website",
    "real estate platform",
    "restaurant ordering system",
    "food delivery app",
    "grocery delivery app",
    "event management app",
    "dating-matrimony hybrid app",
    "AI companion/chatbot app"
  ]
};