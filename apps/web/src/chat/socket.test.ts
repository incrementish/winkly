import { beforeEach, describe, expect, it, vi } from "vitest";
import { io } from "socket.io-client";

import { createLobbySocket, createSocket } from "./socket";

vi.mock("socket.io-client", () => ({ io: vi.fn() }));

describe("Socket.IO connections", () => {
  beforeEach(() => {
    vi.mocked(io).mockClear();
  });

  it("uses polling for the lobby without attempting a WebSocket upgrade", () => {
    createLobbySocket();

    expect(io).toHaveBeenCalledWith(
      expect.stringMatching(/\/lobby$/),
      expect.objectContaining({ forceNew: true, transports: ["polling"] }),
    );
  });

  it("uses polling for chat while preserving authentication and recovery", () => {
    createSocket("Alice", "token", undefined, {
      guestId: "guest",
      secret: "secret",
    });

    expect(io).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        auth: { token: "token", guestId: "guest", resumeSecret: "secret" },
        reconnection: false,
        transports: ["polling"],
      }),
    );
  });
});
