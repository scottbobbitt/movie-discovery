import { useSelector } from "react-redux";
import { BsBookmark } from "react-icons/bs";

import { MovieCard } from "@/common";
import { RootState } from "@/store";
import { smallMaxWidth } from "@/styles";

const Watchlist = () => {
  const watchlist = useSelector((state: RootState) => state.watchlist);

  return (
    <section className={`${smallMaxWidth} py-8`}>
      <h1 className="sm:text-3xl text-2xl font-extrabold dark:text-gray-50 text-gray-900 font-robotoCondensed mb-6">
        My Watchlist
      </h1>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 dark:text-gray-400 text-gray-500">
          <BsBookmark className="w-12 h-12" />
          <p className="sm:text-lg text-base font-nunito">
            No movies or shows saved yet.
          </p>
          <p className="text-sm font-nunito">
            Browse movies and TV shows and click the bookmark icon to save them here.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap xs:gap-4 gap-[14px] justify-center">
          {watchlist.map((movie) => (
            <div
              key={movie.id}
              className="flex flex-col xs:gap-4 gap-2 xs:max-w-[170px] max-w-[124px] rounded-lg lg:mb-6 md:mb-5 sm:mb-4 mb-[10px]"
            >
              <MovieCard movie={movie} category={movie.category} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Watchlist;
