import { useEffect, useRef, useState } from "react";
import { clamp, round, adjust } from "./Math";
import { motion } from 'framer-motion';

const Card = ({
    id, 
    name,
    img,
    number,
    types,
    supertype = "pokémon",
    subtypes = "basic",
    rarity="",
    foil = "",
    mask = "",
}) => {
    const [frontImg, setFrontImg] = useState("");
    const [backImg, setBackImg] = useState("https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg")
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(document.visibilityState === "visible");
    const [isActive, setIsActive] = useState(false);
    const [interacting, setInteracting] = useState(false);
    const [springRotate, setSpringRotate] = useState({ x: 0, y: 0 });
    const [springGlare, setSpringGlare] = useState({ x: 50, y: 50, o: 0 });
    const [springBackground, setSpringBackground] = useState({ x: 50, y: 50 });
    const [springScale, setSpringScale] = useState(1);
    const [loading, setLoading] = useState(true);
    const [foilStyles, setFoilStyles] = useState("");

    const randomSeed = {
        x: Math.random(),
        y: Math.random()
    }

    const cosmosPosition = {
        x: Math.floor(randomSeed.x * 734),
        y: Math.floor(randomSeed.y * 1280)
    }

    const staticsStyles = {
        "--seedX": randomSeed.x, //??
        "--seedY": randomSeed.y, //??
        "--cosmosbg": `${cosmosPosition.x}px ${cosmosPosition.y}`
    }
    
    const interact = (e) => {
        if (!cardRef) return;

        setInteracting(true);

        if (e.type === "touchmove") {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
        }

        const rect = getCardPosition(); // get element's current size/position
        const absolute = {
            x: e.clientX - rect.left, // get mouse position from left
            y: e.clientY - rect.top, // get mouse position from right
        };
        const percent = {
            x: clamp(round((100 / rect.width) * absolute.x)),
            y: clamp(round((100 / rect.height) * absolute.y)),
        };
        const center = {
            x: percent.x - 50,
            y: percent.y - 50,
        };

        setSpringGlare({
            x: percent.x,
            y: percent.y,
            o: .6
        })

        setSpringRotate({
            x: Math.round(-(center.x / 3.5)),
            y: Math.round(center.y / 2),
        });

        setSpringBackground({
            x: adjust(percent.x, 0, 100, 37, 63),
            y: adjust(percent.y, 0, 100, 33, 67),
        });
    };

    const interactEnd = () => {
        setInteracting(false);
        setSpringRotate({ x: 0, y: 0 });
        setSpringGlare({ x: 50, y: 50, o: 0 });
        setSpringBackground({ x: 50, y: 50 });
        setSpringScale(1);
    }

    const imageLoader = () => {
        setLoading(false); 
      
        if (mask || foil) {
          setFoilStyles(`
            --mask: url(${mask});
            --foil: url(${foil})
          `);
        }
      };

      const getCardPosition = () => {
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect(); // Jetzt auf .current zugreifen
          console.log("Card Position:", rect);
          return rect;
        }
        return null;
      };

      const activate = () => {
        setIsActive(true);
        setInteracting(true);
      }

      useEffect(() => {
        setFrontImg(img);

        document.addEventListener("visibilitychange", () => {
          setIsVisible(document.visibilityState === "visible");
        });
    
        return () => {
          document.removeEventListener("visibilitychange", () => {
            setIsVisible(document.visibilityState === "visible");
          });
        };
      }, []);

    return ( 
        <div
            ref={cardRef}
            className={`card ${types?.join(" ").toLowerCase()} / interactive / ${interacting ? "interacting" : ""} ${loading ? "loading" : ""} ${!!mask ? "masked" : ""} `}
            data-number={number.toLowerCase()}
            data-set={number.toLowerCase()}
            data-subtypes={subtypes?.join(" ").toLowerCase()}
            data-supertype={supertype.toLowerCase()}
            data-rarity={rarity.toLowerCase()}
            data-trainer-gallery={ !!number.match(/^[tg]g/i) || !!( id === "swshp-SWSH076" || id === "swshp-SWSH077" )}
         
            style={{
                "--pointer-from-center": `${ 
                    clamp( Math.sqrt( 
                        (springGlare.y - 50) * (springGlare.y - 50) + 
                        (springGlare.x - 50) * (springGlare.x - 50) 
                    ) / 50, 0, 1) }`,
                "--pointer-from-top": springGlare.y / 100,
                "--pointer-from-left": springGlare.x / 100,
                "--card-opacity": springGlare.o,
                "--background-x": `${springBackground.x}%`,
                "--background-y": `${springBackground.y}%`,
                "--card-scale": springScale
              }}

        >
            <motion.div className="card__translater" style={{"cursor": "pointer"}}        
                   onClick={activate}
                   animate={{
                    rotateY: !isActive ? 180 : 0, 
                    }}
                    transition={{
                        type: "spring",
                        damping: 10,
                        stiffness: 100,
                    }}
            >
                <motion.button
                    className="card__rotator"
                    onPointerMove={interact}
                    onMouseOut={interactEnd}
                    onBlur={interactEnd}
                    aria-label={`Expand the Pokemon Card ${name}.`}
                    animate={{
                        scale: springScale,
                        rotateX: springRotate.y ,
                        rotateY: springRotate.x,
                    }}
                    transition={{
                        type: "spring",
                    }}
                >
                    <img
                        className="card__back"
                        src={backImg}
                        alt="The back of a Pokemon Card, a Pokeball in the center with Pokemon logo above and below"
                        loading="lazy"
                        width="660"
                        height="921"
                        style={{transform: "scaleX(-1)"}}
                    />
                    <div className="card__front" style={{staticsStyles, foilStyles}}>
                        <img
                            src={frontImg}
                            alt="Front design of the {name} Pokemon Card, with the stats and info around the edge"
                            onLoad={imageLoader}
                            loading="lazy"
                            width="660"
                            height="921"
                        />
                        <div className="card__shine"></div>
                        <div className="card__glare"></div>
                    </div>
                </motion.button>
            </motion.div>
        </div>
    )
    
}

export default Card;