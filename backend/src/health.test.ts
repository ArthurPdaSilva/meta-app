/// <reference types="vitest/globals" />
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { HealthController } from "./health.controller";

describe("Health", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [HealthController],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		if (app) await app.close();
	});

	it("GET /health", async () => {
		const res = await request(app.getHttpServer()).get("/health").expect(200);
		expect(res.body).toEqual({ status: "ok" });
	});
});
