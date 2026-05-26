export const MOCK_WEDDING_CONFIG = {
  coupleName: "Aryan & Myra",
  brideName: "Myra Singh",
  groomName: "Aryan Malhotra",
  weddingDate: "December 24, 2026",
  weddingDateTime: new Date("2026-12-24T18:00:00Z"),
  destination: "Udaipur, Rajasthan",
  venue: "The Oberoi Udaivilas",
  tagline: "A Royal Celebration of Love",
  story: "Our journey began in a small cafe in Mumbai. From late-night coffee talks to traveling across the globe, we found our forever in each other.",
  destinationDescription: "Known as the City of Lakes, Udaipur is a jewel in the crown of Rajasthan. Its majestic palaces and serene lakes provide the perfect backdrop for our union.",
  destinationFacts: ["Founded in 1553 by Maharana Udai Singh II", "Often called the Venice of the East", "Surrounded by the Aravalli Range"],
  googleMapsUrl: "https://maps.app.goo.gl/example",
  airport: {
    name: "Maharana Pratap Airport",
    code: "UDR",
    travelTime: "45 minutes",
    transferInfo: "Shuttle services will be available for all guests."
  },
  hotels: [
    {
      name: "The Oberoi Udaivilas",
      type: "primary",
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      description: "A luxury resort spread across 50 acres with spectacular views."
    }
  ],
  events: [
    {
      day: 1,
      name: "Mehndi Ceremony",
      date: "Dec 23, 2026",
      time: "2:00 PM",
      venue: "Mewar Terrace",
      dressCode: "Festive & Vibrant (Yellow/Green)",
      description: "Kick off the celebrations with intricate henna designs, colorful drapes, and traditional folk music."
    },
    {
      day: 1,
      name: "Sangeet Night",
      date: "Dec 23, 2026",
      time: "7:00 PM",
      venue: "Chandra Mahal Ballroom",
      dressCode: "Royal & Glittering",
      description: "An evening of dance, music, and spectacular family performances under the glittering chandeliers."
    },
    {
      day: 2,
      name: "Haldi Ceremony",
      date: "Dec 24, 2026",
      time: "11:00 AM",
      venue: "Udaivilas Lakeside Gardens",
      dressCode: "Shades of Yellow",
      description: "A joyful celebration of laughter, love, and turmeric blessings by the serene Pichola lake."
    },
    {
      day: 2,
      name: "Wedding Ceremony (Phere)",
      date: "Dec 24, 2026",
      time: "6:00 PM",
      venue: "Grand Mandap Lawns",
      dressCode: "Traditional Royal Indian",
      description: "The sacred union where we take our seven vows under the sunset sky."
    },
    {
      day: 3,
      name: "Grand Reception",
      date: "Dec 25, 2026",
      time: "8:00 PM",
      venue: "Lakeview Pavilions",
      dressCode: "Western Formal / Tuxedo & Gowns",
      description: "Raise a toast to our new beginning! Join us for a grand royal feast, live music, and endless celebrations."
    }
  ],
  localExperiences: [
    {
      name: "Lake Pichola Boat Ride",
      description: "A serene experience watching the sunset over the water.",
      distanceFromHotel: "15 mins",
      category: "Sightseeing"
    }
  ],
  faqs: [
    {
      question: "What is the dress code?",
      answer: "We recommend traditional Indian wear for the main ceremony."
    }
  ],
  contacts: [
    {
      name: "Karan Singh",
      relation: "Bride's Brother",
      phone: "+91 87654 32109",
      whatsappUrl: "https://wa.me/918765432109"
    },
    {
      name: "Rahul Malhotra",
      relation: "Groom's Brother",
      phone: "+91 98765 43210",
      whatsappUrl: "https://wa.me/919876543210"
    },
    {
      name: "Anjali Sharma",
      relation: "Wedding Coordinator",
      phone: "+91 95555 12345",
      whatsappUrl: "https://wa.me/919555512345"
    }
  ],
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552",
      category: "couple",
      caption: "Love in Udaipur"
    },
    {
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
      category: "events",
      caption: "Grand Sangeet Celebrations"
    },
    {
      url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",
      category: "couple",
      caption: "Eternal Promises"
    },
    {
      url: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f",
      category: "events",
      caption: "Traditional Mehndi Design"
    },
    {
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
      category: "couple",
      caption: "The Royal Union"
    },
    {
      url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff",
      category: "decor",
      caption: "Lakeview Wedding Mandap"
    },
    {
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
      category: "events",
      caption: "Stunning Haldi Blessings"
    },
    {
      url: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914",
      category: "decor",
      caption: "Glimmering Palace Lighting"
    }
  ],
  rsvp: {
    rsvpType: "detailed",
    allowEditRsvp: true,
    form: {
      fields: [
        { 
          id: "guestCount", 
          type: "number", 
          label: "Number of Guests", 
          placeholder: "e.g. 2", 
          required: true 
        },
        { 
          id: "arrivalTime", 
          type: "time", 
          label: "Expected Arrival Time", 
          required: false 
        },
        { 
          id: "mealPreference", 
          type: "select", 
          label: "Meal Preference", 
          options: ["Veg", "Jain", "Non-Veg"], 
          required: false 
        }
      ]
    }
  }
};
