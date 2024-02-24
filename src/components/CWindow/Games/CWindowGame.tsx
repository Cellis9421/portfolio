import CWindow from "../CWindow";

interface CWindowGameConfig {
  title: string;
  url: string;
  width?: number;
  height?: number;
}

// Enum of available games
export const CWindowGames: { [key: string]: CWindowGameConfig } = {
  OregonTrail: {
    title: "Oregon Trail",
    url: "https://archive.org/embed/msdos_Oregon_Trail_The_1990",
  },
};

/**
 * Puts an iframe inside a CWindow to display games from archive.org
 */
function CWindowGame({ game, defaultOpen }: { game: CWindowGameConfig, defaultOpen: boolean}) {
  if (!game) {
    return null;
  }
  return (
    <CWindow title={game.title} defaultOpen={defaultOpen}>
      <iframe
        src={game.url}
        width={game.width || "560"}
        height={game.height || "450"}
      ></iframe>
    </CWindow>
  );
}

export default CWindowGame;
