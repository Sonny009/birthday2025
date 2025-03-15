
import './css/base.css';
import './css/cards.css';
import './css/basic.css';
import './css/reverse-holo.css';
import './css/regular-holo.css';
import './css/cosmos-holo.css';
import './css/amazing-rare.css';
import './css/radient-holo.css';
import './css/v-regular.css';
import './css/v-full-art.css';
import './css/v-max.css';
import './css/v-star.css';
import './css/trainer-full-art.css';
import './css/rainbow-holo.css';
import './css/rainbow-alt.css';
import './css/secret-rare.css';
import './css/trainer-gallery-holo.css';
import './css/trainer-gallery-v-regular.css';
import './css/trainer-gallery-v-max.css';
import './css/trainer-gallery-secret-rare.css';
import './css/shiny-rare.css';
import './css/shiny-v.css';
import './css/shiny-vmax.css';
import './css/swsh-pikachu.css';
import './App.css';
import Card from './Card';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function App() {

    const [steamGift, setSteamGift] = useState(null);
    const [courseGift, setCourseGift] = useState([])
    const [pokemonCards, setPokemonCards] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const getCards = async() => {
        const cardFetch = await fetch("/data/cards.json");
        const cards = await cardFetch.json();
        return cards;
    }

    const loadCards = async() => {
        const cards = await getCards();console.log(cards);
        setSteamGift(cards[0]);
        setCourseGift(cards.slice(1, 4));
        setPokemonCards(cards.slice(4));
        setIsLoading(false);
    }

    
  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div className="App">
        <motion.header className="App-header" initial={{ scale: 0, rotate: -15 }}
                animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [ -15, 5, 0 ]
                }}
                transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    bounce: 0.5
                }}><img src={"assets/birthday.png"} className="App-logo" alt="logo" />
        <motion.a
          className="App-link"
          href="#gifts"
          animate={{
            y: [0, -30, 0, -40, 0, -20, 0],
            scale: [1, 1.1, 1, 1.15, 1, 0.95, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
          }}
        >
          <img src={"assets/gift.png"} className="gift" alt="logo" />
        </motion.a>
        </motion.header>
      <div id="gifts">
        <p className="pacifico-regular">Ich dachte mir vielleicht mal etwas anders und was tun. Aber da ich nicht genau wusste, worauf du Bock hast, hier ein paar Vorschläge. Gibt aber natürlich noch vieles anderes.</p>
        <div >
            <div className="card-grid">
            {!isLoading && courseGift.map((card, index) => (
                <Card key={index} 
                    id={card.id}
                    name={card.name}
                    img={card.images.large}
                    number={card.number}
                    types={card.types}
                    rarity={card.rarity}
                    supertype={card.supertype}
                    subtypes={card.subtypes}
                    foil={card.images.foil}
                    mask={card.images.mask}
                 /> 
            ))}
            </div>
            <div className='steam-gift-header pacifico-regular'>
                Bonus
            </div>
            <div className="card-grid steam-gift">
                {!isLoading && <Card 
                    id={steamGift.id}
                    name={steamGift.name}
                    img={steamGift.images.large}
                    number={steamGift.number}
                    types={steamGift.types}
                    rarity={steamGift.rarity}
                    supertype={steamGift.supertype}
                    subtypes={steamGift.subtypes} 
                    foil={steamGift.images.foil}
                    mask={steamGift.images.mask}
                />}
            </div>
        </div>

        <div id="pokemon-cards">
        <div >
            <div className='steam-gift-header pacifico-regular'>
                Weils cool ist und ich es dir zeigen wollte
            </div>
            <div className="card-grid">
            {!isLoading && pokemonCards.map((card, index) => (
                <Card key={index} 
                    id={card.id}
                    name={card.name}
                    img={card.images.large}
                    number={card.number}
                    types={card.types}
                    rarity={card.rarity}
                    supertype={card.supertype}
                    subtypes={card.subtypes}
                    foil={card.images.foil}
                    mask={card.images.mask}
                 /> 
            ))}
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
