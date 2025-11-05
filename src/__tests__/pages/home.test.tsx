import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock the components that are imported
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardDescription: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock("lucide-react", () => ({
  ShoppingBag: () => <div data-testid="shopping-bag-icon" />,
  Truck: () => <div data-testid="truck-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Users: () => <div data-testid="users-icon" />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to EthioShop/i)).toBeInTheDocument();
  });

  it("renders the hero section", () => {
    render(<Home />);
    expect(
      screen.getByText(/Ethiopia's premier e-commerce platform/i)
    ).toBeInTheDocument();
  });

  it("renders the start shopping button", () => {
    render(<Home />);
    expect(screen.getByText(/Start Shopping/i)).toBeInTheDocument();
  });

  it("renders the become a vendor button", () => {
    render(<Home />);
    expect(screen.getByText(/Become a Vendor/i)).toBeInTheDocument();
  });

  it("renders the features section", () => {
    render(<Home />);
    expect(screen.getByText(/Why Choose EthioShop?/i)).toBeInTheDocument();
  });

  it("renders the categories section", () => {
    render(<Home />);
    expect(screen.getByText(/Popular Categories/i)).toBeInTheDocument();
  });

  it("renders the call to action section", () => {
    render(<Home />);
    expect(screen.getByText(/Ready to Start Shopping?/i)).toBeInTheDocument();
  });

  it("renders all feature cards", () => {
    render(<Home />);
    expect(screen.getByText(/Local & International/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure Payments/i)).toBeInTheDocument();
    expect(screen.getByText(/Fast Delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/Vendor Support/i)).toBeInTheDocument();
    expect(screen.getByText(/Quality Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Bilingual Support/i)).toBeInTheDocument();
  });

  it("renders category items", () => {
    render(<Home />);
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/Fashion/i)).toBeInTheDocument();
    expect(screen.getByText(/Home & Garden/i)).toBeInTheDocument();
    expect(screen.getByText(/Sports/i)).toBeInTheDocument();
    expect(screen.getByText(/Books/i)).toBeInTheDocument();
    expect(screen.getByText(/Beauty/i)).toBeInTheDocument();
  });
});
