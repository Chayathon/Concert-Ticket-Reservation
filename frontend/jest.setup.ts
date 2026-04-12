import "@testing-library/jest-dom";

if (typeof window !== "undefined") {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
}

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

(
    global as unknown as { ResizeObserver: typeof ResizeObserverMock }
).ResizeObserver = ResizeObserverMock;
