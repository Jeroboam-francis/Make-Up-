import React from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [filters, setFilters] = React.useState({
    brand: "",
    product_type: "",
    product_tags: "",
    price_greater_than: "",
    price_less_than: "",
    rating_greater_than: "",
    rating_less_than: "",
  });

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    }

    try {
      const response = await axios.get(
        `https://makeup-api.herokuapp.com/api/v1/products.json?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch products. Please try again later.");
    }
  };

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: fetchProducts,
    retry: false,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="App">
      <h1>Makeup Product Search</h1>
      <form onSubmit={handleSubmit} className="filters">
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={filters.brand}
          onChange={handleFilterChange}
          aria-label="Brand"
        />
        <input
          type="text"
          name="product_type"
          placeholder="Product Type"
          value={filters.product_type}
          onChange={handleFilterChange}
          aria-label="Product Type"
        />
        <input
          type="text"
          name="product_tags"
          placeholder="Tags (comma-separated)"
          value={filters.product_tags}
          onChange={handleFilterChange}
          aria-label="Product Tags"
        />
        <input
          type="number"
          name="price_greater_than"
          placeholder="Price Greater Than"
          value={filters.price_greater_than}
          onChange={handleFilterChange}
          aria-label="Price Greater Than"
        />
        <input
          type="number"
          name="price_less_than"
          placeholder="Price Less Than"
          value={filters.price_less_than}
          onChange={handleFilterChange}
          aria-label="Price Less Than"
        />
        <input
          type="number"
          name="rating_greater_than"
          placeholder="Rating Greater Than"
          value={filters.rating_greater_than}
          onChange={handleFilterChange}
          aria-label="Rating Greater Than"
        />
        <input
          type="number"
          name="rating_less_than"
          placeholder="Rating Less Than"
          value={filters.rating_less_than}
          onChange={handleFilterChange}
          aria-label="Rating Less Than"
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <div className="loading">Loading...</div>}
      {isError && <div className="error">{error.message}</div>}

      <div className="products">
        {products?.map((product) => (
          <div key={product.id} className="product">
            <img src={product.image_link} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.brand}</p>
            <p>${product.price}</p>
            <p>Rating: {product.rating || "N/A"}</p>
            <p>{product.product_type}</p>
            <p>Tags: {product.tag_list?.join(", ") || "No tags"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
