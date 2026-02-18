import { useSelector, useDispatch } from "react-redux";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

import { RootState, AppDispatch } from "@/store";
import { addToWatchlist, removeFromWatchlist, IWatchlistMovie } from "@/store/watchlistSlice";

interface WatchlistButtonProps {
  movie: IWatchlistMovie;
  variant?: "card" | "detail";
}

const WatchlistButton = ({ movie, variant = "card" }: WatchlistButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSaved = useSelector((state: RootState) =>
    state.watchlist.some((item) => item.id === movie.id)
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist(movie));
    }
  };

  if (variant === "detail") {
    return (
      <button
        onClick={handleClick}
        aria-label={isSaved ? "Remove from watchlist" : "Add to watchlist"}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-400 hover:border-white text-gray-300 hover:text-white transition-colors duration-200 text-sm font-nunito w-fit"
      >
        {isSaved ? (
          <BsBookmarkFill className="w-4 h-4 text-[#ff0000]" />
        ) : (
          <BsBookmark className="w-4 h-4" />
        )}
        {isSaved ? "Saved to watchlist" : "Add to watchlist"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isSaved ? "Remove from watchlist" : "Add to watchlist"}
      className="absolute top-2 right-2 z-10 p-[6px] rounded-full bg-black/60 hover:bg-black/80 transition-colors duration-200 text-white"
    >
      {isSaved ? (
        <BsBookmarkFill className="w-[14px] h-[14px] text-[#ff0000]" />
      ) : (
        <BsBookmark className="w-[14px] h-[14px]" />
      )}
    </button>
  );
};

export default WatchlistButton;
