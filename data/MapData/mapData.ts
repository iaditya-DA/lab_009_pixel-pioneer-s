// data/monasteries.ts

export type MonasteryImage = {
  id: string
  title: string
  iframe: string
}

export type Monastery = {
  id: string
  name: string
  images: MonasteryImage[]
}

export const monasteries: Monastery[] = [
  {
    id: "lingdum",
    name: "Lingdum Monastery",
    images: [
      {
        id: "lingdum-1",
        title: "Compound Area View",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764525201930!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ011T2JkcmdF!2m2!1d27.33118603686677!2d88.5790941249777!3f352.68292!4f0!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      }
    ]
  },

  {
    id: "rumtek",
    name: "Rumtek Monastery",
    images: [
      {
        id: "rumtek-1",
        title: "Inside View 1",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764524041324!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRHNqdWI4aWdF!2m2!1d27.30591310250971!2d88.53630179386377!3f275.7345161240274!4f5.477707447526157!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      },
      {
        id: "rumtek-2",
        title: "Chakra View",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764524156937!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2tzTVh5b0FF!2m2!1d27.2886859898702!2d88.56146202338051!3f57.41088000000002!4f30!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      },
      {
        id: "rumtek-3",
        title: "Inside View 2",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764523702223!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0VndFRIUmc.!2m2!1d27.28862027053181!2d88.56148053028257!3f134.68697375747612!4f0.6627307544701324!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      }
    ]
  },

  {
    id: "enchey",
    name: "Enchey Monastery",
    images: [
      {
        id: "enchey-1",
        title: "Street View of Ecnhey Monastery",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764524368514!6m8!1m7!1sCAoSHENJQUJJaEFHYnl3NzZRUTJybWVyQWpZQURtTXI.!2m2!1d27.33593677395685!2d88.61916587167339!3f342.9510452273146!4f-3.0607384341841026!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      },
      {
        id: "enchey-2",
        title: "Ground View of Enchey Monastery",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764524605120!6m8!1m7!1sCAoSHENJQUJJaEFHYnlmUVF3WEFFMmVudUt3QUNhTTA.!2m2!1d27.33593677395685!2d88.61916587167339!3f120!4f0!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      }
    ]
  },

  {
    id: "tashiding",
    name: "Tashiding Monastery",
    images: [
      {
        id: "tashiding-1",
        title: "Buddha View",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764524855322!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0V6b09UVnc.!2m2!1d27.3080960299431!2d88.29783391014004!3f281.05037604022704!4f28.815979173410383!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      },
      {
        id: "tashiding-2",
        title: "Ancient Scripture View",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764524923152!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0V6djM1LUFF!2m2!1d27.307710898809!2d88.2976437708665!3f20!4f0!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      },
      {
        id: "tashiding-3",
        title: "Traditional Rituals View",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764524966220!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0V6djMyRXc.!2m2!1d27.3096481906329!2d88.29746127199051!3f300!4f20!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      }
    ]
  },

  {
    id: "dubdi",
    name: "Dubdi Monastery",
    images: [
      {
        id: "dubdi-1",
        title: "Front View of Dubdi Monastery",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764525056826!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0VfNWJDZlE.!2m2!1d27.36641022759916!2d88.22990891649984!3f244.40842083765293!4f-1.9831953465591567!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      },
      {
        id: "dubdi-2",
        title: "Side View of Dubdi Monastery",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764525101997!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRFVpdHkxNndF!2m2!1d27.36655288826205!2d88.22999220879571!3f92.28508514075651!4f5.090876759665065!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      },
      {
        id: "dubdi-3",
        title: "Garden Area View of Dubdi Monastery",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764525153176!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRFVpdHluWGc.!2m2!1d27.36655288826205!2d88.22999220879571!3f14.780503204286958!4f10.16841654723666!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      }
    ]
  },

  {
    id: "ralang",
    name: "Ralang Monastery",
    images: [
      {
        id: "ralang-1",
        title: "Temple Inside View",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764525485553!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRF91ZnoteXdF!2m2!1d27.32849856209447!2d88.33547316295622!3f260!4f20!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      },
      {
        id: "ralang-2",
        title: "Compound View",
        iframe: `<iframe src="https://www.google.com/maps/embed?pb=!4v1764525524972!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzR1cGlsdVFF!2m2!1d27.32849642917133!2d88.33524783237412!3f328.6613827455234!4f8.049945641704596!5f0.7820865974627469" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      }
    ]
  }
]
