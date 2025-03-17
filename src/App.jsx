import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

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

    const response = await axios.get(
      `http://makeup-api.herokuapp.com/api/v1/products.json?${params.toString()}`
    );
    return response.data;
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
        />
        <input
          type="text"
          name="product_type"
          placeholder="Product Type"
          value={filters.product_type}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="product_tags"
          placeholder="Tags (comma-separated)"
          value={filters.product_tags}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="price_greater_than"
          placeholder="Price Greater Than"
          value={filters.price_greater_than}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="price_less_than"
          placeholder="Price Less Than"
          value={filters.price_less_than}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="rating_greater_than"
          placeholder="Rating Greater Than"
          value={filters.rating_greater_than}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="rating_less_than"
          placeholder="Rating Less Than"
          value={filters.rating_less_than}
          onChange={handleFilterChange}
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
            <p>Rating: {product.rating}</p>
            <p>{product.product_type}</p>
            <p>Tags: {product.tag_list?.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
