import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let controller: AppController;

  beforeEach(() => {
    controller = new AppController(new AppService());
  });

  describe("getHealth", () => {
    it("returns status ok", () => {
      expect(controller.getHealth().status).toBe("ok");
    });

    it("returns service name", () => {
      expect(controller.getHealth().service).toBe("backend");
    });

    it("returns a valid ISO timestamp", () => {
      const { timestamp } = controller.getHealth();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });
  });
});
