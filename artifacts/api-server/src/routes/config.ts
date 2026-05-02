import { Router, type IRouter } from "express";

const router: IRouter = Router();

const weddingConfig = {
  coupleName: "Priya & Arjun",
  brideName: "Priya Sharma",
  groomName: "Arjun Mehta",
  weddingDate: "February 14–17, 2026",
  weddingDateTime: "2026-02-15T19:00:00+05:30",
  destination: "Udaipur, Rajasthan",
  venue: "The Oberoi Udaivilas, Udaipur",
  tagline: "Join us in the City of Lakes",
  story:
    "We met at a rooftop café in Mumbai during monsoon season — she was reading, he was lost. Three years later, we're inviting you to celebrate our forever against the backdrop of Udaipur's shimmering lakes and golden palaces. This city chose us before we chose each other.",
  destinationDescription:
    "Udaipur — the Venice of the East — is a city of white marble palaces reflected in still blue lakes, where Rajasthan's royal past lives on in every carved archway and narrow lane. Set in the Aravalli Hills, it is India's most romantic city.",
  destinationFacts: [
    "State: Rajasthan, India",
    "Best weather: October – March",
    "Vibe: Royal, romantic, lakeside",
    "Famous for: Lake Pichola, City Palace, Jag Mandir",
    "Language: Hindi / Rajasthani",
  ],
  googleMapsUrl: "https://maps.google.com/?q=Oberoi+Udaivilas+Udaipur",
  airport: {
    name: "Maharana Pratap Airport",
    code: "UDR",
    travelTime: "25 minutes to the venue",
    transferInfo: "Shared shuttles will be arranged from airport on all arrival days.",
  },
  hotels: [
    {
      name: "The Oberoi Udaivilas",
      type: "primary",
      groupCode: "PRIYAARJUN2026",
      bookingUrl: "https://www.oberoihotels.com/hotels-in-udaipur",
      checkIn: "February 13, 2026",
      checkOut: "February 18, 2026",
      description:
        "Our official wedding hotel — a palace of domes and courtyards on Lake Pichola. Use group code for special rates.",
    },
    {
      name: "Taj Lake Palace",
      type: "alternate",
      checkIn: "February 13, 2026",
      checkOut: "February 18, 2026",
      description:
        "Floating on Lake Pichola, this iconic white marble palace hotel is a luxury alternative for guests.",
    },
    {
      name: "Hotel Mahendra Prakash",
      type: "alternate",
      checkIn: "February 13, 2026",
      checkOut: "February 18, 2026",
      description:
        "Charming heritage property in the old city — perfect for guests looking for a budget-friendly stay with character.",
    },
  ],
  events: [
    {
      day: 1,
      name: "Welcome Dinner",
      date: "February 13, 2026",
      time: "7:00 PM",
      venue: "Jag Mandir Island, Lake Pichola",
      dressCode: "Royal Blues & Golds",
      description:
        "An intimate boat-ride welcome dinner on the lake island. Arrive at the Rameshwar Ghat jetty by 6:30 PM.",
    },
    {
      day: 2,
      name: "Mehendi & Haldi",
      date: "February 14, 2026",
      time: "11:00 AM",
      venue: "Poolside Lawn, Oberoi Udaivilas",
      dressCode: "Yellows & Greens",
      description:
        "A vibrant morning of colour, music and laughter. Professional mehendi artists will be present.",
    },
    {
      day: 2,
      name: "Sangeet Night",
      date: "February 14, 2026",
      time: "8:00 PM",
      venue: "Grand Ballroom, Oberoi Udaivilas",
      dressCode: "Tropical Pastels",
      description:
        "An evening of performances, dance and music. Both families have prepared surprises!",
    },
    {
      day: 3,
      name: "Wedding Ceremony",
      date: "February 15, 2026",
      time: "6:30 PM",
      venue: "Lily Pond Lawn, Oberoi Udaivilas",
      dressCode: "Royal Indian — Maroon, Gold & Ivory",
      description:
        "The main ceremony at sunset, with the lake and City Palace as our backdrop. Kindly be seated by 6:00 PM.",
    },
    {
      day: 3,
      name: "Reception Dinner",
      date: "February 15, 2026",
      time: "9:30 PM",
      venue: "Suryamahal, Oberoi Udaivilas",
      dressCode: "Black Tie / Heavy Indian Formal",
      description:
        "Celebrate the newlyweds with a grand dinner, dancing and open bar under the Rajasthan stars.",
    },
    {
      day: 4,
      name: "Farewell Brunch",
      date: "February 16, 2026",
      time: "10:30 AM",
      venue: "Terrace Restaurant, Oberoi Udaivilas",
      dressCode: "Casual Chic",
      description:
        "A relaxed morning brunch before guests depart. Checkout is at 12 PM.",
    },
  ],
  localExperiences: [
    {
      name: "City Palace Museum",
      description: "Magnificent palace complex with panoramic lake views and royal artefacts.",
      distanceFromHotel: "10 min by boat",
      category: "Heritage",
    },
    {
      name: "Lake Pichola Boat Ride",
      description: "Sunset boat tour around the lake — Udaipur's most iconic experience.",
      distanceFromHotel: "At your doorstep",
      category: "Experience",
    },
    {
      name: "Sajjangarh (Monsoon Palace)",
      description: "Hilltop fort with breathtaking views of the entire city and surrounding hills.",
      distanceFromHotel: "30 min drive",
      category: "Adventure",
    },
    {
      name: "Old City Bazaars",
      description: "Vibrant lanes of Udaipur's old city — textiles, silver jewellery and spices.",
      distanceFromHotel: "15 min by auto",
      category: "Shopping",
    },
    {
      name: "Nathdwara Temple",
      description: "Famous Shrinathji temple — a sacred and beautiful side trip for devotees.",
      distanceFromHotel: "1.5 hour drive",
      category: "Spiritual",
    },
    {
      name: "Ambrai Ghat",
      description: "The most beautiful ghat in Udaipur — perfect for sunrise photography.",
      distanceFromHotel: "20 min walk",
      category: "Scenic",
    },
  ],
  faqs: [
    {
      question: "Is Udaipur easy to reach from major cities?",
      answer:
        "Yes! Udaipur has a domestic airport (UDR) with direct flights from Delhi, Mumbai, Bengaluru and Jaipur. It's also connected by train and road.",
    },
    {
      question: "What should I pack for a February wedding in Udaipur?",
      answer:
        "February evenings in Udaipur can be cool (14–18°C). Pack a light shawl or jacket for outdoor events, along with your ethnic and formal wear per the dress codes.",
    },
    {
      question: "Is a visa required for international guests?",
      answer:
        "Yes, international guests will need an Indian visa. Most nationalities can apply for an e-Visa online at indianvisaonline.gov.in. Apply at least 2 weeks before travel.",
    },
    {
      question: "Can I bring my children?",
      answer:
        "Absolutely — children are warmly welcome! Please mention the number of children when you RSVP so we can arrange kids' activities during longer events.",
    },
    {
      question: "Will there be vegetarian food options?",
      answer:
        "All events will have extensive vegetarian and vegan options. Please mention any allergies or dietary needs in your RSVP message.",
    },
    {
      question: "Is there a shuttle service from the hotel?",
      answer:
        "Yes! We have arranged complimentary shuttles between the Oberoi Udaivilas and all event venues. Schedules will be shared via WhatsApp closer to the date.",
    },
  ],
  contacts: [
    {
      name: "Sneha Sharma",
      relation: "Bride's Sister",
      phone: "+91 98200 12345",
      whatsappUrl: "https://wa.me/919820012345",
    },
    {
      name: "Rohan Mehta",
      relation: "Groom's Brother",
      phone: "+91 98100 67890",
      whatsappUrl: "https://wa.me/919810067890",
    },
    {
      name: "Wedding Concierge",
      relation: "Travel & Stay Coordinator",
      phone: "+91 90000 11111",
      whatsappUrl: "https://wa.me/919000011111",
    },
  ],
  gallery: [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80",
  ],
};

router.get("/config", (_req, res) => {
  res.json(weddingConfig);
});

export default router;
