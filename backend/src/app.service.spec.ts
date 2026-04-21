import { AppService } from "./app.service";

describe("AppService", () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  describe("getHealth", () => {
    it("returns status ok and service name", () => {
      const result = service.getHealth();
      expect(result.status).toBe("ok");
      expect(result.service).toBe("backend");
    });

    it("returns a valid ISO timestamp", () => {
      const result = service.getHealth();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });
});
