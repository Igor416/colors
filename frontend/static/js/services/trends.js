const years = [
  {
      "name": "Cerulean",
      "hex": "9dd7d4",
      "pantone": "15-4020",
      "year": "2000"
  },
  {
      "name": "Fuchsia Rose",
      "hex": "c74375",
      "pantone": "17-2031",
      "year": "2001"
  },
  {
      "name": "True Red",
      "hex": "bf1932",
      "pantone": "19-1664",
      "year": "2002"
  },
  {
      "name": "Aqua Sky",
      "hex": "7bc4c4",
      "pantone": "14-4811",
      "year": "2003"
  },
  {
      "name": "Tigerlily",
      "hex": "e2583e",
      "pantone": "17-1456",
      "year": "2004"
  },
  {
      "name": "Blue Turquoise",
      "hex": "53b0ae",
      "pantone": "15-5217",
      "year": "2005"
  },
  {
      "name": "Sand Dollar",
      "hex": "decdbe",
      "pantone": "13-1106",
      "year": "2006"
  },
  {
      "name": "Chili Pepper",
      "hex": "9b1b30",
      "pantone": "19-1557",
      "year": "2007"
  },
  {
      "name": "Blue Iris",
      "hex": "5a5b9f",
      "pantone": "18-3943",
      "year": "2008"
  },
  {
      "name": "Mimosa",
      "hex": "f0c05a",
      "pantone": "14-0848",
      "year": "2009"
  },
  {
      "name": "Turquoise",
      "hex": "45b5aa",
      "pantone": "15-5519",
      "year": "2010"
  },
  {
      "name": "Honeysuckle",
      "hex": "d94f70",
      "pantone": "18-2120",
      "year": "2011"
  },
  {
      "name": "Tangerine Tango",
      "hex": "dd4124",
      "pantone": "17-1463",
      "year": "2012"
  },
  {
      "name": "Emerald",
      "hex": "009473",
      "pantone": "17-5641",
      "year": "2013"
  },
  {
      "name": "Radiant Orchid",
      "hex": "b163a3",
      "pantone": "18-3224",
      "year": "2014"
  },
  {
      "name": "Marsala",
      "hex": "955251",
      "pantone": "18-1438",
      "year": "2015"
  },
  {
      "name": "Rose Quartz",
      "hex": "f7cac9",
      "pantone": "13-1520",
      "year": "2016"
  },
  {
      "name": "Serenity",
      "hex": "92a8d1",
      "pantone": "15-3919",
      "year": "2016"
  },
  {
      "name": "Greenery",
      "hex": "88b04b",
      "pantone": "15-0343",
      "year": "2017"
  },
  {
      "name": "Ultra Violet",
      "hex": "5f4b8b",
      "pantone": "18-3838",
      "year": "2018"
  },
  {
      "name": "Living Coral",
      "hex": "ff6f61",
      "pantone": "16-1546",
      "year": "2019"
  },
  {
      "name": "Classic Blue",
      "hex": "0f4c81",
      "pantone": "19-4052",
      "year": "2020"
  },
  {
      "name": "Ultimate Gray",
      "hex": "939597",
      "pantone": "17-5104",
      "year": "2021"
  },
  {
      "name": "Illuminating",
      "hex": "f5dF4d",
      "pantone": "13-0647",
      "year": "2021"
  },
  {
      "name": "Very Peri",
      "hex": "6768ab",
      "pantone": "17-3938",
      "year": "2022"
  }
]
const decades = [
  {
      "decade": "1920",
      "hexs": ["ffd84d", "b0903d", "f7e7ce", "e30022", "34399d", "a5aaa0"],
      "names": ["tuscan sun", "antique gold", "champagne", "cadmium red", "ultramarine", "deco silver"],
      "description": "Americans in the 1920s were seduced by luxury, leisure and adventure. Spanning from architecture to fashion to graphic design, yellow and gold expelled energy, wealth and happiness. Art Deco influenced designers, artists and architects across the Western world. Radical Modernist art movements such as Cubism, Futurism, Expressionism and Dadaism influenced some American artists as well. In poster design, artists often employed transparent layers of red, blue yellow and black to create a full spectrum of rich color. Bold, velvety colors, such as ultramarine and cadmium red also represent the indulgences of the era."
  },
  {
      "decade": "1930",
      "hexs": ["d02d1c", "eed023", "b0dabe", "99b1c9", "345d98", "3a7359"],
      "names": ["poppy field", "yellow brick road", "mint", "powder blue", "egyptian blue", "jade"],
      "description": "During the wave of the Great Depression Americans persevered by finding affordable family-friendly means of entertainment and recreation. The 1930s was also a time which bore timeless, iconic pop culture that audiences today cherish and reinvent for contemporary tastes and ideals. Film, board games, comics and magazines were created during this time period — some names remain as favorites across generations. Despite the dread and despair of the Depression, there were many joyful, colorful and rich colors that represented the era which represented how Americans kept magic in everyday life."
  },
  {
      "decade": "1940",
      "hexs": ["2a326d", "f4cf0d", "d90707", "4e9fbc", "dabd8f", "b38069"],
      "names": ["war bond blue", "keep calm & canary on", "Rosie's nail polish", "air force blue", "normandy sand", "cadet khaki"],
      "description": "The government had to keep civic and military morale uplifted during the war and rationing. Propaganda posters adopted a rich patriotic palette and promoted a cheerful and romantic sense of duty in the populace. Willie Gillis, a character invented by Rockwell, is a humorous and likable archetype of the all-American drafted soldier. Willie Gillis’s is brighter and more cheery than the more neutral palettes that appeared elsewhere. Primary colors such as blue, navy, red and yellow were widely used alongside muted military colors such as olive, brown and tan. Due to rationing, wartime fashion became more minimalistic and pragmatic. In the world of entertainment adults and children saw movies, cartoons and comic books that espoused pro-America messages to garner more support for the war. In “Der Fuehrer’s Face”, a wartime propaganda short by Disney released in 1943, Donald Duck dreams of his life being controlled by the Nazis, set in somber, muted and muddy tones of green, brown and yellow."
  },
  {
      "decade": "1950",
      "hexs": ["ff91bb", "ffd95c", "4ac6d7", "f5855b", "68bbb8", "e81b23"],
      "names": ["poodle skirt", "lemon meringue", "roadtrip", "motel sunset", "soda fountain", "marilyn in crimson"],
      "description": "During the 1950s, America came home. Soldiers returning from World War II attended college, bought homes and started families. Another decade of American consumerism, glamor and prosperity swept the nation. Advertisers created razor-sharp campaigns for different members of the family: mothers, fathers and the newly-created age group: teenagers. Powdery pastels became fashionable and associated with American housewives to convey youth, warmth and joy. Fashion, cars, graphic design, furniture and decor design were all seeping with delicate pinks, blues and greens. In the 1950s you could have even bought colored toilet paper. The 1950s was a classic age for families of motorists who flocked to fantastical amusement parks and illuminated atomic-age motels in their streamlined vehicles."
  },
  {
      "decade": "1960",
      "hexs": ["cf4917", "f9ac3d", "758c33", "985914", "d0b285", "2d758c"],
      "names": ["burnt siena", "harvest gold", "avocado", "teak", "natural", "blue mustang"],
      "description": "The 1960s are remembered as a radical time in American history and culture. Out with cotton candy colors of and in with rich, psychedelic palettes. Mod motifs and psychedelic patterns clashed with the natural desert-colored hues. Color names such as burnt sienna, harvest gold and avocado are strongly associated with 1960s and 1970s interior design. Designer Saul Bass created stellar opening credits of famous movies in the 1960s for Alfred Hitcock’s films, including Vertigo, North by Northwest and Psycho. Logo designer Paul Rand changed the look of corporate America with his creating timeless, geometric logos. Electrifying pop figures such as the Beatles, The Rolling Stones, Jimi Hendrix and Andy Warhol are also represented by brilliant earth tones."
  },
  {
      "decade": "1970",
      "hexs": ["00a1d3", "a92da3", "fd4d2e", "769f52", "ff68a8", "f8ca38"],
      "names": ["prom suit", "wonka kitsch", "lava lamp glow", "faux fern", "neon dreams", "have a nice day"],
      "description": "The 1970s are marked by glowing pure primary colors as screen technology made a significant transition from black-and-white to color. Colorful Saturday morning cartoons, Sesame Street, The Price is Right and of course, Saturday Night Live all got their start in the 1970s and inspired a generation of youth and teens with their colorful worlds. Kids played with vividly-colored toys such as LEGO, Hot Wheels, Barbie and Play-Doh. Eclectic, vibrant colors from from glowing dance floors and neon lights illuminated the disco and punk scenes. Fashions were far more flamboyant: people wore tightly-fitting brightly-colored polyester pants, shirts and dresses."
  },
  {
      "decade": "1980",
      "hexs": ["3968cb", "ca7cd8", "10e7e2", "ff68a8", "f9eb0f", "ff2153"],
      "names": ["acid wash", "purple rain", "tron turqoise", "miami", "pacman", "powersuit"],
      "description": "The 1980s was one of the first times groundbreaking technology intersected with ways to have fun. The advent of personal computing allowed computer gaming and video games to flourish. Companies created colorful, fantastical advertisements to show off the displays on their devices. Apple’s iconic logo, from 1977-1998 was rainbow-colored to make their products appear friendly to consumers and showcasing the Apple II’s color display. MTV made its debut in 1981 and the era of music videos on television was born. An example of MTV’s edgy appeal were the short spots during commercial breaks where the logo was morphed and shaped by animation and quirky filmmaking. The experimental Italian design group Memphis created the energetic, electric aesthetic look of the 1980s that we recognize and lovingly replicate today."
  },
  {
      "decade": "1990",
      "hexs": ["b13a1a", "832c76", "164db0", "287e9e", "e4a834", "b3346c"],
      "names": ["oprah's couch", "tracksuit", "'I'm blue", "seattle spruce", "'Doh Dijon'", "moody mauve"],
      "description": "Color from the 1960s to the 1980s are known for their bright, vibrant hues. Things didn’t quiet down until the 1990s, which was known for its more neutral, moody color palette. Grunge music was at its height and alternative rock was coming in to the fore; its scene was anti-materialistic and celebrated individualism over consumerism. The offices of corporate America adopted neutral colors: gray, beige and brown with mauve and burgundy accents. Tech companies who positioned their products as being fun and easy to use, such as Nintendo and Apple, released candy-colored plastic devices. Iconic shows on television such as Friends, Seinfeld and Daria also adopted a more sober and muted color palette. Alternatively, the 1990s are also known for noisy jewel-colored fashion, composed of rich blues, bright purples, deep greens, and hot reds."
  },
  {
      "decade": "2000",
      "hexs": ["df19c1", "ff6200", "efc40e", "23d513", "4399de", "e33056"],
      "names": ["Paris Hilton pink", "nickelodeon splat", "little miss sunshine", "limewire", "yes we cyan", "zenon ruby"],
      "description": "The 2000s were marked by a time of decadence in the culture and innovation in technology. Some of the iconic shows of the time closely followed the lives of extravagant Americans, real or fictional — Paris Hilton from The Simple Life, rich teens from My Sweet 16, the outrageous cast from The Jersey Shore, Carrie Bradshaw in Sex and the City, Gretchen Wieners from Mean Girls and, of course, Kim, Khloe and Kourtney Kardashian from Keeping Up with the Kardashians. Skinny jeans finally stuck as a fashionable item, but unfortunately so did Crocs."
  },
  {
      "decade": "2010",
      "hexs": ["efb6bf", "c86e4c", "dddddd", "fe3c71", "2bd566", "0081fe"],
      "names": ["millennial pink", "polished copper", "quartz", "one million likes", "suculent", "social bubble"],
      "description": "The 2010s are known for many things: nostalgia, hipsters and minimalism. From interior design to technology, a growing interest in minimalistic, well-crafted and thoughtfully-designed items became status symbols. The most trendy interiors today feature rustic wood finishes, metallic or stone surfaces, polished copper and brass accents, and cozy deep green tropical plants all carefully arranged before airy sun-bleached white walls. While screen resolution, camera quality and technology grew more complex, digital design simplified to what we call flat design. Flat design is constructed from geometric shapes edged with delicate drop shadows topped with simple sans-serif typography. The ensuing color palette, however, introduces a more fantastical element to the style. Joyful gradients, surrealistic saturated color is a delightful experience for users."
  }
]

class TrendsService {

  constructor() { }

  getYearColors() {
    return years.map(year => new YearColor(year.name, year.hex, year.pantone, year.year))
  }

  getDecadePallete(decade) {
    for (let dec of decades) {
      if (dec.decade == decade) {
        return new DecadePallette(dec.decade, dec.names, dec.hexs, dec.description);
      }
    }

    return null;
  }
}

class YearColor {
  name;
  color;
  pantone;
  year

  constructor(name, hex, pantone, year) {
    this.name = name;
    this.color = Color.toColor(hex);
    this.pantone = pantone;
    this.year = year;
  }
}

class DecadePallette {
  colors = [];

  constructor(decade, names, hexs, description) {
    this.decade = decade;
    this.names = names;

    for (let hex of hexs) {
      this.colors.push(Color.toColor(hex));
    }

    this.description = description;
    this.shortDesc = description.split(' ').slice(0, 21).join(' ')
  }
}
