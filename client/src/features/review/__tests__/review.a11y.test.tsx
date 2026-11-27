import { describe, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import ReviewQueue from "../ReviewQueue";

vi.mock("../../../store/auth", () => ({
  useAuth: () => ({ token: "test-token", member: { isReviewer: true } }),
}));

vi.mock("../../../api/client", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({ data: { isReviewer: true, records: [] } }),
    ),
  },
}));

describe("Reviewer queue (WCAG 2.2 AA)", () => {
  it("renders with no axe violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <ReviewQueue />
      </MemoryRouter>,
    );
    // Let async effects (RoleGate + queue fetch) settle before asserting
    await waitFor(() => {
      expect(container.textContent).toContain("Tentative queue");
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
