import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import MyData from "../MyData";

describe("MyData privacy portal (WCAG 2.2 AA)", () => {
  it("renders with no axe violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <MyData />
      </MemoryRouter>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
