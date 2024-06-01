import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";

const Listings = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Local authentication state
  const [listings, setListings] = useState([]);

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== "All"
          ? `http://localhost:3001/properties?category=${selectedCategory}`
          : "http://localhost:3001/properties",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setListings(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    if (isAuthenticated) {
      setSelectedCategory(category);
    } else {
      // Redirect to login page if not authenticated
      window.location.href = '/';
    }
  };

  // Simulate authentication check (for demonstration purposes)
  useEffect(() => {
    // Replace this with actual authentication check logic
    const checkAuth = () => {
      // Assume a function `isUserAuthenticated` that returns a boolean
      const authStatus = true; // Replace with actual authentication check
      setIsAuthenticated(authStatus);
    };

    checkAuth();
  }, []);

  return (
    <>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${category.label === selectedCategory ? "selected" : ""}`}
            key={index}
            onClick={() => handleCategoryClick(category.label)} // Call handleCategoryClick on category click
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {isAuthenticated ? (
            <div className="listings">
              {listings.map(
                ({
                  _id,
                  creator,
                  listingPhotoPaths,
                  city,
                  province,
                  country,
                  category,
                  type,
                  price,
                  booking = false
                }) => (
                  <ListingCard
                    key={_id} // Add a unique key
                    listingId={_id}
                    creator={creator}
                    listingPhotoPaths={listingPhotoPaths}
                    city={city}
                    province={province}
                    country={country}
                    category={category}
                    type={type}
                    price={price}
                    booking={booking}
                  />
                )
              )}
            </div>
          ) : (
            <p>Please login to view listings.</p>
          )}
        </>
      )}
    </>
  );
};

export default Listings;
