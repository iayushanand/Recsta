import { ImageSourcePropType } from "react-native";

export interface GenreItem {
  id: string;
  label: string;
  image: ImageSourcePropType;
}

export const GENRES: GenreItem[] = [
  {
    id: "action",
    label: "Action",
    image: require("../assets/images/genre/action.jpg"),
  },
  {
    id: "animation",
    label: "Animation",
    image: require("../assets/images/genre/animation.jpg"),
  },
  {
    id: "comedy",
    label: "Comedy",
    image: require("../assets/images/genre/comedy.jpg"),
  },
  {
    id: "documentary",
    label: "Documentary",
    image: require("../assets/images/genre/documentary.jpg"),
  },
  {
    id: "drama",
    label: "Drama",
    image: require("../assets/images/genre/drama.jpg"),
  },
  {
    id: "fantasy",
    label: "Fantasy",
    image: require("../assets/images/genre/fantasy.jpg"),
  },
  {
    id: "horror",
    label: "Horror",
    image: require("../assets/images/genre/horror.jpg"),
  },
  {
    id: "musical",
    label: "Musical",
    image: require("../assets/images/genre/musical.jpg"),
  },
  {
    id: "romance",
    label: "Romance",
    image: require("../assets/images/genre/romance.jpg"),
  },
  {
    id: "scifi",
    label: "Sci-Fi",
    image: require("../assets/images/genre/scifi.jpg"),
  },
  {
    id: "thriller",
    label: "Thriller",
    image: require("../assets/images/genre/thriller.jpg"),
  },
  {
    id: "western",
    label: "Western",
    image: require("../assets/images/genre/western.jpg"),
  },
];
