import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import Shoes from "../components/Shoes/Shoes";
import { categoriesURL, shoesURL } from "../components/Common/Endpoints";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../components/Common/Auth.Service"; 

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

const server = setupServer(
  http.get(categoriesURL, () => HttpResponse.json(mockCategories)),
  http.get(shoesURL, (req) => {
    const url = new URL(req.request.url);
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
    <AuthProvider>
      <Router>
        <Shoes count={4} setCount={() => {}} {...props} />
      </Router>
    </AuthProvider>
  );
};

it("displays loading message initially", () => {
  renderComponent();
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

it("displays error message on fetch failure", async () => {
  server.use(
    http.get(categoriesURL, () => new HttpResponse(null, { status: 500 })),
    http.get(shoesURL, () => new HttpResponse(null, { status: 500 }))
  );

  renderComponent();
  await waitFor(() =>
    expect(screen.getByText((content) =>
      content.startsWith("Error loading data:")
    )).toBeInTheDocument()
  );
});

it("displays shoes for the selected category", async () => {
  renderComponent();

  await waitFor(() => screen.getByText("Category 1"));
  userEvent.selectOptions(screen.getByRole("combobox"), "cat1");

  await waitFor(() => expect(screen.getByText(/Shoe A/i)).toBeInTheDocument());
  expect(screen.queryByText("Shoe B")).not.toBeInTheDocument();
});

it("displays message when no shoes match the selected category", async () => {
  server.use(
    http.get(shoesURL, () => HttpResponse.json([]))
  );

  renderComponent();

  userEvent.selectOptions(screen.getByRole("combobox"), "cat1");
  await waitFor(() => screen.getByText("There are no shoes for this category."));
});

it("filters shoes based on search input", async () => {
  renderComponent();

  await waitFor(() => screen.getByText(/Shoe A/i));

  userEvent.type(screen.getByPlaceholderText("Search..."), "Shoe B");
  await waitFor(() => expect(screen.getByText(/Shoe B/i)).toBeInTheDocument());
  expect(screen.queryByText(/Shoe A/i)).toBeInTheDocument();
});

it("loads more shoes when Load More button is clicked", async () => {
  renderComponent();

  await waitFor(() => screen.getByText(/Shoe A/i));
  fireEvent.click(screen.getByText("Load More"));

  await waitFor(() => expect(screen.getByText(/Shoe B/i)).toBeInTheDocument());
});
