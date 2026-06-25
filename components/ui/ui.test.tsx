import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

describe("shadcn-compatible ui primitives", () => {
  it("renders button variants, sizes and asChild composition", () => {
    render(
      <div>
        <Button>Default action</Button>
        <Button variant="outline" size="sm">
          Outline action
        </Button>
        <Button variant="secondary" size="lg">
          Secondary action
        </Button>
        <Button variant="ghost" size="icon" aria-label="Ghost action" />
        <Button variant="link">Link action</Button>
        <Button variant="destructive">Delete action</Button>
        <Button asChild>
          <a href="/docs">Docs action</a>
        </Button>
      </div>,
    );

    expect(screen.getByRole("button", { name: "Default action" })).toHaveClass(
      "bg-primary",
    );
    expect(screen.getByRole("button", { name: "Outline action" })).toHaveClass(
      "h-8",
    );
    expect(screen.getByRole("button", { name: "Secondary action" })).toHaveClass(
      "h-10",
    );
    expect(screen.getByRole("button", { name: "Ghost action" })).toHaveClass(
      "size-9",
    );
    expect(screen.getByRole("button", { name: "Delete action" })).toHaveClass(
      "bg-destructive",
    );
    expect(screen.getByRole("link", { name: "Docs action" })).toHaveAttribute(
      "href",
      "/docs",
    );
    expect(buttonVariants({ variant: "link" })).toContain("underline-offset-4");
  });

  it("renders badge variants and accepts custom classes", () => {
    render(
      <div>
        <Badge>Default badge</Badge>
        <Badge variant="secondary">Secondary badge</Badge>
        <Badge variant="destructive">Danger badge</Badge>
        <Badge variant="outline" className="custom-badge">
          Outline badge
        </Badge>
        <Badge asChild>As child badge</Badge>
      </div>,
    );

    expect(screen.getByText("Default badge")).toHaveClass("bg-primary");
    expect(screen.getByText("Secondary badge")).toHaveClass("bg-secondary");
    expect(screen.getByText("Danger badge")).toHaveClass("bg-destructive");
    expect(screen.getByText("Outline badge")).toHaveClass("custom-badge");
    expect(screen.getByText("As child badge")).toHaveAttribute("data-slot", "badge");
  });

  it("renders card sections with shadcn data slots", () => {
    render(
      <Card className="custom-card">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>Card content</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Card title")).toHaveAttribute("data-slot", "card-title");
    expect(screen.getByText("Card description")).toHaveAttribute(
      "data-slot",
      "card-description",
    );
    expect(screen.getByText("Card content")).toHaveAttribute("data-slot", "card-content");
    expect(screen.getByText("Card footer")).toHaveAttribute("data-slot", "card-footer");
    expect(screen.getByText("Card title").closest("[data-slot='card']")).toHaveClass(
      "custom-card",
    );
  });

  it("renders horizontal and vertical separators", () => {
    render(
      <div>
        <Separator data-testid="horizontal-separator" />
        <Separator data-testid="vertical-separator" orientation="vertical" />
      </div>,
    );

    expect(screen.getByTestId("horizontal-separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
    expect(screen.getByTestId("horizontal-separator")).toHaveClass("h-px");
    expect(screen.getByTestId("vertical-separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
    expect(screen.getByTestId("vertical-separator")).toHaveClass("w-px");
  });

  it("merges Tailwind classes predictably", () => {
    expect(cn("px-2 text-sm", "px-4", false && "hidden")).toBe("text-sm px-4");
  });
});
