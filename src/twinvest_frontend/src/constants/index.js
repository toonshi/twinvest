import { people01, people02, people03, facebook, instagram, linkedin, twitter, airbnb, binance, coinbase, dropbox, send, shield, star  } from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
     path: "/",
  },
  {
    id: "about",
    title: "About",
    path: "/#about",
  },
  {
    id: "how-it-works",
    title: "How it Works",
    path: "/#how-it-works",
  },
  {
    id: "clients",
    title: "Clients",
  },

    {
    id: "log-in",
    title: "Log-in",
    path: "/login",
    
  },
];

export const features = [
  {
    id: "about-1",
    icon: send,
    title: "Invoice Upload & NFT Investment",
    content:
      "SMEs upload unpaid invoices, while investors purchase NFT-backed invoices for discounted returns, enabling win-win financing.",
  },
  {
    id: "about-2",
    icon: star,
    title: "Liquidity for SMEs, Returns for Investors",
    content:
      "We take proactive steps make sure your information and transactions are secure.Unlocks liquidity for SMEs and provides profitable, short-term investment opportunities through tokenized invoice trading.",
  },
  {
    id: "aboout-3",
    icon: shield,
    title: "100% Secured",
    content:
      "We take proactive steps make sure your information and transactions are secure.",
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "Early Access to Cash Flow: SMEs and freelancers benefit from quicker payments without waiting 30–90 days for clients to pay.",
    name: "Herman Jensen",
    title: "Founder & Leader",
    img: people01,
  },
  {
    id: "feedback-2",
    content:
      "Decentralized & Transparent: Using smart contracts and NFTs builds trust—users can see how funds move without a middleman.",
    name: "Steve Mark",
    title: "Founder & Leader",
    img: people02,
  },
  {
    id: "feedback-3",
    content:
      "Investor Appeal: Attractive to DeFi investors seeking short-term returns with real-world use cases.",
    name: "Kenn Gallagher",
    title: "Founder & Leader",
    img: people03,
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "Invoices Tokenized",
    value: "5,200+",
  },
  {
    id: "stats-2",
    title: "Total Value Financed",
    value: "$4.5M+",
  },
  {
    id: "stats-3",
    title: "Active Investors",
    value: "1,000+",
  },
   {
    id: "stats-6",
    title: "Investor Return Rate",
    value: "7.8%",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.hoobank.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.hoobank.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.hoobank.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.hoobank.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.hoobank.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.hoobank.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.hoobank.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.hoobank.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.hoobank.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hoobank.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hoobank.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];

export const clients = [
  {
    id: "client-1",
    logo: airbnb,
  },
  {
    id: "client-2",
    logo: binance,
  },
  {
    id: "client-3",
    logo: coinbase,
  },
  {
    id: "client-4",
    logo: dropbox,
  },
];