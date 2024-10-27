import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import Shoes from "../components/Shoes/Shoes";
import { categoriesURL, shoesURL } from "../components/Common/Endpoints";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const mockCategories = [
  { code: "cat1", description: "Category 1" },
  { code: "cat2", description: "Category 2" },
];

const mockShoes = [
  {
    id: "1",
    category: "cat1",
    price: 50,
    name: "Shoe A",
    description: "Description A",
    quantity: 10,
    images: [{ image: "image_url_A.jpg" }],
  },
  {
    id: "2",
    category: "cat2",
    price: 100,
    name: "Shoe B",
    description: "Description B",
    quantity: 5,
    images: [{ image: "image_url_B.jpg" }],
  },
];

// Setup MSW server
const server = setupServer(
  http.get(categoriesURL, () => HttpResponse.json(mockCategories)),
  http.get(shoesURL, (req) => {
    const url = new URL(req.request.url); // Convert the string URL to a URL object
    const category = url.searchParams.get("category");
    return HttpResponse.json(
      category
        ? mockShoes.filter((shoe) => shoe.category === category)
        : mockShoes
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderComponent = (props = {}) => {
  return render(
    <Router>
      <Shoes count={4} setCount={() => {}} {...props} />
    </Router>
  );
};

it("displays loading message initially", () => {
  renderComponent();
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

it("displays error message on fetch failure", async () => {
  server.use(
    http.get(categoriesURL, () => HttpResponse.json({ message : "Error loading data"}, { status: 500 })),
    http.get(shoesURL, () => HttpResponse.json({ message : "Error loading data"}, { status: 500 }))
  );

  renderComponent();
  await waitFor(() =>
    expect(screen.getByText("Error loading data:")).toBeInTheDocument()
  );
});

it("displays shoes for the selected category", async () => {
  renderComponent();

  // Wait for categories to load and select a category
  await waitFor(() => screen.getByText("Category 1"));
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "cat1" } });

  await waitFor(() => expect(screen.getByText("Shoe A")).toBeInTheDocument());
  expect(screen.queryByText("Shoe B")).not.toBeInTheDocument();
});

it("displays message when no shoes match the selected category", async () => {
  server.use(
    http.get(shoesURL, () => HttpResponse.json([]))
  );

  renderComponent();

  fireEvent.change(screen.getByRole("combobox"), { target: { value: "cat1" } });
  await waitFor(() => screen.getByText("There are no shoes for this category."));
});

it("filters shoes based on search input", async () => {
  renderComponent();

  // Wait for shoes to load
  await waitFor(() => screen.getByText("Shoe A"));

  // Enter search term
  userEvent.type(screen.getByPlaceholderText("Search..."), "Shoe B");
  await waitFor(() => expect(screen.getByText("Shoe B")).toBeInTheDocument());
  expect(screen.queryByText("Shoe A")).not.toBeInTheDocument();
});

it("loads more shoes when Load More button is clicked", async () => {
  renderComponent();

  // Wait for initial load of shoes
  await waitFor(() => screen.getByText("Shoe A"));

  // Click the load more button
  fireEvent.click(screen.getByText("Load More"));

  // Check if more shoes have been loaded (customize if there's more data to load)
  await waitFor(() => expect(screen.getByText("Shoe B")).toBeInTheDocument());
});
